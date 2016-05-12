# coding=utf-8
from django import forms
from django.contrib import admin
import json
# from django.contrib.admin.models import LogEntry

# Register your models here.
from django.contrib.admin.filters import SimpleListFilter
from django.contrib.auth.admin import UserAdmin
from django.db.models.query_utils import Q
from django.forms.models import ModelForm
from django.http import HttpResponseRedirect
from django.contrib.auth.models import Group
from django.contrib import messages

from djangoISSSTE.forms import *
from djangoISSSTE.models import *


# -------------- Filters --------------
class CarenciasFilter(SimpleListFilter):
    title = 'Carencia'

    parameter_name = 'carencia'

    def lookups(self, request, model_admin):

        list_tuple = []
        for carencia in Carencia.objects.all():
            list_tuple.append((carencia.id, carencia.nombreCarencia))

        return list_tuple

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(meta__accionEstrategica__subCarencia__carencia__id=self.value())

class SubCarenciasFilter(SimpleListFilter):
    title = 'SubCarencia'

    parameter_name = 'subCarencia'

    def lookups(self, request, model_admin):

        list_tuple = []
        for subCarencia in SubCarencia.objects.all():
            list_tuple.append((subCarencia.id, subCarencia.nombreSubCarencia))

        return list_tuple

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(meta__accionEstrategica__subCarencia__id=self.value())

class MetasFilter(SimpleListFilter):
    title = 'Acción'

    parameter_name = 'metas'

    def lookups(self, request, model_admin):

        list_tuple = []
        for meta in Meta.objects.all():
            list_tuple.append((meta.id, meta.nombreMeta))

        return list_tuple

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(meta__id=self.value())

class EstadoListFilter(SimpleListFilter):
    title = 'Estado'

    parameter_name = 'estado'

    def lookups(self, request, model_admin):

        list_tuple = []
        if request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
            for estado in Estado.objects.filter(id = request.user.usuario.estado.id):
                list_tuple.append((estado.id, estado.nombreEstado))
        else:
            for estado in Estado.objects.all():
                list_tuple.append((estado.id, estado.nombreEstado))

        return list_tuple

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(estado__id=self.value())

class PeriodosFilter(SimpleListFilter):
    title = 'Año'

    parameter_name = 'periodos'

    def lookups(self, request, model_admin):

        list_tuple = []
        for periodo in Periodo.objects.all():
            list_tuple.append((periodo.id, periodo.nombrePeriodo))

        return list_tuple

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(periodo__id=self.value())

#------------- Ends Filters -----------

class UsuarioInLine(admin.StackedInline):
    model = Usuario
    verbose_name_plural = 'Usuario'

    can_delete = False
    extra = 1


class UserAdmin(UserAdmin):
    inlines = (UsuarioInLine,)
    list_display = ('username', 'first_name', 'last_name', 'email', 'get_estado', 'get_rol')
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
        obj.is_staff = True  # True para tener acceso al admin
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


# Define los estados visibles dependiendo del rol del usuario
# y del estado al que pertenece en la pantalla para añadir una nueva
# meta mensual

class MetaMensualInLine(admin.TabularInline):
    model = MetaMensual
    form = MetaMensualForm
    readonly_fields = ('inversionAprox',)
    extra = 0


class MetaAdmin(admin.ModelAdmin):
    model = Meta
    fields = ('accionEstrategica', 'periodo', 'montoPromedio', 'observaciones',)
    list_display = ('get_carencia', 'get_subcarencia', 'accionEstrategica', 'periodo', 'get_inversion')
    inlines = [MetaMensualInLine, ]
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
        return inversionAprox

    get_subcarencia.short_description = "SubCarencia"
    get_carencia.short_description = "Carencia"
    get_inversion.short_description = "Inversion Aproximada"

    def save_formset(self, request, form, formset, change):
        formset.save()
        if change:
            for f in formset.forms:
                obj = f.instance
                obj.save()

    # Redireccionamiento cuando se guarda una nueva meta
    def response_add(self, request, obj, post_url_continue=None):
        if not request.POST.has_key('_addanother'):
            success_message = 'La meta \"%s\" se ha creado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return HttpResponseRedirect('/catalogos')
        else:
            success_message = 'La meta \"%s\" se ha creado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return super(MetaAdmin, self).response_add(request, obj, post_url_continue)

    # Redireccionamiento cuando se guarda una nueva meta
    def response_change(self, request, obj, post_url_continue=None):
        if not request.POST.has_key('_addanother'):
            success_message = 'La meta \"%s\" se ha modificado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return HttpResponseRedirect('/catalogos')
        else:
            success_message = 'La meta \"%s\" se ha modificado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return super(MetaAdmin, self).response_add(request, obj, post_url_continue)


class AvanceMensualInLine(admin.TabularInline):
    model = AvanceMensual
    exclude = ['porcentajeAvance']
    extra = 0

class AvancePorMunicipioAdmin(admin.ModelAdmin):
    # La entidad de meta se desplegará con el label de "Acción Estratégica"
    # y con el nombre de su llave foránea "acción estratégica".	Esto con la
    # intención de cumplir con los requerimientos del cliente, sin embargo,
    # a nivel funcional debe ser tomado en cuenta como meta

    model = AvancePorMunicipio
    inlines = [AvanceMensualInLine, ]
    list_filter = [CarenciasFilter, SubCarenciasFilter, MetasFilter, PeriodosFilter, EstadoListFilter, ]

    fieldsets = (
        ('Avance', {
            'fields': (
                'periodo', 'meta', 'estado', 'get_carencia', 'get_unidad_medida',
                'get_subcarencia', 'inversionAprox','get_observaciones', 'get_accion','get_monto_promedio',
            )
        }),
        ('Meta', {
            'fields': (
                'get_enero', 'get_febrero', 'get_marzo', 'get_abril', 'get_mayo',
                'get_junio', 'get_julio', 'get_agosto', 'get_septiembre', 'get_octubre', 'get_noviembre',
                'get_diciembre',
            )
        }),
    )

    readonly_fields = ('get_carencia', 'get_subcarencia', 'get_unidad_medida', 'get_observaciones', 'get_enero',
                       'get_febrero', 'get_marzo', 'get_abril', 'get_mayo', 'get_junio', 'get_julio', 'get_agosto',
                       'get_septiembre', 'get_octubre', 'get_noviembre', 'get_diciembre', 'get_accion',
                       'inversionAprox', 'get_monto_promedio',)

    list_display = ('id', 'get_carencia', 'get_subcarencia', 'meta', 'periodo', 'estado', 'inversionAprox', 'get_monto_promedio',)
    ordering = ['meta__nombreMeta', ]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        query_estado = request.user.usuario.estado.id
        if db_field.name == "estado":
            if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UR' or request.user.usuario.rol == 'FR':
                kwargs["queryset"] = Estado.objects.all()
            elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
                kwargs["queryset"] = Estado.objects.filter(
                    Q(id=query_estado)
                )

        return super(AvancePorMunicipioAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

    # Obteniendo el campo de la SuCarencia para la lista de avances por municipio
    def get_subcarencia(self, obj):
        return obj.meta.accionEstrategica.subCarencia

    # Obteniendo el campo de la Carencia para la lista de avances por municipio
    def get_carencia(self, obj):
        return obj.meta.accionEstrategica.subCarencia.carencia

    def get_unidad_medida(self, obj):
        return obj.meta.accionEstrategica.unidadDeMedida

    def get_observaciones(self, obj):
        return obj.meta.observaciones

    def get_enero(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.ene)
        return to_print

    def get_febrero(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.feb)
        return to_print

    def get_marzo(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.mar)
        return to_print

    def get_abril(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.abr)
        return to_print

    def get_mayo(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.may)
        return to_print

    def get_junio(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.jun)
        return to_print

    def get_julio(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.jul)
        return to_print

    def get_agosto(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.ago)
        return to_print

    def get_septiembre(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.sep)
        return to_print

    def get_octubre(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.oct)
        return to_print

    def get_noviembre(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.nov)
        return to_print

    def get_diciembre(self, obj):
        arreglo_metas = []
        val_meta = obj.meta.id
        val_estado = obj.estado.id
        meta_mensual = MetaMensual.objects.filter(meta__id=val_meta, estado__id=val_estado)
        to_print = ""
        for meta in meta_mensual:
            to_print = str(meta.dic)
        return to_print

    def get_accion(self, obj):
        return obj.meta.accionEstrategica.nombreAccion

    def get_monto_promedio(self, obj):
        return obj.meta.montoPromedio


    get_subcarencia.short_description = "Sub Carencia"
    get_carencia.short_description = "Carencia"
    get_unidad_medida.short_description = "Unidad de Medida"
    get_observaciones.short_description = "Observaciones"
    get_enero.short_description = "Enero"
    get_febrero.short_description = "Febrero"
    get_marzo.short_description = "Marzo"
    get_abril.short_description = "Abril"
    get_mayo.short_description = "Mayo"
    get_junio.short_description = "Junio"
    get_julio.short_description = "Julio"
    get_agosto.short_description = "Agosto"
    get_septiembre.short_description = "Septiembre"
    get_octubre.short_description = "Octubre"
    get_noviembre.short_description = "Noviembre"
    get_diciembre.short_description = "Diciembre"
    get_accion.short_description = "Acción Estratégica"
    get_monto_promedio.short_description = "Monto promedio"


    # Esta funcion se ejecuta al desplegar la lista de Avances por municipio. Dentro
    # de ella se aplica un filtro por el rol del usuario y de su estado
    def get_queryset(self, request):
        qs = super(AvancePorMunicipioAdmin, self).get_queryset(request)
        if request.user.usuario.rol == 'AG' or request.user.usuario.rol == 'UC' or request.user.usuario.rol == 'FC':
            return qs
        elif request.user.usuario.rol == 'UE' or request.user.usuario.rol == 'FE':
            print 'Query Set Administrador dependenciasub'
            return qs.filter(
                Q(estado__id=request.user.usuario.estado.id)
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

    # Redireccionamiento cuando se guarda un nuevo avance
    def response_add(self, request, obj, post_url_continue=None):
        if not request.POST.has_key('_addanother'):
            return HttpResponseRedirect('/movimientos')
        else:
            return super(AvancePorMunicipioAdmin, self).response_add(request, obj, post_url_continue)

    # Redireccionamiento cuando se guarda un nuevo avance
    def response_change(self, request, obj, post_url_continue=None):
        if not request.POST.has_key('_addanother'):
            success_message = 'El avance \"%s\" se ha modificado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return HttpResponseRedirect('/movimientos')
        else:
            success_message = 'El avance \"%s\" se ha modificado exitosamente.' % obj.__str__()
            self.message_user(request, success_message, level=messages.SUCCESS)
            return super(AvancePorMunicipioAdmin, self).response_add(request, obj, post_url_continue)

class AccionEstrategicaAdmin(admin.ModelAdmin):
    model = AccionEstrategica
    list_display = ('nombreAccion', 'get_carencia', 'subCarencia', 'unidadDeMedida', 'responsable',
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
                Q(meta__id__in=arregloMetas)
        ):
            inversionAprox += singleMetaMensual.inversionAprox
        return inversionAprox

    get_carencia.short_description = 'Carencia'
    get_cargoResponsable.short_description = 'Cargo del Responsable'
    get_inversionTotal.short_description = "Inversión Aproximada"


class SubcarenciaAdmin(admin.ModelAdmin):
    model = SubCarencia
    list_display = ('nombreSubCarencia', 'carencia')


class AvanceMensualAdmin(admin.ModelAdmin):
    model = AvanceMensual
    list_display = ('avancePorMunicipio', 'fecha_ultima_modificacion')


# admin.site.register(LogEntry)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Carencia)
admin.site.register(SubCarencia, SubcarenciaAdmin)
admin.site.register(AccionEstrategica, AccionEstrategicaAdmin)
admin.site.register(Meta, MetaAdmin)
admin.site.register(AvancePorMunicipio, AvancePorMunicipioAdmin)
admin.site.register(Responsable)
admin.site.register(Estado)
admin.site.register(Municipio)
admin.site.register(Mes)
admin.site.register(Periodo)
admin.site.register(UnidadDeMedida)