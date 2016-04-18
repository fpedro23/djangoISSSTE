from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
from django.forms import model_to_dict


class Estado(models.Model):
    nombreEstado = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreEstado

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans



class Municipio (models.Model):
    nombreMunicipio = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()
    estado = models.ForeignKey(Estado, null=False, blank=False, default="")

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['estado'] = self.estado.nombreEstado
        return ans

    def __str__(self):
        return self.nombreMunicipio


@python_2_unicode_compatible
class Carencia(models.Model):
    nombreCarencia = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):      # __unicode__ on Python 2
        return self.nombreCarencia

    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans


@python_2_unicode_compatible
class SubCarencia(models.Model):
    nombreSubCarencia = models.CharField(max_length=200)
    carencia = models.ForeignKey(Carencia, null=False, blank=False);

    def __str__(self):
        return self.nombreSubCarencia

    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['carencia'] = self.carencia.nombreCarencia
        return ans


@python_2_unicode_compatible
class Responsable(models.Model):
    nombreResponsable = models.CharField(max_length=100)
    cargoResponsable = models.CharField(max_length=100)

    def __str__(self):
        return self.nombreResponsable

    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans


@python_2_unicode_compatible
class AccionEstrategica(models.Model):
    nombreAccion = models.CharField(max_length=200, null=False, blank=False)
    unidadDeMedida = models.CharField(max_length=200, null=False, blank=False)
    subCarencia = models.ForeignKey(SubCarencia, null=False, blank=False)
    responsable = models.ForeignKey(Responsable)

    def __str__(self):
        return self.nombreAccion

    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['subCarencia'] = str(self.subCarencia.nombreSubCarencia)
        ans['responsable'] = str(self.responsable.nombreResponsable)
        return ans


class Meta(models.Model):
    accionEstrategica = models.ForeignKey(AccionEstrategica, null=False, blank=False)
    estado = models.ForeignKey(Estado, null=False, blank=False)
    periodo = models.IntegerField()
    enero = models.FloatField()
    febrero = models.FloatField()
    marzo = models.FloatField()
    abril = models.FloatField()
    mayo = models.FloatField()
    junio = models.FloatField()
    julio = models.FloatField()
    agosto = models.FloatField()
    septiembre = models.FloatField()
    octubre = models.FloatField()
    noviembre = models.FloatField()
    diciembre = models.FloatField()
    inversionAprox = models.FloatField()


    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['accionEstrategica'] = self.accionEstrategica.nombreAccion
        ans['estado'] = self.estado.nombreEstado
        return ans


class AvancePorMunicipio(models.Model):
    meta = models.ForeignKey(Meta, null=False, blank=False)
    municipio = models.ForeignKey(Municipio, null=False, blank=False)
    periodo = models.IntegerField()
    enero = models.FloatField()
    febrero = models.FloatField()
    marzo = models.FloatField()
    abril = models.FloatField()
    mayo = models.FloatField()
    junio = models.FloatField()
    julio = models.FloatField()
    agosto = models.FloatField()
    septiembre = models.FloatField()
    octubre = models.FloatField()
    noviembre = models.FloatField()
    diciembre = models.FloatField()
    inversionAprox = models.FloatField()

    def to_serialize_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['meta'] = "meta_ISSTE"
        ans['municipio'] = self.municipio.nombreMunicipio
        return ans


class Usuario(models.Model):
    REGIONAL = "RE"
    ESTATAL = "ES"

    ROLES_CHOICES = (
        (REGIONAL, 'Administrador Regional'),
        (ESTATAL, 'Administrador Estatal'),
    )

    user = models.OneToOneField(User)
    rol = models.CharField(max_length=2, choices=ROLES_CHOICES, default=User)
    estado = models.ForeignKey(Estado, null=False, blank=False)
