from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete = models.CASCADE, related_name = 'profile')
	calorie_limit = models.PositiveSmallIntegerField(null = True)

def create_profile(sender, **kwargs):
	user = kwargs["instance"]
	if kwargs["created"]:
		profile = UserProfile(user=user)
		profile.save()

post_save.connect(create_profile, sender=User)
