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

    $j('#crearObra').on('click', crear_obra)
    $j('#modificarObra').on('click', modificar_obra)
    $j('#agregarClasificacion').on('click', agregar_clasificacion)
    $j('#buscarClasificacion').on('click', buscar_clasificacion)


}

function crear_obra(){
    $j('#titulo').html('Crear una Obra');
    //verVideo('creacionObra.mp4','Crear una Obra');
}
function modificar_obra(){
    verVideo('modificacionObra.mp4','Modificar una Obra');
}
function agregar_clasificacion(){
    verVideo('agregarClasificacion.mp4','Agregar una Clasificación');
}
function buscar_clasificacion(){
    verVideo('buscarClasificacion.mp4','Buscar una Clasificación');
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