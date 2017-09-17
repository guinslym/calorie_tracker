from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from users.models import UserProfile
from users.serializers import *
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated
from knox.auth import TokenAuthentication
from users.permissions import IsStaffOrAdmin

class UserRegister(generics.CreateAPIView):
	serializer_class = UserSerializer
	queryset = User.objects.all()

class UserLogin(generics.CreateAPIView):
	serializer_class = UserSerializer
	authentication_classes = (BasicAuthentication,)
	
	def post(self, request):
		token = AuthToken.objects.create(request.user)
		return Response({
			'user': self.get_serializer(request.user).data,
			'token': token
		})

class UserList(generics.ListCreateAPIView):
	serializer_class = AdminLevelUserSerializer
	queryset = User.objects.all()
	permission_classes = (IsStaffOrAdmin,)
	authentication_classes = (TokenAuthentication,)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = AdminLevelUserSerializer
	queryset = User.objects.all()
	permission_classes = (IsStaffOrAdmin,)
	authentication_classes = (TokenAuthentication,)

class UserSettings(generics.RetrieveUpdateAPIView):
	serializer_class = UserSerializer
	permission_classes = (IsAuthenticated,)
	authentication_classes = (TokenAuthentication,)
	queryset = User.objects.all()
