# coding=utf-8
__author__ = 'Oscar'
from django.db.models import Q
from django.db.models import Count, Sum
from djangoISSSTE.models import *

class BuscarAvances:
	def __init__(
			self,
			carencias,
			subcarencias,
			acciones,
			estados,
			municipios,
			periodos,
			meses,
			observaciones,
			avance_minimo,
			avance_maximo,
			inversion_minima,
			inversion_maxima,
			unidad_de_medida
	):
		self.carencias = carencias
		self.subcarencias = subcarencias
		self.accions = acciones
		self.estados = estados
		self.municipios = municipios
		self.periodos = periodos
		self.meses = meses
		self.observaciones = observaciones
		self.avance_minimo = avance_minimo
		self.avance_maximo = avance_maximo
		self.inversion_minima = inversion_minima
		self.inversion_maxima = inversion_maxima
		self.unidad_de_medida = unidad_de_medida

	def buscar(self):
		query = Q()
		if self.carencias is not  None:
			query = query | Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id__in = self.carencias)

		if self.subcarencias is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__id__in = self.subcarencias)

		if self.estados is not None:
			query = query & Q(avancePorMunicipio__estado__id__in = self.estados)

		if self.municipios is not None:
			query = query & Q(municipio__id__in=self.municipios)

		if self.periodos is not None:
			query = query & Q(avancePorMunicipio__periodo__id__in=self.periodos)

		if self.inversion_minima is not None and self.inversion_maxima is not None:
			query = query & Q(avancePorMunicipio__inversionAprox__range = (self.avance_minimo, self.avance_maximo))

		if self.observaciones is not None:
			query = query & Q(avancePorMunicipio__meta__observaciones__contains = self.observaciones)

		if self.unidad_de_medida is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__unidadDeMedida__contains=self.unidad_de_medida)

		avances_mensuales = None
		if query is not  None:
			avances_mensuales =AvanceMensual.objects.filter(query)
			#print "Query %s" % query

		reporte_general = avances_mensuales.values(
			'id',
			'avancePorMunicipio__meta__accionEstrategica__nombreAccion',
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia',
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia',
			'avancePorMunicipio__estado__nombreEstado',
			'municipio__nombreMunicipio',
			'avancePorMunicipio__periodo__nombrePeriodo',
			'municipio__latitud',
			'municipio__longitud',
		)

		reportes = {
			"reporte_general" : reporte_general
		}

		#print reporte_general

		return reportes