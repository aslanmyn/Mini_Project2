from rest_framework import permissions

class IsJobSeeker(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'job_seeker'


class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'recruiter'


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'


class IsAdminOrRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'recruiter']
