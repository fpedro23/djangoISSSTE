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

    $j('#iciniosesion').on('click', inicio_sesion)
    $j('#registroavance').on('click', registro_avance)
    $j('#consfiltro').on('click', cons_filtro)
    $j('#conspredef').on('click', cons_predef)
    $j('#conslistado').on('click', cons_listado)
    $j('#altameta').on('click', alta_meta)
    $j('#modifmeta').on('click',modif_meta )
    $j('#bajameta').on('click',baja_meta )
    $j('#altausr').on('click',alta_usr )
    $j('#bajausr').on('click',baja_usr )

}

function inicio_sesion(){
    $j('#titulo').html('Inicio de Sesión');
    verVideo('1_1_iniciarSesion.mp4','Inicio de Sesión');
}

function registro_avance(){
    $j('#titulo').html('Registrar Avances');
    verVideo('2_1_AltaAvances.mp4','Registrar Avances');
}

function cons_filtro(){
    verVideo('3_1_consFiltros.mp4','Consulta Mediante Filtros');
}

function cons_predef(){
    verVideo('3_2_consPredef.mp4','Consulta Predefinidos');
}

function cons_listado(){
    verVideo('3_3_listadeAvances.mp4','Lista de Acciones');
}
function alta_meta(){
    verVideo('4_1_altaMeta.mp4','Registro de Metas');
}

function modif_meta(){
    verVideo('4_2_modifMeta.mp4','Modificar Metas');
}

function baja_meta(){
    verVideo('4_3_eliminarCatalogo.mp4','Eliminar Metas');
}

function verVideo(nombreVideo,titulo){



    var sHtml = ' <video id="example_video_1" class="video-js vjs-default-skin" controls preload="none" width="720" height="370"'
          +' poster=""'
          +'data-setup="{}">'
          +'      <source src="https://obrasapf.mx/media/tutoriales/' + nombreVideo + '" type="video/mp4" />'
        +'<track kind="captions" src="demo.captions.vtt"  srclang="es" label="Español"></track>'
        +'<track kind="subtitles" src="demo.captions.vtt" srclang="es" label="Español"></track>'
        +'<p class="vjs-no-js">Para ver el vídeo por favor habilite JavaScript y considere actualizar a un navegador web que <a href="http://videojs.com/html5-video-support/" target="_blank">soporte video en HTML5</a></p>'
        +'</video>'
        +' <script>'
        +'videojs.options.flash.swf = "video-js.swf";'
    +'</script>'
    +'<style type="text/css">'
    +'  .vjs-default-skin { color: #970b0b; }'
    +'  .vjs-default-skin .vjs-play-progress,'
    +'  .vjs-default-skin .vjs-volume-level { background-color: #0b7811 }'
    +'</style>';

    $('#titulo').html(titulo);
    //$j('#descripcion').html(descripcion);
    $('#vistaVideo').html(sHtml);


}