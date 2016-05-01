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

def get_avance_values(modelo):
    return modelo.values('avancemensual__municipio__latitud', 'avancemensual__municipio__longitud', 'avancemensual__municipio__nombreMunicipio',
                                           'avancemensual__ene','avancemensual__feb','avancemensual__mar','avancemensual__abr','avancemensual__may',
										   'avancemensual__jun','avancemensual__jul','avancemensual__ago','avancemensual__sep','avancemensual__oct',
										   'avancemensual__nov','avancemensual__dic','avancemensual__avancePorMunicipio')
def get_suma_mes(S):
    return S.aggregate(Sum('avancemensual__ene'))['avancemensual__ene__sum'] + S.aggregate(Sum('avancemensual__feb'))['avancemensual__feb__sum']+\
           S.aggregate(Sum('avancemensual__mar'))['avancemensual__mar__sum'] +S.aggregate(Sum('avancemensual__abr'))['avancemensual__abr__sum']+\
           S.aggregate(Sum('avancemensual__may'))['avancemensual__may__sum']+S.aggregate(Sum('avancemensual__jun'))['avancemensual__jun__sum']\
           +S.aggregate(Sum('avancemensual__jul'))['avancemensual__jul__sum']+S.aggregate(Sum('avancemensual__ago'))['avancemensual__ago__sum']+\
           S.aggregate(Sum('avancemensual__sep'))['avancemensual__sep__sum'] +S.aggregate(Sum('avancemensual__oct'))['avancemensual__oct__sum']+\
           S.aggregate(Sum('avancemensual__nov'))['avancemensual__nov__sum']+S.aggregate(Sum('avancemensual__dic'))['avancemensual__dic__sum']

class ReporteInicioEndpoint(ProtectedResourceView):
    def rename_municipio(self, avance):
        avance['avancemensual__municipio'] = avance['avancemensual__municipio__nombreMunicipio']
        del avance['avancemensual__municipio__nombreMunicipio']

    def get(self, request):
        avances = AvancePorMunicipio.objects.all()

        reporte = {
            'reporte_mapa': {'avance_mapa': {}},
            'reporte_total': {'avance_educacion': {}, 'avance_salud': {}, 'avance_vivienda': {}, 'avance_alimentacion': {}},
			'reporte2016': {'avance_educacion': {}, 'avance_salud': {}, 'avance_vivienda': {}, 'avance_alimentacion': {}},
            'educacion': {'total': {}},
            'salud': {'total': {}},
            'vivienda': {'total': {}},
            'alimentacion': {'total': {}},
        }


        the_list = []
        reporte_municipio = get_avance_values(avances)
        if reporte_municipio:
            for avance in reporte_municipio:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte_mapa']['avance_mapa']['avances'] = the_list
            reporte['reporte_mapa']['avance_mapa']['total'] = get_suma_mes(reporte_municipio)
        else:
            reporte['reporte_mapa']['avance_mapa']['avances'] = the_list
            reporte['reporte_mapa']['avance_mapa']['total'] = 0


        # Grafico, obras totales
        avances_totales_educacion = avances.filter(avancemensual__avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id=1)
        the_list = []
        if avances_totales_educacion:
            avances_values=get_avance_values(avances_totales_educacion)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte_total']['avance_educacion']['avances'] = the_list
            reporte['reporte_total']['avance_educacion']['total'] = get_suma_mes(avances_totales_educacion)
        else:
            reporte['reporte_total']['avance_educacion']['avances'] = the_list
            reporte['reporte_total']['avance_educacion']['total'] = 0


        reporte['reporte_total']['avance_salud']['total'] = 15
        reporte['reporte_total']['avance_vivienda']['total'] = 8
        reporte['reporte_total']['avance_alimentacion']['total'] = 5


        # Reportes anuales 2012-2015
        avance2016_educacion = avances_totales_educacion.filter(avancemensual__avancePorMunicipio__periodo=2016)
        the_list = []
        if avance2016_educacion:
            avances_values=get_avance_values(avance2016_educacion)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte2016']['avance_educacion']['avances'] = the_list
            reporte['reporte2016']['avance_educacion']['total'] = get_suma_mes(avance2016_educacion)
        else:
            reporte['reporte2016']['avance_educacion']['avances'] = the_list
            reporte['reporte2016']['avance_educacion']['total'] = 0

        return HttpResponse(json.dumps(reporte), 'application/json')
