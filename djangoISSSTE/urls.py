from django.conf.urls import url, include
from djangoISSSTE import api

urlpatterns = [
    url(r'^api/estados$', api.EstadosEndpoint.as_view()),
    url(r'^api/municipios_por_estado', api.MunicipiosForEstadosEndpoint.as_view()),
    url(r'^api/carencias', api.CarenciasEndpoint.as_view()),
    url(r'^api/subcarencias_por_carencia', api.SubcarenciasForCarenciasEndpoint.as_view()),
    url(r'^api/acciones_por_subcarencia', api.AccionesForSubCarenciasEndpoint.as_view()),
    url(r'^api/responsables', api.ResponsablesEndpoint.as_view()),
    url(r'^api/periodos$', api.PeriodosEndpoint.as_view()),
    url(r'^api/meses$', api.MesesEndpoint.as_view()),
    url(r'^api/metas$', api.MetasEndpoint.as_view()),
    url(r'^api/metasMensualesPorAccion', api.MetasMensualesPorAccionEndpoint.as_view()),
    url(r'^api/avancesMensualesPorAccion', api.AvancesMensualesPorAccionEndpoint.as_view()),
    url(r'^api/metasMensualesPorMeta', api.MetasMensualesPorMetaEndpoint.as_view()),
    url(r'^api/avancesMensualesPorMeta', api.avancesMensualesPorMetaEndpoint.as_view()),
    url(r'^api/busqueda', api.BuscadorEndpoint.as_view()),
    url(r'^api/avancePorPeriodo', api.AvanceForPeriodoEndpoint.as_view()),
    url(r'^api/avances', api.AvancesEndpoint.as_view()),
	url(r'^api/ResultadosPptx', api.ResultadosPptxEndpoint.as_view()),
	url(r'^api/ReportePptx', api.ReportePptxEndpoint.as_view()),
    url(r'^api/avancePorPeriodo', api.AvanceForPeriodo.as_view()),


    # url(r'^api/hora_ultima_actualizacion', api.HoraUltimaActualizacion.as_view()),
]
