# coding=utf-8
from django import forms
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
	inlines = (UsuarioInLine,)
	list_display = ('username', 'first_name', 'last_name', 'email',)

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

		if usuario.usuario.rol == "AG":
			g = Group.objects.get(name = "administrador_general")
			g.user_set.add(usuario)
			print "Definiendo permisos para Administrador General"

		elif usuario.usuario.rol == "UC":
			g = Group.objects.get(name="usuario")
			g.user_set.add(usuario)
			print "Definiendo permisos para Usuario Central"

		elif usuario.usuario.rol == "FC":
			g = Group.objects.get(name="funcionario")
			g.user_set.add(usuario)
			print "Definiendo permisos para Funcionario Central"

		elif usuario.usuario.rol == "UE":
			g = Group.objects.get(name="usuario")
			g.user_set.add(usuario)
			print "Definiendo permisos para Usuario Estatal"

		elif usuario.usuario.rol == "FE":
			g = Group.objects.get(name="funcionario")
			g.user_set.add(usuario)
			print "Definiendo permisos para Funcionario Estatal"

		super(UserAdmin, self).save_model(request, obj, form, change)


class MetaMensualInLine(admin.TabularInline):
	model = MetaMensual
	can_delete = False


class MetaAdmin(admin.ModelAdmin):
	model = Meta
	fields = ('accionEstrategica', 'periodo', 'observaciones')
	inlines = [MetaMensualInLine]
	can_delete = True


class AvanceMensualInLine(admin.TabularInline):
	model = AvanceMensual


class AvancePorEstadoAdmin(admin.ModelAdmin):
	model = AvancePorEstado
	inlines = [AvanceMensualInLine, ]
	fields = ('meta', 'periodo', 'estado', 'get_accionEstrategica')
	list_display = ('get_accionEstrategica', 'periodo','estado')
	readonly_fields = ('get_accionEstrategica',)

	def get_accionEstrategica(self, obj):
		return obj.meta.accionEstrategica

	get_accionEstrategica.short_description = "Acción Estratégica"
	get_accionEstrategica.admin_order_field = 'meta'
	ordering = ['periodo', ]





class AccionEstrategicaAdmin(admin.ModelAdmin):
	model = AccionEstrategica
	readonly_fields = ('get_carencia',)

	def get_carencia(self, obj):
		return obj.subCarencia.carencia

	get_carencia.short_description = 'Carencia'


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Carencia)
admin.site.register(SubCarencia)
admin.site.register(AccionEstrategica, AccionEstrategicaAdmin)
admin.site.register(Meta, MetaAdmin)
admin.site.register(AvancePorEstado, AvancePorEstadoAdmin)
admin.site.register(Responsable)
admin.site.register(Estado)
admin.site.register(Municipio)
admin.site.register(Mes)
admin.site.register(Periodo)

