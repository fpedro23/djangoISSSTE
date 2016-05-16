var $j = jQuery.noConflict();
$j(document).on('ready', main_consulta);

var datosJson;
var newToken;

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

    $j('.imprimirBTN').on('click', imprimeFicha);

    $.get("/register-by-token", function(respu) {
        newToken=respu.access_token;
    });

}

function imprimeFicha(){
    var periodo = $('#id_periodo').find('option:selected').val();
    var meta = $('#id_meta').find('option:selected').val();
    var estado = $('#id_estado').find('option:selected').val();
    var URL ="";

    if (periodo != "" && meta != "" && estado != "")
    {
        URL = "/issste/api/fichaAvances?access_token=" + newToken;
        URL = URL + "&periodo="+periodo;
        URL = URL + "&accion="+meta;
        URL = URL + "&estado="+estado;
        location.href=URL;

    }
    else{
        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA">'
                                + '<div class="textoALERTA">'
                                + 'Seleccione el Año, Acción Estratégica y Estado <br> para imprimir la Ficha de Avances'
                                + '</div>'
                                + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN"> </div></a>'
                                + '</div>'
                            },
                            type: 'inline',
                            preloader: true,
                            modal: true
                        });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                            e.preventDefault();
                            $j.magnificPopup.close();
                        });
    };
}


$j(function() {
    $j('#id_estado').bind('change', function () {
        var valor = $(this).val();
        var periodo = $('#id_periodo').find('option:selected').val();
        var meta = $('#id_meta').find('option:selected').val();
       // alert('ESTADO: '+valor+', '+ periodo+', '+meta);
        if (valor != null &&  periodo != null && meta != null) {
            getAvanceForPeriodo(valor,periodo,meta, function (ans) {
            });
        }
    });

    // $j('#id_meta').bind('change', function () {
    //     var meta = $(this).val();
    //     var periodo = $('#id_periodo').find('option:selected').val();
    //     var valor = $('#id_estado').find('option:selected').val();
    //      alert('META: '+ valor+','+ periodo+','+meta);
    //     if (valor != null &&  periodo != null && meta != null) {
    //         getAvanceForPeriodo(valor,periodo,meta, function (ans) {
    //         });
    //     }
    // });


});

// PARA CARGA DE Avance DEPENDIENDO DE ESTADO SELECCIONADO
function getAvanceForPeriodo(estadoId,anioid,metaid,onSuccess) {
    // Setup CSRF tokens and all that good stuff so we don't get hacked
    $j.ajaxSetup(
        {
            beforeSend: function(xhr, settings) {
                if(settings.type == "POST")
                    xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                if(settings.type == "GET")
                    xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
            }
        }
    );

    // Get an Oauth2 access token and then do the ajax call, because SECURITY
    $.get('/register-by-token', function(ans) {
        // TODO: add a failure function
        var ajaxData = { access_token: ans.access_token, periodo:(anioid).toString(),accion:(metaid).toString(), estado: estadoId.toString() };

        $j.ajax({
            url: '/issste/api/avancePorPeriodo',
            type: 'get',
            data: ajaxData,
            success: function(data) {
                location.href="/admin/djangoISSSTE/avancepormunicipio/"+data[0].id+"/change";
            },
        error: function(data) {
            //alert('error!! ' + data.status);
        }
        });

    });
}
