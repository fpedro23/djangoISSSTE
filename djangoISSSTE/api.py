# coding=utf-8
import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views import generic
from oauth2_provider.views.generic import ProtectedResourceView

from djangoISSSTE.models import *
from django.db.models import Q, Sum, Count


def get_array_or_none(the_string):
	if the_string is None:
		return None
	else:
		return map(int, the_string.split(','))


class EstadosEndpoint(ProtectedResourceView):
	def get(self, request):
		return HttpResponse(json.dumps(map(lambda estado: estado.to_serializable_dict(), Estado.objects.all())),
							'application/json')


class MunicipiosForEstadosEndpoint(ProtectedResourceView):
	def get(self, request):
		estado_ids = get_array_or_none(request.GET.get('estados'))
		all_estados = False

		if estado_ids is None:
			all_estados = True
		else:
			for estado_id in estado_ids:
				if estado_id == 33 or estado_id == 34:
					all_estados = True
					break

		if all_estados:
			municipios = Municipio.objects.order_by('nombreMunicipio').all()
		else:
			municipios = Municipio.objects.filter(estado_id__in=estado_ids).order_by('nombreMunicipio').all()

		the_list = []
		for municipio in municipios.values('id', 'nombreMunicipio'):
				the_list.append(municipio)

		return HttpResponse(json.dumps(the_list), 'application/json')


class ReporteInicioEndpoint(ProtectedResourceView):
    def rename_municipio(self, avance):
        avance['municipio'] = avance['municipio__nombreMunicipio']
        del avance['municipio__nombreMunicipio']

    def get(self, request):
	avances = AvanceMensual.objects.all()

        reporte = {
            'reporte_mapa': {'avance_mapa': {}},
            'reporte_total': {'avance_educacion': {}, 'avance_salud': {}, 'avance_vivienda': {}, 'avance_alimentacion': {}},
			'reporte2016': {'avance_educacion': {}, 'avance_salud': {}, 'avance_vivienda': {}, 'avance_alimentacion': {}},
            'educacion': {'total': {}},
            'salud': {'total': {}},
            'vivienda': {'total': {}},
            'alimentacion': {'total': {}},
        }

        avance_mapa = avances
        the_list = []
        reporte_municipio = avances.values('municipio__latitud', 'municipio__longitud', 'municipio__nombreMunicipio',
										  'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic','avancePorMunicipio')
        for avance in reporte_municipio:
            self.rename_municipio(avance)
            the_list.append(avance)
        reporte['reporte_mapa']['avance_mapa']['avances'] = the_list
	S=reporte_municipio
	total =S.aggregate(Sum('ene'))['ene__sum'] + S.aggregate(Sum('feb'))['feb__sum']+ S.aggregate(Sum('mar'))['mar__sum']
	+S.aggregate(Sum('abr'))['abr__sum']+S.aggregate(Sum('may'))['may__sum']+S.aggregate(Sum('jun'))['jun__sum']
	+S.aggregate(Sum('jul'))['jul__sum']
	+S.aggregate(Sum('ago'))['ago__sum']+S.aggregate(Sum('sep'))['sep__sum']+S.aggregate(Sum('oct'))['oct__sum']
	+S.aggregate(Sum('nov'))['nov__sum']+S.aggregate(Sum('dic'))['dic__sum']
        reporte['reporte_mapa']['avance_mapa']['total'] = total


        # Grafico, obras totales
        avances_totales_educacion = avances.filter(avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id=1)
        the_list = []
        for avance in avances_totales_educacion.values('municipio__latitud', 'municipio__longitud', 'municipio__nombreMunicipio',
													   'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic','avancePorMunicipio__periodo'):
            self.rename_municipio(avance)
            the_list.append(avance)
        reporte['reporte_total']['avance_educacion']['avances'] = the_list
	S=avances_totales_educacion
	total =S.aggregate(Sum('ene'))['ene__sum'] + S.aggregate(Sum('feb'))['feb__sum']+ S.aggregate(Sum('mar'))['mar__sum']
	+S.aggregate(Sum('abr'))['abr__sum']+S.aggregate(Sum('may'))['may__sum']+S.aggregate(Sum('jun'))['jun__sum']
	+S.aggregate(Sum('jul'))['jul__sum']
	+S.aggregate(Sum('ago'))['ago__sum']+S.aggregate(Sum('sep'))['sep__sum']+S.aggregate(Sum('oct'))['oct__sum']
	+S.aggregate(Sum('nov'))['nov__sum']+S.aggregate(Sum('dic'))['dic__sum']
        reporte['reporte_total']['avance_educacion']['total'] = total

	reporte['reporte_total']['avance_salud']['total'] = 15
	reporte['reporte_total']['avance_vivienda']['total'] = 8
	reporte['reporte_total']['avance_alimentacion']['total'] = 5




        # Reportes anuales 2012-2015
        avance2016_educacion = avances_totales_educacion.filter(avancePorMunicipio__periodo=2016)
        the_list = []

        for avance in avance2016_educacion.values('municipio__latitud', 'municipio__longitud', 'municipio__nombreMunicipio',
												  'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'):
            self.rename_municipio(avance)
            the_list.append(avance)
        reporte['reporte2016']['avance_educacion']['avances'] = the_list
	S=avance2016_educacion
	total=0
	if S:
		total =S.aggregate(Sum('ene'))['ene__sum'] + S.aggregate(Sum('feb'))['feb__sum']+ S.aggregate(Sum('mar'))['mar__sum']
		+S.aggregate(Sum('abr'))['abr__sum']+S.aggregate(Sum('may'))['may__sum']+S.aggregate(Sum('jun'))['jun__sum']
		+S.aggregate(Sum('jul'))['jul__sum']
		+S.aggregate(Sum('ago'))['ago__sum']+S.aggregate(Sum('sep'))['sep__sum']+S.aggregate(Sum('oct'))['oct__sum']
		+S.aggregate(Sum('nov'))['nov__sum']+S.aggregate(Sum('dic'))['dic__sum']

    	reporte['reporte2016']['avance_educacion']['total'] = total


        return HttpResponse(json.dumps(reporte), 'application/json')
