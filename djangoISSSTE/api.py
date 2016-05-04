# coding=utf-8
import json
from _ast import List

from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import HttpResponse, StreamingHttpResponse
from django.views import generic
from django.views.generic.list import ListView
from oauth2_provider.models import AccessToken

from djangoISSSTE.BuscarAvances import BuscarAvances
from oauth2_provider.views.generic import ProtectedResourceView
from wsgiref.util import FileWrapper

from djangoISSSTE.models import *
from django.db.models import Q, Sum, Count


from pptx import Presentation
from pptx.util import Inches
from pptx.util import Pt
from pptx.dml.color import RGBColor

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO



def get_array_or_none(the_string):
    if the_string is None:
        return None
    else:
        return map(int, the_string.split(','))


# Api para regresar todas las carencias
class CarenciasEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
                json.dumps((map(lambda carencia: carencia.to_serializable_dict(), Carencia.objects.all())),
                           'application/json', ensure_ascii=False))


# Api para regresar subcarencias pertenecientes a una carencia en especial
class SubcarenciasForCarenciasEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        carencia_ids = get_array_or_none(request.GET.get('carencias'))
        all_carencias = False

        if carencia_ids is None:
            all_carencias = True

        if all_carencias:
            subcarencias = SubCarencia.objects.order_by('nombreSubCarencia').all()
            print (subcarencias)
        else:
            subcarencias = SubCarencia.objects.filter(carencia_id__in=carencia_ids).order_by(
                    'nombreSubCarencia').all()

        the_list = []
        for subcarencias in subcarencias.values('id', 'nombreSubCarencia'):
            the_list.append(subcarencias)

        return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json', )


class AccionesForSubCarenciasEndpoint(ProtectedResourceView):
	def get(self, request, *args, **kwargs):
		subcarencias_ids = get_array_or_none(request.GET.get('subcarencias'))
		all_acciones = False

		if subcarencias_ids is None:
			all_acciones = True

		if all_acciones:
			acciones = AccionEstrategica.objects.order_by('nombreAccion').all()
		else:
			acciones = AccionEstrategica.objects.filter(subCarencia_id__in=subcarencias_ids).order_by(
				'nombreAccion').all()

		the_list = []
		for accion in acciones.values():
			the_list.append(accion)

		return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json', )


class ResponsablesForAccionEndpoint(ProtectedResourceView):
	def get(self, request, *args, **kwargs):
		acciones_ids = get_array_or_none(request.GET.get('acciones'))
		all_responsables = False

		if acciones_ids is None:
			all_responsables = True

		if all_responsables:
			responsables = Responsable.objects.order_by('nombreResponsable').all()
		else:
			acciones_in = AccionEstrategica.objects.filter(id__in=acciones_ids)
			responsables = Responsable.objects.filter(id__in=acciones_in.values('responsable__id')).order_by(
				'nombreResponsable').all()

		the_list = []
		for responsable in responsables.values():
			the_list.append(responsable)

		return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json', )

# Api para regresar todos los responsables dados de alta
class ResponsablesEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
                json.dumps((map(lambda responsable: responsable.to_serializable_dict(), Responsable.objects.all())),
                           'application/json', ensure_ascii=False))


# Clase EndPoint (oauth2) para devolver los estados
class EstadosEndpoint(ProtectedResourceView):
	def get(self, request):
		return HttpResponse(
				json.dumps((map(lambda estado: estado.to_serializable_dict(), Estado.objects.all())),
						   ensure_ascii=False),
				'application/json')


# Clase EndPoint (oauth2) para devolver los municipios, dado un estado
class MunicipiosForEstadosEndpoint(ProtectedResourceView):
    def get(self, request):
        # Obteniendo los datos de la url
        estado_ids = get_array_or_none(request.GET.get('estados'))
        all_estados = False

        # Si TRUE, no hubo estados estados en la url y se regresan
        # todos los municipios de la base de datos
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

        # Arreglo necesario para la conversión a json
        the_list = []
        for municipio in municipios.values('nombreMunicipio', 'id', 'latitud', 'longitud'):
            the_list.append(municipio)

        return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json', )


# Clase EndPoint (oauth2) para devolver los periodos
class PeriodosEndpoint(ProtectedResourceView):
    def get(self, request):
        return HttpResponse(json.dumps((map(lambda periodo: periodo.to_serializable_dict(), Periodo.objects.all())),
                                       ensure_ascii=False), 'application/json')


# Clase EndPoint (oauth2) para devolver los mese
class MesesEndpoint(ProtectedResourceView):
    def get(self, request):
        return HttpResponse(json.dumps((map(lambda mes: mes.to_serializable_dict(), Mes.objects.all())),
                                       'application/json', ensure_ascii=False))


# Clase EndPoint (oauth2) para devolver las metas
class MetasEndpoint(ProtectedResourceView):
	def get(self, request):
		return HttpResponse(json.dumps(map(lambda meta: meta.to_serializable_dict(), Meta.objects.all())
									   ,ensure_ascii= False),'application/json')


# Clase EndPoint (oauth2) para devolver las metas mensuales dada una acción
class MetasMensualesPorAccionEndpoint(ProtectedResourceView):
	def get(self, request):
		# Obteniendo los datos de la url
		accion_ids = get_array_or_none(request.GET.get('acciones'))
		estado_ids = get_array_or_none(request.GET.get('estados'))
		all_metas_mensuales = False
		arreglo_meta = []

		if accion_ids is None:
			all_metas_mensuales = True

		# Si TRUE, no hubo acciones en la url y se regresan
		# todas las metas mensuales de la base de datos
		if all_metas_mensuales:
			metas_mensuales = MetaMensual.objects.order_by('inversionAprox').all()
		else:
			for meta in Meta.objects.filter(accionEstrategica_id__in=accion_ids):
				arreglo_meta.append(meta.id)

			metas_mensuales = MetaMensual.objects.filter(meta_id__in=arreglo_meta, estado_id__in = estado_ids)

		the_list = []
		for meta_mensual in metas_mensuales.values():
			the_list.append(meta_mensual)

		return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json')


# Clase EndPoint (oauth2) para devolver los avances mensuales dada una acción
class AvancesMensualesPorAccionEndpoint(ProtectedResourceView):
	def get(self, request):
		# Obteniendo los datos de la url
		accion_ids = get_array_or_none(request.GET.get('acciones'))
		all_avances_mensuales = False
		arreglo_meta = []
		arreglo_avance_municipio = []

		if accion_ids is None:
			all_avances_mensuales = True

		# Si TRUE, no hubo acciones en la url y se regresan
		# todas los avances mensuales de la base de datos
		if all_avances_mensuales:
			avances_mensuales = AvanceMensual.objects.order_by('municipio').all()
		else:
			for meta in Meta.objects.filter(accionEstrategica_id__in=accion_ids):
				arreglo_meta.append(meta.id)

			for avance_municipio in AvancePorMunicipio.objects.filter(meta_id__in=arreglo_meta):
				arreglo_avance_municipio.append(avance_municipio.id)

			avances_mensuales = AvanceMensual.objects.filter(avancePorMunicipio_id__in=arreglo_avance_municipio)

		the_list = []
		for avance_mensual in avances_mensuales.values():
			the_list.append(avance_mensual)

		return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json')


# Clase EndPoint (oauth2) para devolver las metas mensuales dada una meta
class MetasMensualesPorMetaEndpoint(ProtectedResourceView):
    def get(self, request):
        # Obteniendo los datos de la url
        meta_ids = get_array_or_none(request.GET.get('metas'))
        all_metas_mensuales = False

        if meta_ids is None:
            all_metas_mensuales = True

        # Si TRUE, no hubo metas estados en la url y se regresan
        # todas las metas mensuales de la base de datos
        if all_metas_mensuales:
            metas_mensuales = MetaMensual.objects.order_by('meta').all()
        else:
            metas_mensuales = MetaMensual.objects.filter(meta_id__in=meta_ids).order_by('meta').all()

        # Arreglo necesario para la conversión a json
        the_list = []
        for meta_mensual in metas_mensuales.values():
            the_list.append(meta_mensual)

        return HttpResponse(json.dumps((the_list), ensure_ascii=False), 'application/json')


# Clase EndPoint (oauth2) para devolver los avances mensuales dada una meta
class avancesMensualesPorMetaEndpoint(ProtectedResourceView):
    def get(self, request):
        # Obteniendo los datos de la url
        meta_ids = get_array_or_none(request.GET.get('metas'))
        all_avances_mensuales = False
        arreglo_avance_municipio = []

        if meta_ids is None:
            all_avances_mensuales = True

        # Si TRUE, no hubo metas estados en la url y se regresan
        # todas las metas mensuales de la base de datos
        if all_avances_mensuales:
            avances_mensuales = AvanceMensual.objects.order_by('municipio').all()
        else:
            for avancePorMunicipo in AvancePorMunicipio.objects.filter(meta_id__in=meta_ids):
                arreglo_avance_municipio.append(avancePorMunicipo.id)

            avances_mensuales = AvanceMensual.objects.filter(avancePorMunicipio__id__in=arreglo_avance_municipio)

        the_list = []
        for avance_mensual in avances_mensuales.values():
            the_list.append(avance_mensual)

        return HttpResponse(json.dumps(the_list, ensure_ascii=False), 'application/json')


# Clase EndPoint (oauth2) para implementar el buscador en base al filtro grande
class BuscadorEndpoint(ProtectedResourceView):
	def get(self, request):
		myObj = BuscarAvances(
			carencias = get_array_or_none(request.GET.get('carencias')),
			subcarencias = get_array_or_none(request.GET.get('subcarencias')),
			acciones = get_array_or_none(request.GET.get('acciones')),
			estados = get_array_or_none(request.GET.get('estados')),
			municipios = get_array_or_none(request.GET.get('municipios')),
			periodos = get_array_or_none(request.GET.get('periodos')),
			meses = get_array_or_none(request.GET.get('meses')),
			observaciones = request.GET.get('observaciones'),
			avance_minimo = get_array_or_none(request.GET.get('avanceMinimo')),
			avance_maximo = get_array_or_none(request.GET.get('avanceMaximo')),
			inversion_minima = get_array_or_none(request.GET.get('inversionMinima')),
			inversion_maxima = get_array_or_none(request.GET.get('inversionMaxima')),
			unidad_de_medida = request.GET.get('unidadDeMedida'),
		)
		#user = AccessToken.objects.get(token=request.GET.get('access_token')).user
		resultados = myObj.buscar()

		json_map = {}
		json_map['reporte_general'] = []
		json_map['reporte_por_estado'] = []

		for reporte in resultados['reporte_general']:
			shortened_reporte = {}
			
			shortened_reporte['suma_avance'] = 0
			avance_mensual = AvanceMensual.objects.get(id=reporte['id'])
			if myObj.meses is not  None:
				for mes in myObj.meses:
					if mes == 1: shortened_reporte['suma_avance'] += avance_mensual.ene
					if mes == 2: shortened_reporte['suma_avance'] += avance_mensual.feb
					if mes == 3: shortened_reporte['suma_avance'] += avance_mensual.mar
					if mes == 4: shortened_reporte['suma_avance'] += avance_mensual.abr
					if mes == 5: shortened_reporte['suma_avance'] += avance_mensual.may
					if mes == 6: shortened_reporte['suma_avance'] += avance_mensual.jun
					if mes == 7: shortened_reporte['suma_avance'] += avance_mensual.jul
					if mes == 8: shortened_reporte['suma_avance'] += avance_mensual.ago
					if mes == 9: shortened_reporte['suma_avance'] += avance_mensual.sep
					if mes == 10: shortened_reporte['suma_avance'] += avance_mensual.oct
					if mes == 11: shortened_reporte['suma_avance'] += avance_mensual.nov
					if mes == 12: shortened_reporte['suma_avance'] += avance_mensual.dic
			else:

				shortened_reporte['suma_avance'] += avance_mensual.ene + avance_mensual.feb + avance_mensual.mar + avance_mensual.abr
				shortened_reporte['suma_avance'] += avance_mensual.may + avance_mensual.jun + avance_mensual.jul + avance_mensual.ago
				shortened_reporte['suma_avance'] += avance_mensual.sep + avance_mensual.oct + avance_mensual.nov + avance_mensual.dic
			shortened_reporte['id'] = reporte['id']
			shortened_reporte['accion'] = reporte['avancePorMunicipio__meta__accionEstrategica__nombreAccion']
			shortened_reporte['carencia'] = reporte['avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
			shortened_reporte['subCarencia'] = reporte['avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia']
			shortened_reporte['estado'] = reporte['avancePorMunicipio__estado__nombreEstado']
			shortened_reporte['municipio'] = reporte['municipio__nombreMunicipio']
			shortened_reporte['periodo'] = reporte['avancePorMunicipio__periodo__nombrePeriodo']
			shortened_reporte['latitud'] = reporte['municipio__latitud']
			shortened_reporte['longitud'] = reporte['municipio__longitud']
			json_map['reporte_general'].append(shortened_reporte)


		for reporte_estado in resultados['reporte_por_estado']:
			shortened_reporte = {}
			shortened_reporte['avance'] = 0
			if myObj.meses is not None:
				for mes in myObj.meses:
					if mes == 1: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('ene'))['ene__sum']
					if mes == 2: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('feb'))['feb__sum']
					if mes == 3: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('mar'))['mar__sum']
					if mes == 4: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('abr'))['abr__sum']
					if mes == 5: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('may'))['may__sum']
					if mes == 6: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('jun'))['jun__sum']
					if mes == 7: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('jul'))['jul__sum']
					if mes == 8: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('ago'))['ago__sum']
					if mes == 9: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('sep'))['sep__sum']
					if mes == 10: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('oct'))['oct__sum']
					if mes == 11: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('nov'))['nov__sum']
					if mes == 12: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('dic'))['dic__sum']
			else:
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ene'))['ene__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('feb'))['feb__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('mar'))['mar__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('abr'))['abr__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('may'))['may__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jun'))['jun__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jul'))['jul__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ago'))['ago__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('sep'))['sep__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('oct'))['oct__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('nov'))['nov__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('dic'))['dic__sum']

			shortened_reporte['id'] = reporte_estado['id']
			shortened_reporte['estado'] = reporte_estado['estado__nombreEstado']
			shortened_reporte['carencia'] = reporte_estado['meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
			shortened_reporte['montoPromedio'] = reporte_estado['meta__montoPromedio']
			shortened_reporte['inversion_aproximada'] = shortened_reporte['avance'] * reporte_estado['meta__montoPromedio']
			json_map['reporte_por_estado'].append(shortened_reporte)

		return HttpResponse(json.dumps(json_map, ensure_ascii=False), 'application/json')

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

        avances_totales_salud = avances.filter(avancemensual__avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id=2)
        the_list = []
        if avances_totales_salud:
            avances_values=get_avance_values(avances_totales_salud)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte_total']['avance_salud']['avances'] = the_list
            reporte['reporte_total']['avance_salud']['total'] = get_suma_mes(avances_totales_salud)
        else:
            reporte['reporte_total']['avance_salud']['avances'] = the_list
            reporte['reporte_total']['avance_salud']['total'] = 0

        avances_totales_vivienda = avances.filter(avancemensual__avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id=3)
        the_list = []
        if avances_totales_vivienda:
            avances_values=get_avance_values(avances_totales_vivienda)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte_total']['avance_vivienda']['avances'] = the_list
            reporte['reporte_total']['avance_vivienda']['total'] = get_suma_mes(avances_totales_vivienda)
        else:
            reporte['reporte_total']['avance_vivienda']['avances'] = the_list
            reporte['reporte_total']['avance_vivienda']['total'] = 0

        avances_totales_alimentacion = avances.filter(avancemensual__avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__id=4)
        the_list = []
        if avances_totales_alimentacion:
            avances_values=get_avance_values(avances_totales_alimentacion)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte_total']['avance_alimentacion']['avances'] = the_list
            reporte['reporte_total']['avance_alimentacion']['total'] = get_suma_mes(avances_totales_alimentacion)
        else:
            reporte['reporte_total']['avance_alimentacion']['avances'] = the_list
            reporte['reporte_total']['avance_alimentacion']['total'] = 0



        # Reportes anuales 2012-2015
        avance2016_educacion = avances_totales_educacion.filter(avancemensual__avancePorMunicipio__periodo__nombrePeriodo=2016).distinct()
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

        avance2016_salud = avances_totales_salud.filter(avancemensual__avancePorMunicipio__periodo__nombrePeriodo=2016).distinct()
        the_list = []
        if avance2016_salud:
            avances_values=get_avance_values(avance2016_salud)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte2016']['avance_salud']['avances'] = the_list
            reporte['reporte2016']['avance_salud']['total'] = get_suma_mes(avance2016_salud)
        else:
            reporte['reporte2016']['avance_salud']['avances'] = the_list
            reporte['reporte2016']['avance_salud']['total'] = 0

        avance2016_vivienda = avances_totales_vivienda.filter(avancemensual__avancePorMunicipio__periodo__nombrePeriodo=2016).distinct()
        the_list = []
        if avance2016_vivienda:
            avances_values=get_avance_values(avance2016_vivienda)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte2016']['avance_vivienda']['avances'] = the_list
            reporte['reporte2016']['avance_vivienda']['total'] = get_suma_mes(avance2016_vivienda)
        else:
            reporte['reporte2016']['avance_vivienda']['avances'] = the_list
            reporte['reporte2016']['avance_vivienda']['total'] = 0

        avance2016_alimentacion = avances_totales_alimentacion.filter(avancemensual__avancePorMunicipio__periodo__nombrePeriodo=2016).distinct()
        the_list = []
        if avance2016_alimentacion:
            avances_values=get_avance_values(avance2016_alimentacion)
            for avance in avances_values:
                self.rename_municipio(avance)
                the_list.append(avance)
            reporte['reporte2016']['avance_alimentacion']['avances'] = the_list
            reporte['reporte2016']['avance_alimentacion']['total'] = get_suma_mes(avance2016_alimentacion)
        else:
            reporte['reporte2016']['avance_alimentacion']['avances'] = the_list
            reporte['reporte2016']['avance_alimentacion']['total'] = 0


        return HttpResponse(json.dumps(reporte), 'application/json')

def get_usuario_for_token(token):
    if token:
        return AccessToken.objects.get(token=token).user
    else:
        return None

class ResultadosPptxEndpoint(ProtectedResourceView):
    def get(self, request):
		usuario = get_usuario_for_token(request.GET.get('access_token'))
		estados = get_array_or_none(request.GET.get('estados'))
		municipios = get_array_or_none(request.GET.get('municipios'))

		if estados is None or len(estados) == 0:
			if usuario.rol == 'AG' or usuario.rol == 'UR' or usuario.rol == 'FR':
				estados = None
			else:
				estados = [usuario.estado.id]

		if municipios is None or len(municipios) == 0:
			if usuario.rol == 'AG' or usuario.rol == 'UR' or usuario.rol == 'FR':
				municipios = None
			else:
				municipios = [Municipio.objects.filter(estado_id = usuario.estado.id)]

		myObj =  BuscarAvances(
			carencias = get_array_or_none(request.GET.get('carencias')),
			subcarencias = get_array_or_none(request.GET.get('subcarencias')),
			acciones = get_array_or_none(request.GET.get('acciones')),
			estados = estados,
			municipios = municipios,
			periodos = get_array_or_none(request.GET.get('periodos')),
			meses = get_array_or_none(request.GET.get('meses')),
			observaciones = request.GET.get('observaciones'),
			avance_minimo = get_array_or_none(request.GET.get('avanceMinimo')),
			avance_maximo = get_array_or_none(request.GET.get('avanceMaximo')),
			inversion_minima = get_array_or_none(request.GET.get('inversionMinima')),
			inversion_maxima = get_array_or_none(request.GET.get('inversionMaxima')),
			unidad_de_medida = request.GET.get('unidadDeMedida'),
		)
		resultados = myObj.buscar()

		#***********************************************************************************************************
		json_map = {}
		json_map['reporte_general'] = []
		for reporte in resultados['reporte_general']:
			shortened_reporte = {}
			shortened_reporte['suma_avance'] = 0
			avance_mensual = AvanceMensual.objects.get(id=reporte['id'])
			if myObj.meses is not  None:
				for mes in myObj.meses:
					if mes == 1: shortened_reporte['suma_avance'] += avance_mensual.ene
					if mes == 2: shortened_reporte['suma_avance'] += avance_mensual.feb
					if mes == 3: shortened_reporte['suma_avance'] += avance_mensual.mar
					if mes == 4: shortened_reporte['suma_avance'] += avance_mensual.abr
					if mes == 5: shortened_reporte['suma_avance'] += avance_mensual.may
					if mes == 6: shortened_reporte['suma_avance'] += avance_mensual.jun
					if mes == 7: shortened_reporte['suma_avance'] += avance_mensual.jul
					if mes == 8: shortened_reporte['suma_avance'] += avance_mensual.ago
					if mes == 9: shortened_reporte['suma_avance'] += avance_mensual.sep
					if mes == 10: shortened_reporte['suma_avance'] += avance_mensual.oct
					if mes == 11: shortened_reporte['suma_avance'] += avance_mensual.nov
					if mes == 12: shortened_reporte['suma_avance'] += avance_mensual.dic
			else:
				shortened_reporte['suma_avance'] += avance_mensual.ene + avance_mensual.feb + avance_mensual.mar + avance_mensual.abr
				shortened_reporte['suma_avance'] += avance_mensual.may + avance_mensual.jun + avance_mensual.jul + avance_mensual.ago
				shortened_reporte['suma_avance'] += avance_mensual.sep + avance_mensual.oct + avance_mensual.nov + avance_mensual.dic

			shortened_reporte['id'] = reporte['id']
			shortened_reporte['accion'] = reporte['avancePorMunicipio__meta__accionEstrategica__nombreAccion']
			shortened_reporte['carencia'] = reporte['avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
			shortened_reporte['subCarencia'] = reporte['avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia']
			shortened_reporte['estado'] = reporte['avancePorMunicipio__estado__nombreEstado']
			shortened_reporte['municipio'] = reporte['municipio__nombreMunicipio']
			shortened_reporte['periodo'] = reporte['avancePorMunicipio__periodo__nombrePeriodo']
			shortened_reporte['latitud'] = reporte['municipio__latitud']
			shortened_reporte['longitud'] = reporte['municipio__longitud']
			json_map['reporte_general'].append(shortened_reporte)

		output = StringIO.StringIO()
		prs = Presentation()
		slide = prs.slides.add_slide(prs.slide_layouts[5])
		shapes = slide.shapes
		shapes.title.text = 'Resultados'

		renglones = len(json_map['reporte_general'])
		if renglones < 22:
			rows = renglones+1
		else:
			rows = 22
		cols = 5
		left = Inches(0.921)
		top = Inches(1.2)
		width = Inches(6.0)
		height = Inches(0.8)

		table = shapes.add_table(rows, cols, left, top, width, height).table

		# set column width
		table.columns[0].width = Inches(1.1)
		table.columns[1].width = Inches(2.0)
		table.columns[2].width = Inches(3.0)
		table.columns[3].width = Inches(1.1)
		table.columns[4].width = Inches(1.1)

		# write column headings
		table.cell(0, 0).text = 'Carencia'
		table.cell(0, 1).text = 'Subcarencia'
		table.cell(0, 2).text = 'Accion'
		table.cell(0, 3).text = 'Municipio'
		table.cell(0, 4).text = 'Avance Total'

		# write body cells
		indice = 1
		for avance in json_map['reporte_general']:
			if indice == 22:
				indice = 1
				slide = prs.slides.add_slide(prs.slide_layouts[5])
				shapes = slide.shapes
				shapes.title.text = 'Resultados'
				rows = 22
				cols = 5
				left = Inches(0.921)
				top = Inches(1.2)
				width = Inches(6.0)
				height = Inches(0.8)
				table = shapes.add_table(rows, cols, left, top, width, height).table
				# set column widths
				table.columns[0].width = Inches(1.1)
				table.columns[1].width = Inches(2.0)
				table.columns[2].width = Inches(3.0)
				table.columns[3].width = Inches(1.1)
				table.columns[4].width = Inches(1.1)

				# write column headings
			for x in range(0, 5):
				cell = table.rows[0].cells[x]
				paragraph = cell.textframe.paragraphs[0]
				paragraph.font.size = Pt(12)
				paragraph.font.name = 'Arial Black'
				paragraph.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

			for x in range(0, 5):
				cell = table.rows[indice].cells[x]
				paragraph = cell.textframe.paragraphs[0]
				paragraph.font.size = Pt(8)
				paragraph.font.name = 'Arial'
				paragraph.font.color.rgb = RGBColor(0x0B, 0x0B, 0x0B)

			table.cell(0, 0).text = 'Carencia'
			table.cell(0, 1).text = 'Subcarencia'
			table.cell(0, 2).text = 'Accion'
			table.cell(0, 3).text = 'Municipio'
			table.cell(0, 4).text = 'Avance Total'

			# write body cells
			table.cell(indice, 0).text = avance['carencia']
			table.cell(indice, 1).text = avance['subCarencia']
			table.cell(indice, 2).text = avance['accion']
			table.cell(indice, 3).text = avance['municipio']
			table.cell(indice, 4).text = str(avance['suma_avance'])
			indice += 1

		prs.save(output)
		response = StreamingHttpResponse(FileWrapper(output),
                                         content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation')
		response['Content-Disposition'] = 'attachment; filename="Resultados.pptx"'
		response['Content-Length'] = output.tell()

		output.seek(0)

		return response

class ReportePptxEndpoint(ProtectedResourceView):
    def get(self, request):

        user = AccessToken.objects.get(token=request.GET.get('access_token')).user
        usuario = get_usuario_for_token(request.GET.get('access_token'))

        queryEstado = request.user.usuario.estado.id


        estados = get_array_or_none(request.GET.get('estados'))
        if estados is None or len(estados) == 0:
            if usuario.rol == 'AG':
                estados = None
            else:
                estados = [usuario.estado.id]

        myObj =  BuscarAvances(
			carencias = get_array_or_none(request.GET.get('carencias')),
			subcarencias = get_array_or_none(request.GET.get('subcarencias')),
			acciones = get_array_or_none(request.GET.get('acciones')),
			estados = estados,
			municipios = get_array_or_none(request.GET.get('municipios')),
			periodos = get_array_or_none(request.GET.get('periodos')),
			meses = get_array_or_none(request.GET.get('meses')),
			observaciones = request.GET.get('observaciones'),
			avance_minimo = get_array_or_none(request.GET.get('avanceMinimo')),
			avance_maximo = get_array_or_none(request.GET.get('avanceMaximo')),
			inversion_minima = get_array_or_none(request.GET.get('inversionMinima')),
			inversion_maxima = get_array_or_none(request.GET.get('inversionMaxima')),
			unidad_de_medida = request.GET.get('unidadDeMedida'),
		)
        resultados = myObj.buscar()

                #***********************************************************************************************************

        json_map = {}
        json_map['reporte_por_estado'] = []

        for reporte_estado in resultados['reporte_por_estado']:
			shortened_reporte = {}
			shortened_reporte['avance'] = 0
			if myObj.meses is not None:
				for mes in myObj.meses:
					if mes == 1: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('ene'))['ene__sum']
					if mes == 2: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('feb'))['feb__sum']
					if mes == 3: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('mar'))['mar__sum']
					if mes == 4: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('abr'))['abr__sum']
					if mes == 5: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('may'))['may__sum']
					if mes == 6: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('jun'))['jun__sum']
					if mes == 7: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('jul'))['jul__sum']
					if mes == 8: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('ago'))['ago__sum']
					if mes == 9: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('sep'))['sep__sum']
					if mes == 10: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('oct'))['oct__sum']
					if mes == 11: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('nov'))['nov__sum']
					if mes == 12: shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio = reporte_estado['id']).aggregate(Sum('dic'))['dic__sum']
			else:
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ene'))['ene__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('feb'))['feb__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('mar'))['mar__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('abr'))['abr__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('may'))['may__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jun'))['jun__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jul'))['jul__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ago'))['ago__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('sep'))['sep__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('oct'))['oct__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('nov'))['nov__sum']
				shortened_reporte['avance'] += AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('dic'))['dic__sum']

			shortened_reporte['id'] = reporte_estado['id']
			shortened_reporte['estado'] = reporte_estado['estado__nombreEstado']
			shortened_reporte['carencia'] = reporte_estado['meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
			shortened_reporte['montoPromedio'] = reporte_estado['meta__montoPromedio']
			shortened_reporte['inversion_aproximada'] = shortened_reporte['avance'] * reporte_estado['meta__montoPromedio']
			json_map['reporte_por_estado'].append(shortened_reporte)



        output = StringIO.StringIO()
        prs = Presentation()
        slide = prs.slides.add_slide(prs.slide_layouts[5])
        shapes = slide.shapes
        shapes.title.text = 'Reporte'

        #renglones = resultados['reporte_general']['visitas_totales'] + 1
        renglones = len(json_map['reporte_por_estado'])
        if renglones < 22:
            rows = renglones+1
        else:
            rows = 22
        cols = 4
        left = Inches(0.921)
        top = Inches(1.2)
        width = Inches(6.0)
        height = Inches(0.8)

        table = shapes.add_table(rows, cols, left, top, width, height).table

        # set column widths
        table.columns[0].width = Inches(1.1)
        table.columns[1].width = Inches(2.0)
        table.columns[2].width = Inches(2.0)
        table.columns[3].width = Inches(2.0)


        # write column headings
        table.cell(0, 0).text = 'Carencia'
        table.cell(0, 1).text = 'Estado'
        table.cell(0, 2).text = 'Avance Total'
        table.cell(0, 3).text = 'Inversion Aprox.'


        # write body cells
        indice = 1
        for avance in json_map['reporte_por_estado']:

            if indice == 22:
                indice = 1
                slide = prs.slides.add_slide(prs.slide_layouts[5])
                shapes = slide.shapes
                shapes.title.text = 'Reporte'

                rows = 22
                cols = 4
                left = Inches(0.921)
                top = Inches(1.2)
                width = Inches(6.0)
                height = Inches(0.8)

                table = shapes.add_table(rows, cols, left, top, width, height).table
                # set column widths
                table.columns[0].width = Inches(1.1)
                table.columns[1].width = Inches(2.0)
                table.columns[2].width = Inches(2.0)
                table.columns[3].width = Inches(2.0)


            # write column headings
            for x in range(0, 4):
                cell = table.rows[0].cells[x]
                paragraph = cell.textframe.paragraphs[0]
                paragraph.font.size = Pt(12)
                paragraph.font.name = 'Arial Black'
                paragraph.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

            for x in range(0, 4):
                cell = table.rows[indice].cells[x]
                paragraph = cell.textframe.paragraphs[0]
                paragraph.font.size = Pt(8)
                paragraph.font.name = 'Arial'
                paragraph.font.color.rgb = RGBColor(0x0B, 0x0B, 0x0B)

           	table.cell(0, 0).text = 'Carencia'
        	table.cell(0, 1).text = 'Estado'
        	table.cell(0, 2).text = 'Avance Total'
        	table.cell(0, 3).text = 'Inversion Aprox.'

            # write body cells
            table.cell(indice, 0).text = avance['carencia']
            table.cell(indice, 1).text = avance['estado']
            table.cell(indice, 2).text = str(avance['avance'])
            table.cell(indice, 3).text = str(avance['inversion_aproximada'])
            indice += 1

        prs.save(output)
        response = StreamingHttpResponse(FileWrapper(output),
                                         content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation')
        response['Content-Disposition'] = 'attachment; filename="Reporte.pptx"'
        response['Content-Length'] = output.tell()

        output.seek(0)

        return response

