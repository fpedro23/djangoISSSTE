# coding=utf-8

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.utils.encoding import python_2_unicode_compatible
from datetime import date

# Create your models here.
from django.forms import model_to_dict


## Seleccionar el año actual (2016)
def getPeriodoActual():
    periodoActual = date.today().year
    try:
        periodo = Periodo.objects.get(nombrePeriodo=periodoActual)
    except Periodo.DoesNotExist:
        periodo = None
    #print periodo

    return periodo


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
        ans['nombreResponsable'] = str(self.responsable.nombreResponsable)
        ans['nombreAccion'] = str(self.nombreAccion)

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
    periodo = models.ForeignKey(Periodo, null=False, blank=False, default=getPeriodoActual().nombrePeriodo)
    observaciones = models.TextField(max_length=500, default="", blank=True)
    montoPromedio = models.FloatField(null=False, default=0, verbose_name= 'Monto Promedio')

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['accionEstrategica'] = self.accionEstrategica.nombreAccion
        ans['estado'] = MetaMensual.estado.nombreEstado
        #ans['estado'] = self.estado.nombreEstado
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
    inversionAprox = models.FloatField(default=0)
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

    def save(self, *args, **kwargs):
        print "Saving Meta 1"
        suma_metas = self.ene + self.feb + self.mar + self.abr + self.may + self.jun + self.jul + self.ago + self.sep
        suma_metas += self.oct + self.nov + self.dic
        self.inversionAprox = suma_metas * self.meta.montoPromedio
        print "Inversion %f" % self.inversionAprox
        super(MetaMensual, self).save(*args, **kwargs)

    def to_serializable_dict(self):
        ans = model_to_dict(self)
        ans['id'] = str(self.id)
        ans['meta'] = "meta_ISSTE"
        ans['estado'] = self.estado.nombreEstado
        return ans


@python_2_unicode_compatible
class AvancePorMunicipio(models.Model):
    meta = models.ForeignKey(Meta, null=False, blank=False, verbose_name="Acción Estratégica")
    estado = models.ForeignKey(Estado, null=False, blank=False)
    periodo = models.ForeignKey(Periodo, null=False, blank=False, default=getPeriodoActual().nombrePeriodo)
    inversionAprox = models.FloatField(default=0)

    def __str__(self):
        return self.meta.accionEstrategica.nombreAccion + " - " + self.estado.nombreEstado

    class Meta:
        unique_together = [("meta", "periodo", "estado")]
        verbose_name = 'Avance por Municipio'
        verbose_name_plural = 'Avances por Municipio'

    def save(self, *args, **kwargs):
        monto_promedio = 0
        for meta in Meta.objects.filter(id=self.meta.id):
            monto_promedio = meta.montoPromedio

        avances_mensuales = AvanceMensual.objects.filter(avancePorMunicipio__id=self.id)
        suma_avances = 0
        for avance_mensual in avances_mensuales:
            suma_avances += avance_mensual.ene + avance_mensual.feb + avance_mensual.mar + avance_mensual.abr
            suma_avances += avance_mensual.may + avance_mensual.jun + avance_mensual.jul + avance_mensual.ago
            suma_avances += avance_mensual.sep + avance_mensual.oct + avance_mensual.nov + avance_mensual.dic
        print "Avances %f" % suma_avances
        print "Monto: %f" % monto_promedio
        self.inversionAprox = suma_avances * monto_promedio
        super(AvancePorMunicipio, self).save(*args, **kwargs)



class AvanceMensual(models.Model):
    avancePorMunicipio = models.ForeignKey(AvancePorMunicipio, null=False, blank=False)
    municipio = models.ForeignKey(Municipio, null=False, blank=False)
    fecha_ultima_modificacion = models.DateTimeField(auto_now=True)
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
        ans['fecha_ultima_modificacion'] = self.fecha_ultima_modificacion.__str__()
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
