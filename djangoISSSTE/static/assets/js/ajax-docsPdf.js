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

    $j('#registroavances').on('click', registro_avances);
    $j('#consultaFiltros').on('click', consulta_filtros);
    $j('#consultaPredefinidos').on('click', consulta_predefinida);
    $j('#listadoAcciones').on('click', lista_acciones);
    $j('#catalogoMetas').on('click', metas);
    $j('#catalogoUsuarios').on('click', usuarios);

}

function registro_avances(){
    verDocPdf('movimientos','Registrar Avances');
}


function consulta_filtros(){
    verDocPdf('consultasfiltros','Consulta Mediante Filtros');
}
function consulta_predefinida(){
    verDocPdf('consultaspredefinidas','Consultas Predefinidas');
}
function lista_acciones(){
    verDocPdf('listadeavances','Listado de Acciones');
}


function metas(){
    verDocPdf('catalogometa','Catálogo de Metas');
}


function usuarios(){
    verDocPdf('usuarios','Catálogo de Usuarios');
}

function verDocPdf(nombrePdf,titulo){


    $('#titulo').html(titulo);
    //$j('#descripcion').html(descripcion);
    $('#vistaPdf').html('<embed src="/issste/media/tutorialesPDF/'+ nombrePdf +'.pdf" width="720" height="450">');


}