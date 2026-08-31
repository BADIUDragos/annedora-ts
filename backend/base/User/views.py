import logging

from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.http import int_to_base36, base36_to_int
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .serializers import UserSerializer
from ..permission_classes import IsSelfOrAdmin
from django.conf import settings

logger = logging.getLogger(__name__)


@permission_classes([IsAuthenticated, IsAdminUser])
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@permission_classes([IsAuthenticated, IsSelfOrAdmin])
class UserRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]


@permission_classes([IsAuthenticated, IsAdminUser])
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


RESET_EMAIL_SENT_DETAIL = (
    "If an account exists for this email, a reset link has been sent."
)


@api_view(['POST'])
def forgot_password(request):

    email = request.data.get('email')
    response = Response({"detail": RESET_EMAIL_SENT_DETAIL}, status=status.HTTP_200_OK)

    if not email:
        return response

    user = User.objects.filter(email__iexact=email).first()
    if user is None:
        return response

    token = default_token_generator.make_token(user)
    uid = int_to_base36(user.pk)

    reset_link = "https://annedora.ca/changepassword?uid=%s&token=%s" % (uid, token)

    context = {
        'user': user.username,
        'reset_link': reset_link,
    }

    email_subject = "Password Reset"
    email_html_body = render_to_string('PasswordResetEmail.html', context)
    email_text_body = strip_tags(email_html_body)

    message = EmailMultiAlternatives(
        email_subject,
        email_text_body,
        settings.EMAIL_HOST_USER,
        [user.email],
    )

    message.attach_alternative(email_html_body, "text/html")

    try:
        message.send(fail_silently=False)
    except Exception as exc:
        # Resend/Anymail raises API errors, not SMTPException — those used to
        # become an unhandled 500 after the SMTP-to-Resend switch.
        logger.exception("Failed to send password reset email to %s: %s", user.email, exc)

    return response


@api_view(['GET'])
def validate_token(request):

    uidb36 = request.query_params.get('uid')
    token = request.query_params.get('token')

    if request.method == 'GET':
        if uidb36 is None or token is None:
            return Response({"detail": "Missing token or UID."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = base36_to_int(uidb36)
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, OverflowError):
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            return Response({"detail": "Token is valid."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Token is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def update_password(request):

    uidb36 = request.data['uid']
    token = request.data['token']

    if uidb36 is None or token is None:
        return Response({"detail": "Missing token or UID."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = base36_to_int(uidb36)
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, OverflowError):
        return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        new_password = request.data.get('password', None)
        if new_password:
            user.password = make_password(new_password)
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "New password is missing."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail": "Token is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)
