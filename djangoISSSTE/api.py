# coding=utf-8
import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views import generic
from oauth2_provider.views.generic import ProtectedResourceView

from djangoISSSTE.models import *



class EstadosEndpoint(ProtectedResourceView):
	def get(self, request):
		return HttpResponse(json.dumps(map(lambda estado: estado.to_serializable_dict(), Estado.objects.all())),
							'application/json')

