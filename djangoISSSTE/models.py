from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.utils.encoding import python_2_unicode_compatible
from django.forms import model_to_dict


class Delegacion(models.Model):
    nombreDelegacion = models.CharField(max_length=200)
    imagenDelegacion = models.FileField(blank=True, null=True)
    dependienteDe = models.ForeignKey('self', null=True, blank=True)
    fecha_ultima_modificacion = models.DateTimeField(null=True, blank=True)
    orden_secretaria = models.FloatField(null=True, blank=True)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreDelegacion

    # def get_contactos(self):
    #     return Usuario.objects.filter(Q(dependencia=self) & Q(rol='AD'))

    def to_serializable_dict(self):
        ans = {}

        ans['id'] = str(self.id)
        ans['nombreDependencia'] = str(self.nombreDelegacion)
        if self.imagenDelegacion is None or self.imagenDelegacion.name == '' or self.imagenDelegacion.name is None:
            ans['imagenDependencia'] = None
        else:
            ans['imagenDependencia'] = self.imagenDelegacion.url

        if self.dependienteDe is None:
            ans['dependienteDe'] = None
        else:
            ans['dependienteDe'] = str(self.dependienteDe.id)

        if self.fecha_ultima_modificacion is None:
            ans['fecha_ultima_modificacion'] = None
        else:
            ans['fecha_ultima_modificacion'] = self.fecha_ultima_modificacion.__str__()

        return ans

    def get_tree(self):
        ans = {'dependencia': self.to_serializable_dict(), 'subdependencias': None}
        subdeps = Delegacion.objects.filter(dependienteDe__id=self.id)

        if subdeps and subdeps.count() > 0:
            ans['subdependencias'] = []
            for subdep in subdeps:
                ans['subdependencias'].append(subdep.get_tree())

        return ans

    def get_subdeps_flat(self):
        ans = None
        subdeps = Delegacion.objects.filter(dependienteDe__id=self.id)

        if subdeps and subdeps.count() > 0:
            ans = []
            for subdep in subdeps:
                subsubdeps = subdep.get_subdeps_flat()
                if subsubdeps:
                    ans.append(subsubdeps)

        return ans


@python_2_unicode_compatible
class Estado(models.Model):
    nombreEstado = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreEstado

    def __unicode__(self):  # __unicode__ on Python 2
        return self.nombreEstado

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans


@python_2_unicode_compatible
class Municipio(models.Model):
    nombreMunicipio = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()
    estado = models.ForeignKey(Estado, null=False, blank=False)

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['estado'] = self.estado.nombreEstado
        return ans

    def __str__(self):
        return self.nombreMunicipio

    def __unicode__(self):
        return self.nombreMunicipio


class Carencia(models.Model):
    nombreCarencia = models.CharField(max_length=200)

    def __str__(self):
        return self.nombreCarencia

    def __unicode__(self):
        return self.nombreCarencia


class SubCarencia(models.Model):
    carencia = models.ForeignKey(Carencia)
    nombreSubcarencia = models.CharField(max_length=200)

    def __str__(self):
        return self.nombreSubcarencia

    def __unicode__(self):
        return self.nombreSubcarencia


class AccionEstrategica(models.Model):
    carencia = models.ForeignKey(Carencia)
    delegacion = models.ForeignKey(Delegacion)
    subcarencia = models.ForeignKey(SubCarencia)
    nombreAccionEstrategica = models.CharField(max_length=100)
    unidadDeMedida = models.CharField(max_length=200)
    descripcionAccionEstrategica = models.TextField(max_length=300)

    def __str__(self):
        return self.nombreAccionEstrategica

    def __unicode__(self):
        return self.nombreAccionEstrategica


class Meta(models.Model):
    accionEstrategica = models.ForeignKey(AccionEstrategica)
    entidad = models.ForeignKey(Estado)
    municipio = models.ForeignKey(Municipio)
    mes = models.CharField(max_length=200)
    cantidad = models.FloatField()

    def __str__(self):
        return self.accionEstrategica.nombreAccionEstrategica

    def __unicode__(self):
        return self.accionEstrategica.nombreAccionEstrategica


# class AvanceMensual(models.Model):
#     mes = models.CharField(max_length=200)
#     unidad = models.FloatField()
#     meta = models.ForeignKey(Meta)
#
#     def __str__(self):
#         return self.mes
#
#     def __unicode__(self):
#         return self.mes


class UserProfile(models.Model):
    ADMIN = 'AD'
    USER = 'US'

    ROLES_CHOICES = (
        (ADMIN, 'Administrador general'),
        (USER, 'Usuario de Dependencia'),
    )
    rol = models.CharField(max_length=2, choices=ROLES_CHOICES, default=USER)
    user = models.OneToOneField(User)
    delegacion = models.ForeignKey(Delegacion, blank=True, null=True, )
