/**
 * Created by usuario on 30/04/2015.
 */
/**
 * Created by db2 on 7/04/15.
 */
var $j = jQuery.noConflict();

$j(document).on('ready', main_consulta);

var datosJson;
var newToken;
var cualPpxt = 0;


function valida_token(){
var ajax_datatoken = {
      "access_token"  : 'O9BfPpYQuu6a5ar4rGTd2dRdaYimVa'
    };


    $j.ajax({
        url: '/visitas/register-by-token',
        type: 'get',
        data: ajax_datatoken,
        success: function(data) {
            newToken = data.access_token;
            //alert(data.access_token);
        },
        error: function(data) {
            alert('error!!! ' + data.status);
        }
    });
}


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

    valida_token();
    $j('#verRegion').on('click', ver_regiones);
    $j('#verEstado').on('click', ver_estados);
    $j('#verDependencia').on('click', ver_dependencias);
    $j('#consultarRegiones #listaRegiones').on('click', reporte_region);
    $j('#consultarEstados #listaEstados').on('click', reporte_estado);
    $j('#consultarDependencias #listaDependencias').on('click', reporte_dependencia);


}


function ver_regiones() {
    $j('#Dependencias').addClass("mfp-hide");
    $j('#Estados').addClass("mfp-hide");
    $j('#Regiones').removeClass("mfp-hide");
    $j('#Regiones').addClass("mfp-show");
}

function ver_estados() {
    $j('#Dependencias').addClass("mfp-hide");
    $j('#Regiones').addClass("mfp-hide");
    $j('#Estados').removeClass("mfp-hide");
    $j('#Estados').addClass("mfp-show");
}

function ver_dependencias() {
    $j('#Estados').addClass("mfp-hide");
    $j('#Regiones').addClass("mfp-hide");
    $j('#Dependencias').removeClass("mfp-hide");
    $j('#Dependencias').addClass("mfp-show");
}

function reporte_region() {
    var $E = jQuery.noConflict();
    var estado_id = $E("#msRegiones").val();

    var URL="/visitas/Predefinido_Region?region_id=" + estado_id;
    location.href = URL;

}

function reporte_estado() {
    var $E = jQuery.noConflict();
    var estado_id = $E("#msEstados").val();

    var URL="/visitas/Predefinido_Estado?estado_id=" + estado_id;
    location.href = URL;

}

function reporte_dependencia() {
    var $E = jQuery.noConflict();
    var dependencia_id = $E("#msDependencias").val();

    var URL="/visitas/Predefinido_Dependencia?dependencia_id=" + dependencia_id;
    location.href = URL;

}