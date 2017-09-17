import django_filters as dj_filters
from meals.serializers import *
from meals.models import Meal

class DateTimeFilter(dj_filters.FilterSet):
	#Filtering based on meal date
	start_date = dj_filters.NumberFilter(name='date', lookup_expr = 'gte')
	end_date = dj_filters.NumberFilter(name = 'date', lookup_expr = 'lte')

	#Filtering based on meal time
	start_time = dj_filters.NumberFilter(name='time', lookup_expr = 'gte')
	end_time = dj_filters.NumberFilter(name = 'time', lookup_expr = 'lte')

	class Meta:
		model = Meal
		fields = '__all__'
