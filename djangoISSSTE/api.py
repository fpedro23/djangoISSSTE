# coding=utf-8
import json
from _ast import List

from django.db.models import Q, Sum
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views import generic
from django.views.generic.list import ListView
from oauth2_provider.models import AccessToken

from djangoISSSTE.BuscarAvances import BuscarAvances
from oauth2_provider.views.generic import ProtectedResourceView

from djangoISSSTE.models import *


def get_array_or_none(the_string):
    if the_string is None:
        return None
    else:
        return map(int, the_string.split(','))


# Api para regresar todas las carencias
class CarenciasEndpoint(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda carencia: carencia.to_serializable_dict(), Carencia.objects.all())),
                       ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


# Api para regresar subcarencias pertenecientes a una carencia en especial
class SubcarenciasForCarenciasEndpoint(ListView):
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

        return HttpResponse(
            json.dumps(the_list, ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


class AccionesForSubCarenciasEndpoint(ListView):
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
            the_list.append(accion)

        return HttpResponse(
            json.dumps(the_list, ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


# Api para regresar todos los responsables dados de alta
class ResponsablesEndpoint(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda responsable: responsable.to_serializable_dict(), Responsable.objects.all())),
                       ensure_ascii=False, ),
            'application/json', )


# Clase EndPoint (oauth2) para devolver los estados
class EstadosEndpoint(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda estado: estado.to_serializable_dict(), Estado.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


# Clase EndPoint (oauth2) para devolver los municipios, dado un estado
class MunicipiosForEstadosEndpoint(ListView):
    def get(self, request, *args, **kwargs):
        # Obteniendo los datos de la url
        estado_ids = get_array_or_none(request.GET.get('estados'))
        all_estados = False

        # Si TRUE, no hubo estados estados en la url y se regresan
        # todos los municipios de la base de datos
        if estado_ids is None or 33 in estado_ids or 34 in estado_ids:
            municipios = Municipio.objects.order_by('nombreMunicipio').all()
        else:
            municipios = Municipio.objects.filter(estado_id__in=estado_ids).order_by('nombreMunicipio')
            municipios.order_by('nombreMunicipio')

        # Arreglo necesario para la conversión a json
        the_list = []
        for municipio in municipios.values('id', 'nombreMunicipio', 'latitud', 'longitud'):
            the_list.append(municipio)

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


# Clase EndPoint (oauth2) para devolver los periodos
class PeriodosEndpoint(ListView):
    def get(self, request):
        return HttpResponse(
            json.dumps((map(lambda periodo: periodo.to_serializable_dict(), Periodo.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


# Clase EndPoint (oauth2) para devolver los mese
class MesesEndpoint(ListView):
    def get(self, request):
        return HttpResponse(
            json.dumps((map(lambda mes: mes.to_serializable_dict(), Mes.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


# Clase EndPoint (oauth2) para devolver las metas
class MetasEndpoint(ListView):
    def get(self, request):
        return HttpResponse(
            json.dumps((map(lambda meta: meta.to_serializable_dict(), Meta.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


# Clase EndPoint (oauth2) para devolver las metas mensuales dada una acción
class MetasMensualesPorAccionEndpoint(ListView):
    def get(self, request):
        # Obteniendo los datos de la url
        periodos_ids = get_array_or_none(request.GET.get('periodos'))
        accion_ids = get_array_or_none(request.GET.get('acciones'))
        estado_ids = get_array_or_none(request.GET.get('estados'))

        query= Q()

        if periodos_ids is not None:
            query = query | Q(meta__periodo__id__in = periodos_ids)
            print query

        metas_mensuales= None

        if query is not None:
            metas_mensuales = MetaMensual.objects.filter(query)
            print 'metas' + metas_mensuales.__str__()

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

            metas_mensuales = MetaMensual.objects.filter(meta_id__in=arreglo_meta, estado_id__in=estado_ids,)

        the_list = []
        for meta_mensual in metas_mensuales.values():
            print "values metas" + metas_mensuales.values().__str__()
            the_list.append(meta_mensual)

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


# Clase EndPoint (oauth2) para devolver los avances mensuales dada una acción
class AvancesMensualesPorAccionEndpoint(ListView):
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

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


# Clase EndPoint (oauth2) para devolver las metas mensuales dada una meta
class MetasMensualesPorMetaEndpoint(ListView):
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

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


# Clase EndPoint (oauth2) para devolver los avances mensuales dada una meta
class avancesMensualesPorMetaEndpoint(ListView):
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

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


# class HoraUltimaActualizacion(ListView):
#     def get(self, request, *args, **kwargs):
#         the_list = []


# Clase EndPoint (oauth2) para implementar el buscador en base al filtro grande
class BuscadorEndpoint(generic.ListView):
    def get(self, request):
        myObj = BuscarAvances(
            carencias=get_array_or_none(request.GET.get('carencias')),
            subcarencias=get_array_or_none(request.GET.get('subcarencias')),
            acciones=get_array_or_none(request.GET.get('acciones')),
            estados=get_array_or_none(request.GET.get('estados')),
            municipios=get_array_or_none(request.GET.get('municipios')),
            periodos=get_array_or_none(request.GET.get('periodos')),
            meses=get_array_or_none(request.GET.get('meses')),
            observaciones=request.GET.get('observaciones'),
            avance_minimo=get_array_or_none(request.GET.get('avanceMinimo')),
            avance_maximo=get_array_or_none(request.GET.get('avanceMaximo')),
            inversion_minima=get_array_or_none(request.GET.get('inversionMinima')),
            inversion_maxima=get_array_or_none(request.GET.get('inversionMaxima')),
            unidad_de_medida=request.GET.get('unidadDeMedida'),
        )
        # user = AccessToken.objects.get(token=request.GET.get('access_token')).user
        resultados = myObj.buscar()

        json_map = {}
        json_map['reporte_general'] = []
        print resultados

        for reporte in resultados['reporte_general']:
            reporte['avance'] = 0
            avance_mensual = AvanceMensual.objects.get(id=reporte['id'])
            if myObj.meses is not None:
                for mes in myObj.meses:
                    if mes == 1: reporte['avance'] += avance_mensual.ene
                    if mes == 2: reporte['avance'] += avance_mensual.feb
                    if mes == 3: reporte['avance'] += avance_mensual.mar
                    if mes == 4: reporte['avance'] += avance_mensual.abr
                    if mes == 5: reporte['avance'] += avance_mensual.may
                    if mes == 6: reporte['avance'] += avance_mensual.jun
                    if mes == 7: reporte['avance'] += avance_mensual.jul
                    if mes == 8: reporte['avance'] += avance_mensual.ago
                    if mes == 9: reporte['avance'] += avance_mensual.sep
                    if mes == 10: reporte['avance'] += avance_mensual.oct
                    if mes == 11: reporte['avance'] += avance_mensual.nov
                    if mes == 12: reporte['avance'] += avance_mensual.dic
            else:
                reporte['avance'] += avance_mensual.ene + avance_mensual.feb + avance_mensual.mar + avance_mensual.abr
                reporte['avance'] += avance_mensual.may + avance_mensual.jun + avance_mensual.jul + avance_mensual.ago
                reporte['avance'] += avance_mensual.sep + avance_mensual.oct + avance_mensual.nov + avance_mensual.dic
            json_map['reporte_general'].append(reporte)

        return HttpResponse(json.dumps(json_map, indent=6, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )
