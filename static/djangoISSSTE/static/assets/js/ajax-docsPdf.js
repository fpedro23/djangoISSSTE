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

    $j('#crearVisita').on('click', crear_visita);
    $j('#modificarVisita').on('click', modificar_visita);

    $j('#consultaFiltros').on('click', consulta_filtros);
    $j('#consultaPredefinidos').on('click', consulta_predefinida);
    $j('#listadoVisitas').on('click', lista_visita);
    $j('#catalogoFuncionarios').on('click', funcionarios);
    $j('#catalogoMedios').on('click', medios);
    $j('#catalogoActividades').on('click', actividades);
    $j('#catalogoCapitalizaciones').on('click', capitalizaciones);
    $j('#catalogoUsuarios').on('click', usuarios);

}

function crear_visita(){
    verDocPdf('SISEF_ALTA_VISITA','Crear una visita');
}
function modificar_visita(){
    verDocPdf('SISEF_MODIFICAR_VISITA','Modificar una Obra');
}

function consulta_filtros(){
    verDocPdf('SISEF_CONSULTA_FILTROS','Consulta Mediante Filtros');
}
function consulta_predefinida(){
    verDocPdf('SISEF_CONSULTAS_PREDEFINIDAS','Consultas Predefinidas');
}
function lista_visita(){
    verDocPdf('SISEF_LISTADO_VISITAS','Listado de Obras');
}

function funcionarios(){
    verDocPdf('SISEF_CATALOGO_FUNCIONARIOS','Catálogo de Funcionarios');
}
function medios(){
    verDocPdf('SISEF_CATALOGO_MEDIOS','Catálogo de Medios');
}
function actividades(){
    verDocPdf('SISEF_CATALOGO_ACTIVIDADES','Catálogo de Actividades');
}
function capitalizaciones(){
    verDocPdf('SISEF_CATALOGO_CAPITALIZACIONES','Catálogo de Capitalizaciones');
}

function usuarios(){
    verDocPdf('SISEF_USUARIOS','Catálogo de Usuarios');
}


function verDocPdf(nombrePdf,titulo){


    $('#titulo').html(titulo);
    //$j('#descripcion').html(descripcion);
    $('#vistaPdf').html('<embed src="http://sisefenlinea.mx/media/tutorialesPDF/'+ nombrePdf +'.pdf" width="720" height="450">');


}