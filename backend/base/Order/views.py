import decimal
from datetime import datetime

import stripe
from stripe import StripeError

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.response import Response

from backend.settings import STRIPE_SECRET
from base.Order.models import Order, ShippingAddress, OrderItem
from base.Order.serializer import OrderSerializer, BillSerializer, StripeSerializer, \
    StripePaymentIntentResponseSerializer
from base.Product.models import Product
from base.signals import order_created, order_shipped, order_delivered


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data
    order_items = data['orderItems']
    order_option = data['orderOption']

    if len(order_items) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    if order_option not in ['Shipping', 'Pick-up']:
        return Response({'detail': 'Wrong order option'}, status=status.HTTP_400_BAD_REQUEST)

    else:

        order = Order.objects.create(
            user=user,
            itemsPrice=data['itemsPrice'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
            isPaid=True,
            paidAt=datetime.now(),
            order_option=order_option
        )

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country='Canada'
        )

        for i in order_items:
            product = Product.objects.get(id=i['productId'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )

            product.count_in_stock -= int(item.qty)
            product.save()

            order_created.send(sender=Order, order=order)

        serializer = OrderSerializer(order, many=False)

        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


# Admin views

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_shipped(request, pk):
    order = Order.objects.get(_id=pk)

    order.isShipped = True
    order.shippedAt = datetime.now()
    order.save()

    order_shipped.send(sender=Order, order=order)

    return Response('Order was delivered')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isShipped = True
    order.shippedAt = datetime.now()
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    order_delivered.send(sender=Order, order=order)

    return Response('Order was delivered')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_prices(request):
    subtotal = 0

    items = request.data['items']
    order_option = request.data.get('option')

    if not items:
        return Response({'detail': 'No Items in Request'}, status=status.HTTP_400_BAD_REQUEST)
    if not order_option:
        return Response({'detail': 'No Order Option in Request'}, status=status.HTTP_400_BAD_REQUEST)

    for item in items:
        product = Product.objects.get(id=item['id'])
        qty = item['qty']
        if product.count_in_stock < qty:
            return Response({'detail': 'Only %d %s are currently left in stock' % (product.count_in_stock, product.name)},
                            status=status.HTTP_400_BAD_REQUEST)
        price = product.price * qty
        subtotal += price

    shipping = 0
    if order_option == 'Shipping':
        if subtotal < 100.00:
            shipping = 15
    tax_rate = decimal.Decimal('0.14975')
    tax = (subtotal + shipping) * tax_rate

    total = subtotal + tax + shipping

    serializer = BillSerializer({'subtotal': subtotal, 'tax': tax, 'shipping': shipping, 'total': total})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stripe_info(request):
    stripe_public = "pk_live_51MvqTOJMCbcrYDEx49WfKIyVOXRtgzYZPm6ppg4DMZGLV5QMSFOIKKY95QAFhdfp3RVT0ZLfkQbHtI9DU1O7z8tl00YNHHLrfV"

    serializer = StripeSerializer({'stripe_public': stripe_public})
    return Response(serializer.data)


@api_view(['POST'])
def create_payment_intent(request):
    data = request.data
    amount = int(float(data['amount']) * 100)
    currency = 'CAD'
    description = ''

    stripe.api_key = STRIPE_SECRET

    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            description=description,
        )
        response_serializer = StripePaymentIntentResponseSerializer(payment_intent)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    except StripeError as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
