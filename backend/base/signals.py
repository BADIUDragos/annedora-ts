from django.db.models.signals import pre_save
from django.contrib.auth.models import User
from django.dispatch import Signal
from django.conf import settings
from django.template.loader import render_to_string

from base.models import Order

from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


def update_user(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email


pre_save.connect(update_user, sender=User)

order_created = Signal()


def send_order_confirmation_update_to_owner(order):
    user = order.user
    order_items = order.orderitem_set.all()
    email_subject = 'Comanda noua'
    context = {
        'user': user,
        'order': order,
        'order_items': order_items,
    }
    email_html_body = render_to_string('NewOrderConfirmationToShip.html', context)
    email_text_body = strip_tags(email_html_body)

    email = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.DEFAULT_FROM_EMAIL,
        ['valentin.prunoiu@annedora.ca'],
    )

    try:
        email.attach_alternative(email_html_body, "text/html")
        email.send(fail_silently=False)
    except Exception as e:
        print(e)


def send_order_confirmation_email(sender, order, **kwargs):
    user = order.user
    order_items = order.orderitem_set.all()

    email_subject = 'Order Confirmation'
    context = {
        'user': user,
        'order': order,
        'order_items': order_items,
    }

    email_html_body = render_to_string('UserOrderConfirmation.html', context)
    email_text_body = strip_tags(email_html_body)

    email = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

    email.attach_alternative(email_html_body, "text/html")
    email.send(fail_silently=False)

    send_order_confirmation_update_to_owner(order)


order_created.connect(send_order_confirmation_email, sender=Order)

order_shipped = Signal()


def send_order_confirmation_email_shipped(sender, order, **kwargs):
    user = order.user
    order_items = order.orderitem_set.all()

    email_subject = 'Your order was shipped !'
    context = {
        'user': user,
        'order': order,
        'order_items': order_items,
    }
    email_html_body = render_to_string('UserOrderConfirmationShipped.html', context)
    email_text_body = strip_tags(email_html_body)

    email = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

    email.attach_alternative(email_html_body, "text/html")
    email.send(fail_silently=False)


order_shipped.connect(send_order_confirmation_email_shipped, sender=Order)


order_delivered = Signal()


def send_order_confirmation_email_delivered(sender, order, **kwargs):
    user = order.user
    order_items = order.orderitem_set.all()

    email_subject = 'Your order was delivered !'
    context = {
        'user': user,
        'order': order,
        'order_items': order_items,
    }
    email_html_body = render_to_string('UserOrderConfirmationDelivered.html', context)
    email_text_body = strip_tags(email_html_body)

    email = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

    email.attach_alternative(email_html_body, "text/html")
    email.send(fail_silently=False)


order_delivered.connect(send_order_confirmation_email_delivered, sender=Order)