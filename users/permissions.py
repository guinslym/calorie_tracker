from rest_framework.permissions import BasePermission

class IsStaffOrAdmin(BasePermission):
	def has_permission(self, request, view):
		return request.auth.user.is_staff or request.auth.user.is_superuser
