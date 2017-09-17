from django.conf.urls import url, include
from meals import views as meal_views
from django.views.decorators.cache import cache_page
from django.conf import settings

urlpatterns = [
	url(r'^api/meals/', include('meals.urls', namespace = 'meals')),
	url(r'^api/users/', include('users.urls', namespace = 'users')),
	# catch all others because of how history is handled by react router - cache this page because it will never change
	url(r'', cache_page(settings.PAGE_CACHE_SECONDS)(meal_views.index), name='index'),
]
