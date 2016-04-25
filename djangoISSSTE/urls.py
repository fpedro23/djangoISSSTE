from django.conf.urls import url, include
from djangoISSSTE import api


urlpatterns = [
	url(r'^api/estados$', api.EstadosEndpoint.as_view()),
	url(r'^api/municipios_por_estado', api.MunicipiosForEstadosEndpoint.as_view()),
	url(r'^api/periodos$', api.PeriodosEndpoint.as_view()),
	url(r'^api/meses$', api.MesesEndpoint.as_view()),
	url(r'^api/metas$', api.MetasEndpoint.as_view()),
	url(r'^api/metasMensualesPorMeta', api.MetasMensualesPorMetaEndpoint.as_view()),
	url(r'^api/avancesMensualesPorMeta', api.avancesMensualesPorMetaEndpoint.as_view()),

 ]