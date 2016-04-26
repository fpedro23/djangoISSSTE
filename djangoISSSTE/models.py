# coding=utf-8

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
from django.forms import model_to_dict


@python_2_unicode_compatible
class Estado(models.Model):
    claveEstado = models.CharField(max_length=2, null=False, blank=False)
    nombreEstado = models.CharField(max_length=45, null=False, blank=False)
    abrevEstado = models.CharField(max_length=16, null=False, blank=False)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreEstado

    def __unicode__(self):  # __unicode__ on Python 2
        return self.nombreEstado

    def to_serializable_dict(self):
        return {'id': self.id, 'nombreEstado': self.nombreEstado}

    class Meta:
        ordering = ('nombreEstado',)


@python_2_unicode_compatible
class Municipio(models.Model):
    estado = models.ForeignKey(Estado, null=False, blank=False)
    claveMunicipio = models.CharField(max_length=3, null=False, blank=False)
    nombreMunicipio = models.CharField(max_length=200)
    sigla = models.CharField(max_length=2)
    latitud = models.FloatField()
    longitud = models.FloatField()

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['estado'] = self.estado.nombreEstado
        return ans

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreMunicipio


@python_2_unicode_compatible
class Carencia(models.Model):
    nombreCarencia = models.CharField(max_length=200, null=False, blank=False, verbose_name='Carencia')

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreCarencia

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans


@python_2_unicode_compatible
class SubCarencia(models.Model):
    nombreSubCarencia = models.CharField(max_length=200, verbose_name='SubCarencia')
    carencia = models.ForeignKey(Carencia, null=False, blank=False)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreSubCarencia

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['nombreSubCarencia'] = str(self.nombreSubCarencia)

        ans['carencia'] = self.carencia.nombreCarencia
        return ans

    class Meta:
        verbose_name = "Sub Carencia"
        verbose_name_plural = "Sub Carencias"


@python_2_unicode_compatible
class Responsable(models.Model):
    nombreResponsable = models.CharField(max_length=100)
    cargoResponsable = models.CharField(max_length=100)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreResponsable

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['nombreResponsable'] = str(self.nombreResponsable)
        ans['cargoResponsable'] = str(self.cargoResponsable)
        return ans


@python_2_unicode_compatible
class AccionEstrategica(models.Model):
    nombreAccion = models.CharField(max_length=200, null=False, blank=False, verbose_name='Acción')
    unidadDeMedida = models.CharField(max_length=200, null=False, blank=False, verbose_name='Unidad de medida')
    subCarencia = models.ForeignKey(SubCarencia, null=False, blank=False)
    responsable = models.ForeignKey(Responsable)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreAccion

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['subCarencia'] = str(self.subCarencia.nombreSubCarencia)
        ans['responsable'] = str(self.responsable.nombreResponsable)
        return ans

    class Meta:
        verbose_name_plural = "Acciones Estrategicas"


class Periodo(models.Model):
    nombrePeriodo = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return self.nombrePeriodo.__str__()

    class Meta:
        ordering = ['nombrePeriodo']

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['nombrePeriodo'] = str(self.nombrePeriodo)

        return ans


@python_2_unicode_compatible
class Mes(models.Model):
    nombreMes = models.CharField(max_length=20, null=False, blank=False)

    def __str__(self):  # __unicode__ on Python 2
        return self.nombreMes

    class Meta:
        verbose_name = 'Mes'
        verbose_name_plural = 'Meses'

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        return ans


@python_2_unicode_compatible
class Meta(models.Model):
    nombreMeta = models.CharField(max_length=200, null=False, )
    accionEstrategica = models.ForeignKey(AccionEstrategica, null=False, blank=False, verbose_name='Acción Estrategica')
    periodo = models.ForeignKey(Periodo, null=False, blank=False)
    observaciones = models.TextField(max_length=500, default="", blank=True)

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['accionEstrategica'] = self.accionEstrategica.nombreAccion
        ans['estado'] = self.estado.nombreEstado
        ans['periodo'] = self.periodo.nombrePeriodo
        return ans

    def __str__(self):
        return self.accionEstrategica.nombreAccion

    class Meta:
        unique_together = [("accionEstrategica", "periodo",)]
        verbose_name = 'Meta'
        verbose_name_plural = 'Metas'

    def save(self, *args, **kwargs):
        self.nombreMeta = self.accionEstrategica.nombreAccion
        super(Meta, self).save(*args, **kwargs)


class MetaMensual(models.Model):
    meta = models.ForeignKey(Meta, null=False, blank=False)
    estado = models.ForeignKey(Estado, null=False, blank=False)
    inversionAprox = models.FloatField()
    ene = models.FloatField(null=False, default=0)
    feb = models.FloatField(null=False, default=0)
    mar = models.FloatField(null=False, default=0)
    abr = models.FloatField(null=False, default=0)
    may = models.FloatField(null=False, default=0)
    jun = models.FloatField(null=False, default=0)
    jul = models.FloatField(null=False, default=0)
    ago = models.FloatField(null=False, default=0)
    sep = models.FloatField(null=False, default=0)
    oct = models.FloatField(null=False, default=0)
    nov = models.FloatField(null=False, default=0)
    dic = models.FloatField(null=False, default=0)

    class Meta:
        unique_together = [("meta", "estado",)]
        verbose_name = 'Meta Mensual'
        verbose_name_plural = 'Metas Mensuales'


@python_2_unicode_compatible
class AvancePorMunicipio(models.Model):
    meta = models.ForeignKey(Meta, null=False, blank=False, verbose_name="Acción Estratégica")
    estado = models.ForeignKey(Estado, null=False, blank=False)
    periodo = models.ForeignKey(Periodo, null=False, blank=False)

    def __str__(self):
        return self.meta.accionEstrategica.nombreAccion + " - " + self.estado.nombreEstado

    class Meta:
        unique_together = [("meta", "periodo", "estado")]
        verbose_name = 'Avance por Municipio'
        verbose_name_plural = 'Avances por Municipio'


class AvanceMensual(models.Model):
    avancePorMunicipio = models.ForeignKey(AvancePorMunicipio, null=False, blank=False)
    municipio = models.ForeignKey(Municipio, null=False, blank=False)
    ene = models.FloatField(null=False, default=0)
    feb = models.FloatField(null=False, default=0)
    mar = models.FloatField(null=False, default=0)
    abr = models.FloatField(null=False, default=0)
    may = models.FloatField(null=False, default=0)
    jun = models.FloatField(null=False, default=0)
    jul = models.FloatField(null=False, default=0)
    ago = models.FloatField(null=False, default=0)
    sep = models.FloatField(null=False, default=0)
    oct = models.FloatField(null=False, default=0)
    nov = models.FloatField(null=False, default=0)
    dic = models.FloatField(null=False, default=0)

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['meta'] = "meta_ISSTE"
        ans['municipio'] = self.municipio.nombreMunicipio
        ans['periodo'] = self.periodo.nombrePeriodo
        return ans

    class Meta:
        unique_together = [("avancePorMunicipio", "municipio")]
        verbose_name = "Avance Mensual"
        verbose_name_plural = "Avances Mensuales"


class Usuario(models.Model):
    ADMIN_GENERAL = "AG"
    USUARIO_CENTRAL = "UC"
    FUNCIONARIO_CENTRAL = "FC"
    USUARIO_ESTATAL = "UE"
    FUNCIONARIO_ESTATAL = "FE"

    ROLES_CHOICES = (
        (ADMIN_GENERAL, 'Administrador General'),
        (USUARIO_CENTRAL, 'Usuario Central'),
        (FUNCIONARIO_CENTRAL, 'Funcionario Central'),
        (USUARIO_ESTATAL, 'Usuario Estatal'),
        (FUNCIONARIO_ESTATAL, 'Funcionario Estatal'),

    )

    user = models.OneToOneField(User)
    rol = models.CharField(max_length=2, choices=ROLES_CHOICES, default=User)
    estado = models.ForeignKey(Estado, null=False, blank=False)
