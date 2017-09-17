from rest_framework import serializers
from meals.models import Meal
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

class MealSerializer(serializers.ModelSerializer):
	user = serializers.ReadOnlyField(source = 'user.username')

	class Meta:
		model = Meal
		fields = '__all__'
