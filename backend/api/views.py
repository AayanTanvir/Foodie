from django.shortcuts import render
from .models import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CustomUserSerializer

class UserCreateApiView(generics.CreateAPIView):
    queryset = CustomUser
    serializer_class = CustomUserSerializer
    raise_exception = True
    