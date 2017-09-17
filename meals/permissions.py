from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
	def has_object_permission(self, request, view, obj):
		user = request.auth.user
		return obj.user == user or user.is_superuser

class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return request.auth.user.is_superuser
