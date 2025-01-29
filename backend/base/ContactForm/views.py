import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

from backend.settings import EMAIL_HOST_USER
from base.ContactForm.serializer import ContactFormSerializer


class ContactFormView(APIView):

    def post(self, request, *args, **kwargs):
        # Extract reCAPTCHA token from request data
        recaptcha_token = request.data.get("recaptcha_token")

        if not recaptcha_token:
            return Response({"error": "reCAPTCHA token is missing."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify reCAPTCHA with Google
        recaptcha_url = "https://www.google.com/recaptcha/api/siteverify"
        recaptcha_data = {
            "secret": settings.RECAPTCHA_SECRET_KEY,  # Get secret key from settings.py
            "response": recaptcha_token
        }
        recaptcha_response = requests.post(recaptcha_url, data=recaptcha_data)
        recaptcha_result = recaptcha_response.json()

        if not recaptcha_result.get("success"):
            return Response({"error": "Invalid reCAPTCHA. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        # Process form if reCAPTCHA is valid
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            name = data['name']
            email = data['email']
            address = data['address']
            surface_area = data['surfaceArea']
            produce = data['produce']

            # Compose email
            subject = f'Pollination service for {name}'
            message = f"""
            Name: {name}
            Email: {email}
            Address: {address}
            Surface Area: {surface_area}
            Produce: {produce}
            """
            from_email = settings.EMAIL_HOST_USER
            recipient_list = ['dragos.badiu.a@hotmail.com']

            # Send email
            send_mail(subject, message, from_email, recipient_list)

            return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)

        # Handle validation errors
        errors = serializer.errors
        first_error_key = next(iter(errors))
        first_error_message = errors[first_error_key][0]
        formatted_error = {
            "detail": first_error_message
        }

        return Response(formatted_error, status=status.HTTP_400_BAD_REQUEST)