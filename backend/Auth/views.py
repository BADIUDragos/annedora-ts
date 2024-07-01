from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from Auth.serializers import RegisterSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['first_name'] = user.first_name
        token['permissions'] = [str(permission.codename) for permission in user.user_permissions.all()]
        token['email'] = user.email
        token['isSuperuser'] = user.is_superuser
        token['isStaff'] = user.is_staff

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data
    serializer = RegisterSerializer(data=data)

    if serializer.is_valid():
        user = serializer.save()

        # Generate tokens for the user
        token_serializer = MyTokenObtainPairSerializer(data={
            'username': user.username,
            'password': data['password']
        })
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data

        return Response(tokens, status=status.HTTP_201_CREATED)
    else:
        errors = serializer.errors
        first_error_key = next(iter(errors))
        first_error_message = errors[first_error_key][0]
        formatted_error = {
            'detail': first_error_message
        }
        return Response(formatted_error, status=status.HTTP_400_BAD_REQUEST)

