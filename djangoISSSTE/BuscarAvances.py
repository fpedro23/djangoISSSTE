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
			unidad_de_medida,
			limite_inferior,
			limite_superior,
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
		self.limite_inferior = limite_inferior
		self.limite_superior = limite_superior

	def buscar(self):
		query = Q()
		query_estado = Q()
		if self.carencias is not  None:
			query = query | Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id__in = self.carencias)
			query_estado = query_estado | Q(meta__accionEstrategica__subCarencia__carencia__id__in = self.carencias)

		if self.subcarencias is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__id__in = self.subcarencias)
			query_estado = query_estado & Q(meta__accionEstrategica__subCarencia__id__in=self.subcarencias)

		if self.estados is not None:
			query = query & Q(avancePorMunicipio__estado__id__in = self.estados)
			query_estado = query_estado & Q(estado__id__in=self.estados)

		if self.municipios is not None:
			query = query & Q(municipio__id__in=self.municipios)

		if self.periodos is not None:
			query = query & Q(avancePorMunicipio__periodo__id__in=self.periodos)
			query_estado = query_estado & Q(periodo__id__in=self.periodos)

		if self.inversion_minima is not None and self.inversion_maxima is not None:
			query = query & Q(avancePorMunicipio__inversionAprox__range = (self.inversion_minima, self.inversion_maxima))
			query_estado = query_estado & Q(inversionAprox__range = (self.inversion_minima, self.inversion_maxima))

		if self.observaciones is not None:
			query = query & Q(avancePorMunicipio__meta__observaciones__contains = self.observaciones)
			query_estado = query_estado & Q(meta__observaciones__contains = self.observaciones)

		if self.unidad_de_medida is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__unidadDeMedida__contains=self.unidad_de_medida)
			query_estado = query_estado & Q(meta__accionEstrategica__unidadDeMedida__contains=self.unidad_de_medida)

		avances_mensuales = None
		avances_por_municipio = None
		if query is not None:
			avances_mensuales = AvanceMensual.objects.filter(query)
		else:
			avances_mensuales = AvanceMensual.objects.all()

		if query_estado is not None:
			avances_por_municipio = AvancePorMunicipio.objects.filter(query_estado)
		else:
			avances_por_municipio = AvancePorMunicipio.objects.all()

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
		)[self.limite_inferior:self.limite_superior]

		reporte_por_estado = avances_por_municipio.values(
			'id',
			'estado__nombreEstado',
			'meta__accionEstrategica__subCarencia__carencia__nombreCarencia',
			'meta__montoPromedio'
		)[self.limite_inferior:self.limite_superior]

		reportes = {
			"reporte_general" : reporte_general,
			"reporte_por_estado" : reporte_por_estado
		}

		return reportes