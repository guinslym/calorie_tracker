from django.db import models
from django.contrib.auth.models import User

class Meal(models.Model):
	user = models.ForeignKey(User, related_name = 'meals')
	text = models.CharField(max_length = 256)
	calories = models.IntegerField(blank = True, null = True)
	date = models.DateField(blank = True, null = True)
	time = models.TimeField(blank = True, null = True)
