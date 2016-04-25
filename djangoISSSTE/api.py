# coding=utf-8
import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views import generic
from oauth2_provider.views.generic import ProtectedResourceView

from djangoISSSTE.models import *


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