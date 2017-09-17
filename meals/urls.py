from django.conf.urls import url
from meals import views

urlpatterns = [
	url(r'^list/$', views.MealList.as_view(), name = 'meal-list'),
	url(r'^(?P<pk>[0-9]+)/$', views.MealDetail.as_view(), name='meal-detail'),
	url(r'^admin/$', views.AdminLevelMeals.as_view(), name = 'all-meal-list'),
]
