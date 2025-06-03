from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(BaseUserAdmin):
    model = User

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('username', 'firstname', 'lastname', 'date_of_birth')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    list_display = ('email', 'username', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username')
    ordering = ('email',)

    def get_readonly_fields(self, request, obj=None):
        """Make is_staff and is_superuser read-only unless current user is a superuser"""
        if not request.user.is_superuser:
            return self.readonly_fields + ('is_staff', 'is_superuser')
        return self.readonly_fields

admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)
