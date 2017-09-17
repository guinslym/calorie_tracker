from django.conf.urls import url
from users import views as user_views

urlpatterns = [
	url('^register/', user_views.UserRegister.as_view(), name = 'register'),
	url('^login/', user_views.UserLogin.as_view(), name = 'login'),
	url(r'^list/$', user_views.UserList.as_view(), name='user-list'),
	url(r'^(?P<pk>[0-9]+)/$', user_views.UserDetail.as_view(), name='user-detail'),
	url(r'^(?P<pk>[0-9]+)/settings/$', user_views.UserSettings.as_view(), name='settings'),
]
