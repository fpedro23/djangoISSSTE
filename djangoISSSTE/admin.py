# coding=utf-8
from django import forms
from django.contrib import admin
#from django.contrib.admin.models import LogEntry

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from django.db.models.query_utils import Q
from django.http import HttpResponseRedirect
from django.contrib.auth.models import Group

from djangoISSSTE.forms import *
from djangoISSSTE.models import *


class UsuarioInLine(admin.StackedInline):
	model = Usuario
	verbose_name_plural = 'Usuario'

	can_delete = False
	extra = 1


class UserAdmin(UserAdmin):
	inlines = (UsuarioInLine,)
	list_display = ('username', 'first_name', 'last_name', 'email','get_estado', 'get_rol')
	fieldsets = (
		(('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
		(('AuthInfo'), {'fields': ('username', 'password')}),
		(('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
		(('Important dates'), {'fields': ('last_login', 'date_joined')}),
	)
	add_fieldsets = (
		(('AuthInfo'), {'fields': ('username', 'password1', 'password2')}),
		(('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
		(('Permissions'), {'fields': ('is_active',)}),
	)

	# Obteniendo el campo del rol dentro de la lista de usuarios
	def get_rol(self, obj):
		return obj.usuario.rol

	# Obteniendo el campo del estado dentro de la lista de usuarios
	def get_estado(self, obj):
		return obj.usuario.estado

	get_rol.short_description = "Rol"
	get_estado.short_description = "Estado"

	def response_add(self, request, obj, post_url_continue=None):
		if '_addanother' not in request.POST:
			return HttpResponseRedirect('/admin/auth/user')
		else:
			return super(UserAdmin, self).response_add(request, obj, post_url_continue)


	# Ejecutado cuando el nuevo usuario es guardado
	def save_model(self, request, obj, form, change):
		obj.is_staff = True	 # True para tener acceso al admin
		usuario = obj
		usuario.save()

		try:
			if usuario.usuario.rol == "AG":
				g = Group.objects.get(name="administrador_general")
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
		except Group.DoesNotExist:
			g = None

		super(UserAdmin, self).save_model(request, obj, form, change)

	# Borrando usuario
	def delete_model(self, request, obj):
		self.message_user(request, "Usuario eliminado satisfactoriamente", )
		super(UserAdmin, self).delete_model(request, obj)

	# Definiendo a los usuarios que serán visibles para los demás usuarios
	# dependiendo de su rol y estado
	def get_queryset(self, request):
		queryEstado = request.user.usuario.estado.id

		qs = super(UserAdmin, self).get_queryset(request)
		if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UC' or request.user.usuario.rol == 'FC':
			return qs
		elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
			print 'Query Set Administrador dependenciasub'
			print queryEstado
			return qs.filter(
				Q(usuario__estado__id=queryEstado)
			)


class MetaMensualInLine(admin.TabularInline):
	model = MetaMensual
	can_delete = False
	formset = RequiredInlineFormSet	# Debe de estar lleno forzosamente
	extra = 0

	# Define los estados visibles dependiendo del rol del usuario
	# y del estado al que pertenece en la pantalla para añadir una nueva
	# meta mensual
	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		query_estado = request.user.usuario.estado.id

		if db_field.name == "estado":
			if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UR' or request.user.usuario.rol == 'FR':
				kwargs["queryset"] = Estado.objects.all()
			elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
				kwargs["queryset"] = Estado.objects.filter(
					Q(id=query_estado)
				)

		return super(
			MetaMensualInLine, self).formfield_for_foreignkey(db_field, request, **kwargs)


class MetaAdmin(admin.ModelAdmin):
	model = Meta
	fields = ('accionEstrategica', 'periodo', 'observaciones')
	list_display = ('get_carencia','get_subcarencia','accionEstrategica', 'periodo','get_inversion')
	inlines = [MetaMensualInLine]
	can_delete = True

	# Obteniendo el campo de la SuCarencia para la lista de Metas
	def get_subcarencia(self, obj):
		return obj.accionEstrategica.subCarencia

	# Obteniendo el campo de la Carencia para la lista de Metas
	def get_carencia(self, obj):
		return obj.accionEstrategica.subCarencia.carencia

	# Obteniendo el campo de la Inversion por cada Meta a nivel estado y anual
	def get_inversion(self, obj):
		metaID = obj.id
		inversionAprox = 0
		for singleMetaMensual in MetaMensual.objects.filter(Q(meta__id=metaID)):
			inversionAprox += singleMetaMensual.inversionAprox
		print  inversionAprox
		return inversionAprox

	get_subcarencia.short_description = "SubCarencia"
	get_carencia.short_description = "Carencia"
	get_inversion.short_description = "Inversion Aproximada"


class AvanceMensualInLine(admin.TabularInline):
	model = AvanceMensual
	formset = RequiredInlineFormSet	# Debe de estar lleno forzosamente
	extra = 0

	# Define los municipios visibles dependiendo del rol del usuario
	# y del estado al que pertenece en la pantalla para añadir un nuevo
	# avance mensual
	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		query_estado = request.user.usuario.estado.id
		if db_field.name == "municipio":
			if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UR' or request.user.usuario.rol == 'FR':
				kwargs["queryset"] = Municipio.objects.all()
			elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
				kwargs["queryset"] = Municipio.objects.filter(
					Q(estado=query_estado)
				)

		return super(
			AvanceMensualInLine, self).formfield_for_foreignkey(db_field, request, **kwargs)


class AvancePorMunicipioAdmin(admin.ModelAdmin):

	# La entidad de meta se desplegará con el label de "Acción Estratégica"
	# y con el nombre de su llave foránea "acción estratégica".	Esto con la
	# intención de cumplir con los requerimientos del cliente, sin embargo,
	# a nivel funcional debe ser tomado en cuenta como meta

	model = AvancePorMunicipio
	inlines = [AvanceMensualInLine, ]
	fields = ('periodo','meta', 'estado',)
	list_display = ('id','get_carencia','get_subcarencia','meta', 'periodo','estado')
	ordering = ['meta__nombreMeta', ]

	# Obteniendo el campo de la SuCarencia para la lista de avances por municipio
	def get_subcarencia(self, obj):
		return obj.meta.accionEstrategica.subCarencia

	# Obteniendo el campo de la Carencia para la lista de avances por municipio
	def get_carencia(self, obj):
		return obj.meta.accionEstrategica.subCarencia.carencia

	get_subcarencia.short_description = "SubCarencia"
	get_carencia.short_description = "Carencia"


	# Esta funcion se ejecuta al desplegar la lista de Avances por municipio. Dentro
	# de ella se aplica un filtro por el rol del usuario y de su estado
	def get_queryset(self, request):
		queryEstado = request.user.usuario.estado.id

		qs = super(AvancePorMunicipioAdmin, self).get_queryset(request)
		if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UC' or request.user.usuario.rol == 'FC':
			return qs
		elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
			print 'Query Set Administrador dependenciasub'
			print queryEstado
			return qs.filter(
				Q(estado__id=queryEstado)
			)

	# Define los estados visibles dependiendo del rol del usuario
	# y del estado al que pertenece en la pantalla para añadir un nuevo
	# avance por municipio
	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		query_estado = request.user.usuario.estado.id

		if db_field.name == "estado":
			if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UR' or request.user.usuario.rol == 'FR':
				kwargs["queryset"] = Estado.objects.all()
			elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
				kwargs["queryset"] = Estado.objects.filter(
					Q(id=query_estado)
				)

		return super(
			AvancePorMunicipioAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)


class AccionEstrategicaAdmin(admin.ModelAdmin):
	model = AccionEstrategica
	list_display = ('nombreAccion','get_carencia', 'subCarencia','unidadDeMedida', 'responsable',
					'get_cargoResponsable', 'get_inversionTotal')
	readonly_fields = ('get_carencia',)

	def get_carencia(self, obj):
		return obj.subCarencia.carencia

	def get_cargoResponsable(self, obj):
		return obj.responsable.cargoResponsable

	# Obteniedo el campo de la Inversión total por Acción Estratégica
	# esto incluye a las metas de cualquier año que atiendan a esta acción

	def get_inversionTotal(self, obj):
		arregloMetas = []
		accionEstrategicaID = obj.id
		inversionAprox = 0
		for singleMeta in Meta.objects.filter(
				Q(accionEstrategica__id=accionEstrategicaID)
		):
			arregloMetas.append(singleMeta.id)

		for singleMetaMensual in MetaMensual.objects.filter(
			Q(meta__id__in = arregloMetas)
		):
			inversionAprox += singleMetaMensual.inversionAprox
		return inversionAprox

	get_carencia.short_description = 'Carencia'
	get_cargoResponsable.short_description = 'Cargo del Responsable'
	get_inversionTotal.short_description = "Inversión Aproximada"

#admin.site.register(LogEntry)
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

