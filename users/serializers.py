from rest_framework import serializers
from users.models import UserProfile
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    calorie_limit = serializers.IntegerField(source='profile.calorie_limit', required = False, allow_null = True, min_value = 0)	

    class Meta:
        model = User
        fields = ('id','username', 'password', 'calorie_limit','is_staff', 'is_superuser')
        read_only_fields = ('is_superuser', 'is_staff',)

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile
        instance.username = validated_data.get('username', instance.username)
        #instance.set_password(validated-data.get('password', instance.password)
        instance.save()
        profile.calorie_limit = int(profile_data.get('calorie_limit', profile.calorie_limit))
        profile.save()
        return instance

class AdminLevelUserSerializer(serializers.ModelSerializer):
    calorie_limit = serializers.IntegerField(source='profile.calorie_limit', required = False, allow_null = True, min_value = 0)

    class Meta:
        model = User
        fields = ('id','username', 'password', 'calorie_limit','is_staff', 'is_superuser')
        # read_only_fields = ('is_superuser',)

    def create(self, validated_data):
        up = validated_data.pop('profile')
        is_admin = validated_data.pop('is_superuser')
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        if self.context['request'].auth.user.is_superuser:
            user.is_superuser = is_admin
            user.save()
            cl = up.get('calorie_limit', 0)
            profile = UserProfile.objects.get(user = user.id)
            profile.calorie_limit = cl
            profile.save()
        return user


        def update(self, instance, validated_data):
            profile_data = validated_data.pop('profile')
            profile = instance.profile
            instance.username = validated_data.get('username', instance.username)
            instance.is_staff = validated_data.get('is_staff', instance.is_staff)
            if self.context['request'].auth.user.is_superuser:
                instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
                instance.save()
                profile.calorie_limit = int(profile_data.get('calorie_limit', profile.calorie_limit))
                profile.save()
            return instance
