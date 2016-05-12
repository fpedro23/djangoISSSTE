# coding=utf-8
__author__ = 'Oscar'
from django.db.models import Q
from django.db.models import Count, Sum
from djangoISSSTE.models import *

class BuscarAvances:
	# Constructor del buscador de avances
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
		self.acciones = acciones
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


	def buscar(self):			# Formando el query que filtrará los avances por municipio
		query_estado = Q()
		query = Q()
		if self.carencias is not  None:
			query = query | Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id__in = self.carencias)
			query_estado = query_estado | Q(meta__accionEstrategica__subCarencia__carencia__id__in = self.carencias)

		if self.subcarencias is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__subCarencia__id__in = self.subcarencias)
			query_estado = query_estado & Q(meta__accionEstrategica__subCarencia__id__in=self.subcarencias)

		if self.acciones is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__id__in=self.acciones)
			query_estado = query_estado & Q(meta__accionEstrategica__id__in=self.acciones)

		if self.estados is not None:
			query = query & Q(avancePorMunicipio__estado__id__in = self.estados)
			query_estado = query_estado & Q(estado__id__in=self.estados)

		if self.municipios is not None:
			query = query & Q(municipio__id__in=self.municipios)

		if self.periodos is not None:
			query = query & Q(avancePorMunicipio__periodo__id__in=self.periodos)
			query_estado = query_estado & Q(periodo__id__in=self.periodos)

		if self.avance_minimo is not None and self.avance_maximo is not None:
			query = query & Q(porcentajeAvance__range=(self.avance_minimo, self.avance_maximo))

		if self.inversion_minima is not None and self.inversion_maxima is not None:
			query = query & Q(avancePorMunicipio__inversionAprox__range = (self.inversion_minima, self.inversion_maxima))
			query_estado = query_estado & Q(inversionAprox__range = (self.inversion_minima, self.inversion_maxima))

		if self.observaciones is not None:
			query = query & Q(avancePorMunicipio__meta__observaciones__contains = self.observaciones)
			query_estado = query_estado & Q(meta__observaciones__contains = self.observaciones)

		if self.unidad_de_medida is not None:
			query = query & Q(avancePorMunicipio__meta__accionEstrategica__unidadDeMedida__id=self.unidad_de_medida)
			query_estado = query_estado & Q(meta__accionEstrategica__unidadDeMedida__id=self.unidad_de_medida)

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

		# Reporte general (devuelve avances en base a los filtros)
		reporte_general = avances_mensuales.values(
			'id',
			'avancePorMunicipio__meta__id',
			'avancePorMunicipio__meta__accionEstrategica__nombreAccion',
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia',
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia',
			'avancePorMunicipio__estado__nombreEstado',
			'avancePorMunicipio__estado__id',
			'municipio__nombreMunicipio',
			'avancePorMunicipio__periodo__nombrePeriodo',
			'municipio__latitud',
			'municipio__longitud',
		)[self.limite_inferior:self.limite_superior]

		#Reporte por estados
		reporte_por_estado = avances_mensuales.values(
			'avancePorMunicipio__estado__id',
			'avancePorMunicipio__estado__nombreEstado',
			'avancePorMunicipio__estado__latitud',
			'avancePorMunicipio__estado__longitud',
		).annotate(ene=Sum('ene'),feb=Sum('feb'),mar=Sum('mar'),abr=Sum('abr'),may=Sum('may'),
				   jun=Sum('jun'),jul=Sum('jul'),ago=Sum('ago'),sep=Sum('sep'),oct=Sum('oct'),
				   nov=Sum('nov'),dic=Sum('dic'))[self.limite_inferior:self.limite_superior]


		reporte_por_carencia = avances_mensuales.values(
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id',
			'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia',
		).annotate(ene=Sum('ene'),feb=Sum('feb'),mar=Sum('mar'),abr=Sum('abr'),may=Sum('may'),
				   jun=Sum('jun'),jul=Sum('jul'),ago=Sum('ago'),sep=Sum('sep'),oct=Sum('oct'),
				   nov=Sum('nov'),dic=Sum('dic'))[self.limite_inferior:self.limite_superior]

		reporte_por_accion = avances_mensuales.values(
			'avancePorMunicipio__meta__accionEstrategica__id',
			'avancePorMunicipio__meta__accionEstrategica__nombreAccion',
		).annotate(ene=Sum('ene'), feb=Sum('feb'), mar=Sum('mar'), abr=Sum('abr'), may=Sum('may'),
				   jun=Sum('jun'), jul=Sum('jul'), ago=Sum('ago'), sep=Sum('sep'), oct=Sum('oct'),
				   nov=Sum('nov'), dic=Sum('dic'))[self.limite_inferior:self.limite_superior]

		reportes = {
			"reporte_general" : reporte_general,
			"reporte_por_estado" : reporte_por_estado,
			"reporte_por_carencia": reporte_por_carencia,
			"reporte_por_accion" : reporte_por_accion,
			#"reporte_general" : [],
			#"reporte_por_estado" : [],
			#"reporte_por_carencia": [],
			#"reporte_por_accion" : []
		}

		return reportes

	def getMetasFiltradas(self, carenciaID, accionID, estadoID, metaID):
		the_query = Q()
		if self.carencias is not None:
			the_query = the_query | Q(meta__accionEstrategica__subCarencia__carencia__id__in=self.carencias)

		if self.subcarencias is not None:
			the_query = the_query & Q(meta__accionEstrategica__subCarencia__id__in=self.subcarencias)

		if self.acciones is not None:
			the_query = the_query & Q(meta__accionEstrategica__id__in=self.acciones)

		if self.estados is not None:
			the_query = the_query & Q(estado__id__in=self.estados)

		if self.periodos is not None:
			the_query = the_query & Q(meta__periodo__id__in=self.periodos)

		if self.inversion_minima is not None and self.inversion_maxima is not None:
			the_query = the_query & Q(inversionAprox__range=(self.inversion_minima, self.inversion_maxima))

		if self.observaciones is not None:
			the_query = the_query & Q(meta__observaciones__contains=self.observaciones)

		if self.unidad_de_medida is not None:
			the_query = the_query & Q(meta__accionEstrategica__unidadDeMedida__id=self.unidad_de_medida)

		if carenciaID is not None:
			the_query = the_query & Q(meta__accionEstrategica__subCarencia__carencia__id=carenciaID)

		if accionID is not None:
			the_query = the_query & Q(meta__accionEstrategica__id=accionID)

		if estadoID is not None:
			the_query = the_query & Q(estado__id=estadoID)

		if metaID is not None:
			the_query = the_query & Q(meta__id=metaID)

		metasMensuales = MetaMensual.objects.filter(the_query)
		metas_por_carencia = metasMensuales.values().annotate(ene=Sum('ene'), feb=Sum('feb'), mar=Sum('mar'), abr=Sum('abr'), may=Sum('may'),
				   jun=Sum('jun'), jul=Sum('jul'), ago=Sum('ago'), sep=Sum('sep'), oct=Sum('oct'),
				   nov=Sum('nov'), dic=Sum('dic'))[self.limite_inferior:self.limite_superior]
		metas = {
			"meta" : metas_por_carencia
		}

		return metas