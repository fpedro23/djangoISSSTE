/**
 * Created by usuario on 30/04/2015.
 */
/**
 * Created by db2 on 7/04/15.
 */
var $j = jQuery.noConflict();

$j(document).on('ready', main_consulta);

function main_consulta() {
    $j.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if(settings.type == "POST"){
				xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
			}
            if(settings.type == "GET"){
				xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
			}
		}
	});

    $j('#crearObra').on('click', crear_obra);
    $j('#modificarObra').on('click', modificar_obra);

    $j('#consultaFiltros').on('click', consulta_filtros);
    $j('#consultaPredefinidos').on('click', consulta_predefinida);
    $j('#listadoObras').on('click', lista_obras);
    $j('#catalogoDependencias').on('click', dependencias);
    $j('#catalogoSubdependencias').on('click', subdependencias);
    $j('#catalogoClasificaciones').on('click', clasificacion);
    $j('#catalogoInversion').on('click', inversion);
    $j('#catalogoImpacto').on('click', impacto);
    $j('#catalogoInauguradores').on('click', inaugurador);
    $j('#catalogoUsuarios').on('click', usuarios);

}

function crear_obra(){
    verDocPdf('ManualAltaObra','Crear una Obra');
}
function modificar_obra(){
    verDocPdf('ManualModificarObra','Modificar una Obra');
}

function consulta_filtros(){
    verDocPdf('ManualConsultaMedianteFiltros','Consulta Mediante Filtros');
}
function consulta_predefinida(){
    verDocPdf('ManualConsultaPredefinida','Consultas Predefinidas');
}
function lista_obras(){
    verDocPdf('ManualListaObras','Listado de Obras');
}

function clasificacion(){
    verDocPdf('ManualCatalogoClasificacion','Catálogo de Clasificación');
}
function dependencias(){
    verDocPdf('ManualCatalogoDependencias','Catálogo de Dependencias');
}
function subdependencias(){
    verDocPdf('ManualCatalogoSubDependencias','Catálogo de Sub Dependencias');
}
function impacto(){
    verDocPdf('ManualCatalogoImpacto','Catálogo de Impactos');
}
function inaugurador(){
    verDocPdf('ManualCatalogoInauguradores','Catálogo de Inauguradores');
}
function usuarios(){
    verDocPdf('ManualUsuarios','Catálogo de Usuarios');
}
function inversion(){
    verDocPdf('ManualCatalogoInversion','Catálogo de tipos de Invesión');
}

function verDocPdf(nombrePdf,titulo){


    $('#titulo').html(titulo);
    //$j('#descripcion').html(descripcion);
    $('#vistaPdf').html('<embed src="https://obrasapf.mx/media/tutorialesPDF/'+ nombrePdf +'.pdf" width="720" height="375">');


}