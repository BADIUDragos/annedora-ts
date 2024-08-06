from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail

from backend.settings import EMAIL_HOST_USER
from base.ContactForm.serializer import ContactFormSerializer


class ContactFormView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            name = data['name']
            email = data['email']
            address = data['address']
            surface_area = data['surfaceArea']
            produce = data['produce']

            # Compose email
            subject = 'Pollination service for %s' % name
            message = f"""
            Name: {name}
            Email: {email}
            Address: {address}
            Surface Area: {surface_area}
            Produce: {produce}
            """
            from_email = EMAIL_HOST_USER
            recipient_list = ['dragos.badiu.a@hotmail.com']

            # Send email
            send_mail(subject, message, from_email, recipient_list)

            return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)

        errors = serializer.errors
        first_error_key = next(iter(errors))
        first_error_message = errors[first_error_key][0]
        formatted_error = {
            'detail': first_error_message
        }

        return Response(formatted_error, status=status.HTTP_400_BAD_REQUEST)
