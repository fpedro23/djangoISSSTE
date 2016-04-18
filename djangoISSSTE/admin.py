from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from djangoISSSTE.models import *

class UsuarioInLine(admin.StackedInline):
	model = Usuario
	can_delete = False
	verbose_name_plural = 'Usuario'

class UserAdmin(UserAdmin):
    inlines = [UsuarioInLine]



admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Carencia)
admin.site.register(SubCarencia)
admin.site.register(AccionEstrategica)
admin.site.register(Meta)
admin.site.register(AvancePorMunicipio)
admin.site.register(Responsable)
admin.site.register(Estado)
admin.site.register(Municipio)
