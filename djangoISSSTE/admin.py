# coding=utf-8
from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from django.http import HttpResponseRedirect
from django.contrib.auth.models import Group
from djangoISSSTE.models import *

class UsuarioInLine(admin.StackedInline):
	model = Usuario
	verbose_name_plural = 'Usuario'

class UserAdmin(UserAdmin):
	inlines = (UsuarioInLine, )
	list_display = ('username', 'first_name', 'last_name', 'email', )

	'''
	def response_add(self, request, obj, post_url_continue=None):
		if '_addanother' not in request.POST:
			return HttpResponseRedirect('/admin/auth/user')
		else:
			return super(UserAdmin, self).response_add(request, obj, post_url_continue)
	'''

	def save_model(self, request, obj, form, change):
		obj.is_staff = True
		usuario = obj
		usuario.save()
		try:
			g = Group.objects.get(name='Administrador')
			g.user_set.add(usuario)
			'''
			if usuario.usuario.rol == "ES":
				usuario.is_superuser = True
			elif usuario.userprofile.rol == 'RE':
				g = Group.objects.get(name='Administrador')
				g.user_set.add(usuario)
			'''
		except Exception as e:
			print e
		super(UserAdmin, self).save_model(request, obj, form, change)


class MetaMensualInLine(admin.TabularInline):
	model = MetaMensual
	can_delete = False

class MetaAdmin(admin.ModelAdmin):
	model = Meta
	inlines = [MetaMensualInLine]
	can_delete = True

class AvanceMensualInLine(admin.TabularInline):
	model = AvanceMensual


class AvancePorMunicipioAdmin(admin.ModelAdmin):
	model = AvancePorMunicipio
	inlines = [AvanceMensualInLine, ]
	fields = ('meta', 'municipio', 'periodo', 'get_accionEstrategica')
	readonly_fields = ('get_accionEstrategica', )
	list_display = ('get_accionEstrategica', 'municipio','periodo',)

	def get_accionEstrategica(self, obj):
		return obj.meta.accionEstrategica

	get_accionEstrategica.short_description = "Acción Estratégica"
	get_accionEstrategica.admin_order_field = 'meta'
	ordering = ['municipio', 'periodo', ]

class AccionEstrategicaAdmin(admin.ModelAdmin):
	model = AccionEstrategica
	readonly_fields = ('get_carencia',)

	def get_carencia(self,obj):
		return obj.subCarencia.carencia

	get_carencia.short_description = 'Carencia'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Carencia)
admin.site.register(SubCarencia)
admin.site.register(AccionEstrategica, AccionEstrategicaAdmin)
admin.site.register(Meta, MetaAdmin)
admin.site.register(AvancePorMunicipio, AvancePorMunicipioAdmin)
admin.site.register(Responsable)
admin.site.register(Estado)
admin.site.register(Municipio)
admin.site.register(Mes)
admin.site.register(Periodo)