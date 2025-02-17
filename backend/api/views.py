from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import Utils
from rest_framework import status
from django.conf import settings


class UserCreateApiView(generics.CreateAPIView):
    queryset = CustomUser
    serializer_class = CustomUserSerializer
    raise_exception = True
    #permission_classes = [IsAuthenticated]


class PasswordResetAPIView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        user = CustomUser.objects.get(email=email)
        token = RefreshToken.for_user(user).access_token
        redirect_link = 'http://localhost:5173/reset-password?token=' + str(token)
        email_data = {
            'subject': 'Password Reset',
            'body': f'Follow the link to reset your password \n {redirect_link}',
            'to': email,
        }
        Utils.send_email(email_data)
        return Response({'message': 'Password reset link has been sent to your email', 'status': status.HTTP_200_OK})
    

class PasswordResetConfirmAPIView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get('token')
        password = serializer.validated_data.get('password')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomUser.objects.get(id=payload['user_id'])
            user.set_password(password)
            user.save()
            return Response({'message': 'Password reset successful', 'status': status.HTTP_200_OK})
        
        except jwt.ExpiredSignatureError as e:
            return Response({'error': 'Token has expired', 'status': status.HTTP_400_BAD_REQUEST})
        except jwt.exceptions.DecodeError as e:
            return Response({'error': 'Invalid token', 'status': status.HTTP_400_BAD_REQUEST})
        except CustomUser.DoesNotExist as e:
            return Response({'error': 'User does not exist', 'status': status.HTTP_400_BAD_REQUEST})
        except Exception as e:
            return Response({'error': 'An error occurred', 'status': status.HTTP_400_BAD_REQUEST})
    