# coding=utf-8
import json
from _ast import List

from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import HttpResponse
from django.views import generic
from django.views.generic.list import ListView
from oauth2_provider.models import AccessToken

from djangoISSSTE.BuscarAvances import BuscarAvances
from oauth2_provider.views.generic import ProtectedResourceView
from django.core.serializers.json import DjangoJSONEncoder

from djangoISSSTE.models import *


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
                       ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


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

        return HttpResponse(
            json.dumps(the_list, ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


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

        return HttpResponse(
        json.dumps(the_list, ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
        'application/json', )


# Api para regresar todos los responsables dados de alta
class ResponsablesEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda responsable: responsable.to_serializable_dict(), Responsable.objects.all())),
                       ensure_ascii=False, indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


# Clase EndPoint (oauth2) para devolver los estados
class EstadosEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        usuario = AccessToken.objects.get(token=request.GET.get('access_token')).user.usuario
        if usuario.rol == "FE" or usuario.rol == "UE":
            return HttpResponse(
                json.dumps((map(lambda estado: estado.to_serializable_dict(),
                                Estado.objects.filter(id=usuario.estado_id))), ensure_ascii=False, indent=4,
                           separators=(',', ': '), sort_keys=True, ), 'application/json')

        return HttpResponse(
            json.dumps((map(lambda estado: estado.to_serializable_dict(), Estado.objects.all())),
                       ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ),
            'application/json', )


# Clase EndPoint (oauth2) para devolver los municipios, dado un estado
class MunicipiosForEstadosEndpoint(ProtectedResourceView):
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
class PeriodosEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda periodo: periodo.to_serializable_dict(), Periodo.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


# Clase EndPoint (oauth2) para devolver los mese
class MesesEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda mes: mes.to_serializable_dict(), Mes.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


# Clase EndPoint (oauth2) para devolver las metas
class MetasEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            json.dumps((map(lambda meta: meta.to_serializable_dict(), Meta.objects.all())), ensure_ascii=False,
                       indent=4, separators=(',', ': '), sort_keys=True, ), 'application/json')


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

            metas_mensuales = MetaMensual.objects.filter(meta_id__in=arreglo_meta, estado_id__in=estado_ids)

        the_list = []
        for meta_mensual in metas_mensuales.values():
            the_list.append(meta_mensual)

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                        'application/json', )  # Clase EndPoint (oauth2) para devolver los avances mensuales dada una acción


# Clase EndPoint (oauth2) para devolver los avances mensuales dada una acción
class AvancesMensualesPorAccionEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
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

        return HttpResponse(json.dumps(the_list, indent=4, sort_keys=True, ensure_ascii=False, cls=DjangoJSONEncoder),
                        'application/json', )  # Clase EndPoint (oauth2) para devolver las metas mensuales dada una meta
class MetasMensualesPorMetaEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
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
    def get(self, request, *args, **kwargs):
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
                print arreglo_avance_municipio

            avances_mensuales = AvanceMensual.objects.filter(avancePorMunicipio__id__in=arreglo_avance_municipio)

        the_list = []
        for avance_mensual in avances_mensuales.values():
            the_list.append(avance_mensual)

        return HttpResponse(json.dumps(the_list, indent=4, sort_keys=True, ensure_ascii=False, cls=DjangoJSONEncoder),
                            'application/json', )


# Clase EndPoint (oauth2) para implementar el buscador en base al filtro grande
class BuscadorEndpoint(ProtectedResourceView):
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
            limite_inferior=request.GET.get('limiteInferior'),
            limite_superior=request.GET.get('limiteSuperior')
        )

        resultados = myObj.buscar()
        json_map = {}
        json_map['reporte_general'] = []  # Entrega avances mensuales con la información solicitada
        json_map['reporte_por_estado'] = []  # Entrega avances mensuales por estado

        for reporte in resultados['reporte_general']:
            shortened_reporte = {}
            add = True

            shortened_reporte['suma_avance'] = 0  # Utilizado para mejorar el aspecto de las llaves del json
            avance_mensual = AvanceMensual.objects.get(id=reporte['id'])
            if myObj.meses is not None:
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

                shortened_reporte[
                    'suma_avance'] += avance_mensual.ene + avance_mensual.feb + avance_mensual.mar + avance_mensual.abr
                shortened_reporte[
                    'suma_avance'] += avance_mensual.may + avance_mensual.jun + avance_mensual.jul + avance_mensual.ago
                shortened_reporte[
                    'suma_avance'] += avance_mensual.sep + avance_mensual.oct + avance_mensual.nov + avance_mensual.dic
            shortened_reporte['id'] = reporte['id']
            shortened_reporte['accion'] = reporte['avancePorMunicipio__meta__accionEstrategica__nombreAccion']
            shortened_reporte['carencia'] = reporte[
                'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
            shortened_reporte['subCarencia'] = reporte[
                'avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia']
            shortened_reporte['estado'] = reporte['avancePorMunicipio__estado__nombreEstado']
            shortened_reporte['municipio'] = reporte['municipio__nombreMunicipio']
            shortened_reporte['periodo'] = reporte['avancePorMunicipio__periodo__nombrePeriodo']
            shortened_reporte['latitud'] = reporte['municipio__latitud']
            shortened_reporte['longitud'] = reporte['municipio__longitud']

            # Validando que la suma de los avances se encuentre dentro del rango solicitado
            if myObj.avance_minimo is not None and myObj.avance_maximo is not None:
                if shortened_reporte['suma_avance'] < myObj.avance_minimo[0] or shortened_reporte['suma_avance'] > \
                        myObj.avance_maximo[0]:
                    add = False

            # Si existieron los límites del avance y se estuvo dentro de ellos, se añade
            if add == True:
                json_map['reporte_general'].append(shortened_reporte)

        for reporte_estado in resultados['reporte_por_estado']:
            add = True
            shortened_reporte = {}
            shortened_reporte['avance'] = 0
            if myObj.meses is not None:
                for mes in myObj.meses:
                    if mes == 1: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ene'))[
                        'ene__sum']
                    if mes == 2: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('feb'))[
                        'feb__sum']
                    if mes == 3: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('mar'))[
                        'mar__sum']
                    if mes == 4: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('abr'))[
                        'abr__sum']
                    if mes == 5: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('may'))[
                        'may__sum']
                    if mes == 6: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jun'))[
                        'jun__sum']
                    if mes == 7: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jul'))[
                        'jul__sum']
                    if mes == 8: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ago'))[
                        'ago__sum']
                    if mes == 9: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('sep'))[
                        'sep__sum']
                    if mes == 10: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('oct'))[
                        'oct__sum']
                    if mes == 11: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('nov'))[
                        'nov__sum']
                    if mes == 12: shortened_reporte['avance'] += \
                    AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('dic'))[
                        'dic__sum']
            else:
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ene'))['ene__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('feb'))['feb__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('mar'))['mar__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('abr'))['abr__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('may'))['may__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jun'))['jun__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('jul'))['jul__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('ago'))['ago__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('sep'))['sep__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('oct'))['oct__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('nov'))['nov__sum']
                shortened_reporte['avance'] += \
                AvanceMensual.objects.filter(avancePorMunicipio=reporte_estado['id']).aggregate(Sum('dic'))['dic__sum']

            shortened_reporte['id'] = reporte_estado['id']
            shortened_reporte['estado'] = reporte_estado['estado__nombreEstado']
            shortened_reporte['carencia'] = reporte_estado[
                'meta__accionEstrategica__subCarencia__carencia__nombreCarencia']
            shortened_reporte['montoPromedio'] = reporte_estado['meta__montoPromedio']
            shortened_reporte['inversion_aproximada'] = shortened_reporte['avance'] * reporte_estado[
                'meta__montoPromedio']

            # Validando que la suma de los avances se encuentre dentro del rango solicitado
            if myObj.avance_minimo is not None and myObj.avance_maximo is not None:
                if shortened_reporte['avance'] < myObj.avance_minimo[0] or shortened_reporte['avance'] > \
                        myObj.avance_maximo[0]:
                    add = False

            # Si existieron los límites del avance y se estuvo dentro de ellos, se añade
            if add == True:
                json_map['reporte_por_estado'].append(shortened_reporte)

        return HttpResponse(json.dumps(json_map, indent=6, sort_keys=True, ensure_ascii=False),
                        'application/json', )


#Clase EndPoint (oauth2) para implementar la captra de avances, recibe un perdiodo, accion y un estado y devuelve el id del avance
class AvanceForPeriodo(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        # Obteniendo los datos de la url
        periodo_id = get_array_or_none(request.GET.get('periodo'))
        accion_id = get_array_or_none(request.GET.get('accion'))
        estados_id = get_array_or_none(request.GET.get('estado'))
        arreglo_avance_municipio = []

        for avanceMunicipio in AvancePorMunicipio.objects.filter(periodo__in=periodo_id):
            arreglo_avance_municipio.append(avanceMunicipio.id)
            print arreglo_avance_municipio

        avances = AvancePorMunicipio.objects.filter(id__in=arreglo_avance_municipio, meta__accionEstrategica_id__in=accion_id, estado_id__in = estados_id)
        print avances.values()

        the_list = []
        for avance in avances.values('id'):
            the_list.append(avance)

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


class ExcelAvancesEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        # Obteniendo los datos de la url
        periodo_id = get_array_or_none(request.GET.get('periodos'))

        if periodo_id is None:
            avances_mensuales = AvanceMensual.objects.all()
        else:
            avances_mensuales = AvanceMensual.objects.filter(avancePorMunicipio__periodo_id__in=periodo_id).all()

        the_list = []

        for avance_mensual in avances_mensuales.values('avancePorMunicipio__periodo__nombrePeriodo',
                                                       'municipio__nombreMunicipio', 'ene',
                                                       'feb', 'mar', 'abr', 'may', 'jun',
                                                       'jul', 'ago', 'sep', 'oct', 'nov',
                                                       'dic',
                                                       'avancePorMunicipio__periodo__nombrePeriodo',
                                                       'avancePorMunicipio__inversionAprox',
                                                       'avancePorMunicipio__meta__accionEstrategica__nombreAccion',
                                                       'avancePorMunicipio__meta__accionEstrategica__unidadDeMedida',
                                                       'avancePorMunicipio__meta__accionEstrategica__subCarencia__nombreSubCarencia',
                                                       'avancePorMunicipio__meta__accionEstrategica__subCarencia__carencia__nombreCarencia'):
            the_list.append(avance_mensual)

        return HttpResponse(json.dumps(the_list, indent=4, separators=(',', ': '), sort_keys=True, ensure_ascii=False),
                            'application/json', )


class ExcelMetasEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        # Obteniendo los datos de la url
        periodo_id = get_array_or_none(request.GET.get('periodo'))

        if periodo_id is None:
            metas_mensuales = MetaMensual.objects.all()
        else:
            metas_mensuales = MetaMensual.objects.filter(meta__periodo_id__in=periodo_id).all()

        the_list = []
        for meta_mensual in metas_mensuales.values('meta__periodo__nombrePeriodo', 'estado__nombreEstado', 'ene',
                                                   'feb', 'mar', 'abr', 'may', 'jun',
                                                   'jul', 'ago', 'sep', 'oct', 'nov',
                                                   'dic',
                                                   'inversionAprox',
                                                   'meta__accionEstrategica__nombreAccion',
                                                   'meta__accionEstrategica__unidadDeMedida',
                                                   'meta__accionEstrategica__subCarencia__nombreSubCarencia',
                                                   'meta__accionEstrategica__subCarencia__carencia__nombreCarencia'):
            the_list.append(meta_mensual)

        return HttpResponse(json.dumps(the_list, indent=4, sort_keys=True, ensure_ascii=False),
                            'application/json', )
