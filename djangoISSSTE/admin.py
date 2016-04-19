from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from djangoISSSTE.models import *

class UsuarioInLine(admin.StackedInline):
	model = Usuario
	verbose_name_plural = 'Usuario'

class UserAdmin(UserAdmin):
	inlines = (UsuarioInLine, )
	list_display = ('username', 'first_name', 'last_name', 'email', )

class MetaMensualInLine(admin.TabularInline):
	model = MetaMensual

class MetaAdmin(admin.ModelAdmin):
	model = Meta
	inlines = [MetaMensualInLine]

class AvanceMensualInLine(admin.TabularInline):
	model = AvanceMensual

class AvancePorMunicipioAdmin(admin.ModelAdmin):
	model = AvancePorMunicipio
	inlines = [AvanceMensualInLine]
	readonly_fields = ('Accion_Estrategica',)

	def Accion_Estrategica(self, obj):
		return obj.meta.accionEstrategica.nombreAccion



admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Carencia)
admin.site.register(SubCarencia)
admin.site.register(AccionEstrategica)
admin.site.register(Meta, MetaAdmin)
admin.site.register(AvancePorMunicipio, AvancePorMunicipioAdmin)
admin.site.register(Responsable)
admin.site.register(Estado)
admin.site.register(Municipio)
admin.site.register(Mes)
admin.site.register(Periodo)