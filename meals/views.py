from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from meals.models import Meal
from django.contrib.auth.models import User
from meals.serializers import MealSerializer
from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from meals.permissions import *
from rest_framework import filters
from meals.filters import DateTimeFilter


def index(request):
        return render(request,'meals/index.html')

class MealList(generics.ListCreateAPIView):
	serializer_class = MealSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated, IsOwnerOrAdmin,)
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = DateTimeFilter
	#queryset = Meal.objects.all()
	
	def get_queryset(self):
		user = self.request.auth.user
		meals = Meal.objects.filter(user=user.id)
		return meals

	def perform_create(self, serializer):
		current_user = self.request.auth.user
		user = current_user
		if 'username' in self.request.data:
			if current_user.is_superuser:
				username = self.request.data['username']
				user = get_object_or_404(User, username=username)
		serializer.save(user = user)

class AdminLevelMeals(generics.ListCreateAPIView):
	serializer_class = MealSerializer
	queryset = Meal.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated, IsAdmin,)
	filter_backends = (filters.DjangoFilterBackend,)
	filter_class = DateTimeFilter	

class MealDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MealSerializer
	queryset = Meal.objects.all()
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated, IsOwnerOrAdmin, )

	def perform_update(self, serializer):
		username = self.request.auth.user
		if 'user' in self.request.data and self.request.auth.user.is_superuser:
			username = self.request.data['user']
		user = get_object_or_404(User, username=username)
		serializer.save(user=user)
