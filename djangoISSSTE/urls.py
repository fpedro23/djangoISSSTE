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
    url(r'^api/metasPorPeriodo$', api.MetasPorPeriodoEndpoint.as_view()),
	url(r'^api/metasMensualesPorAccion', api.MetasMensualesPorAccionEndpoint.as_view()),
	url(r'^api/avancesMensualesPorAccion', api.AvancesMensualesPorAccionEndpoint.as_view()),
	url(r'^api/metasMensualesPorMeta', api.MetasMensualesPorMetaEndpoint.as_view()),
	url(r'^api/avancesMensualesPorMeta', api.avancesMensualesPorMetaEndpoint.as_view()),
	url(r'^api/busqueda', api.BuscadorEndpoint.as_view()),
	url(r'^api/ResultadosPptx', api.ResultadosPptxEndpoint.as_view()),
	url(r'^api/ReportePptx', api.ReportePptxEndpoint.as_view()),
	url(r'^api/PD_AvancePorMunicipio', api.PD_AvancePorMunicipioEndpoint.as_view()),
	url(r'^api/PD_MetasSinAvances', api.PD_MetasSinAvancesEndpoint.as_view()),
    url(r'^api/estados$', api.EstadosEndpoint.as_view()),
    url(r'^api/municipios_por_estado', api.MunicipiosForEstadosEndpoint.as_view()),
    url(r'^api/carencias', api.CarenciasEndpoint.as_view()),
    url(r'^api/subcarencias_por_carencia', api.SubcarenciasForCarenciasEndpoint.as_view()),
    url(r'^api/acciones_por_subcarencia', api.AccionesForSubCarenciasEndpoint.as_view()),
    url(r'^api/responsables', api.ResponsablesEndpoint.as_view()),
    url(r'^api/periodos$', api.PeriodosEndpoint.as_view()),
    url(r'^api/meses$', api.MesesEndpoint.as_view()),
    url(r'^api/metas$', api.MetasEndpoint.as_view()),
    url(r'^api/metasPorPeriodo$', api.MetasPorPeriodoEndpoint.as_view()),
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
    url(r'^api/fichaAvances', api.FichaTecnicaAvancesEndpoint.as_view()),
    url(r'^api/reporteExcelAvances', api.ReporteExcelAvancesEndpoint.as_view()),
    url(r'^api/reporteExcelMetas', api.ReporteExcelMetasEndpoint.as_view()),
    url(r'^api/balanceGeneral', api.BalanceGeneralEndpoint.as_view()),
	url(r'^api/balancePorEntidad', api.BalancePorEntidadEndpoint.as_view()),
	url(r'^api/informacionGeneral', api.InformacionGeneralEndpoint.as_view()),
	url(r'^api/reporteAvancesPeriodo', api.AvancesPorPeriodoEndPoint.as_view()),
	url(r'^api/fichaTecnicaiPad', api.FichaTecnicaForiPadAvancesEndpoint.as_view()),
	url(r'^api/presentacionAvances', api.PresentacioneAvancesEndPoint.as_view()),

	url(r'^api/fecha_ultima_actualizacion', api.FechaUltimaActualizacionEndpoint.as_view()),

	url(r'^api/AvancePorMunicipioPptx', api.AvancePorMunicipioPptxEndpoint.as_view()),
	url(r'^api/MetasSinAvancePptx', api.MetasSinAvancesPptxEndpoint.as_view()),
	url(r'^api/AvancesSinActividadPptx', api.AvancesSinActividadEndpoint.as_view()),


]
