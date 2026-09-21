from rest_framework.permissions import BasePermission

def HasRole(*allowed_role):
    class RolePermission(BasePermission):
        message = "Nemate dozbolu pristupiti ovoj stranici"

    def has_permission(self,request,view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in allowed_role
        )
    return RolePermission

