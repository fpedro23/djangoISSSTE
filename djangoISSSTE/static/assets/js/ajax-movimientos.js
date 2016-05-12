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

    $j('#historialBTN').on('click', verHistoria);
	$j('#buscarICO').on('click', verDatos);
    $j('#imprimirBTN').on('click', imprimeFicha);

    $.get("/register-by-token", function(respu) {
        newToken=respu.access_token;
    });

}

function imprimeFicha(){
    if ($j('#idvisitaUNICO').val() != null && $j('#idvisitaUNICO').val() !="")
    {
        location.href="/visitas/ficha?identificador_unico="+ $j.trim($j('#idvisitaUNICO').val().toString());
    };

}


function verDatos() {
    var idUnico = $j("#idvisita").val();

    if (idUnico.toString() != "") {
        $.get('/visitas/register-by-token', function (ans) {
            // TODO: add a failure function
            var ajax_data = {access_token: ans.access_token, identificador_unico: idUnico.toString()};

            $j.ajax({
                url: '/api/id_unico',
                type: 'get',
                data: ajax_data,
                success: function (data) {
                    if (data.visita != null && data.error == null) {
                        location.href = '/admin/visitas_stg/visita/' + data.visita.id + '/?m=1';
                    }
                    else {
                        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA">'
                                + '<div class="textoALERTA">'
                                + data.error
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
                    }

                },
                error: function (data) {
                    alert('error!! ' + data.status);
                }
            });
        });
    }
    else {
         $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA">'
                                + '<div class="textoALERTA">'
                                + "Debe capturar un ID de Visita."
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
    }
};

function verHistoria() {
    var idUnicoH = $j("#idvisitaUNICO").val();
    var idUnicoHist = idUnicoH.trim();

    var ajax_data = {
      "access_token"  : newToken
    };


    if(idUnicoHist.toString()!=""){ajax_data.identificador_unico=idUnicoHist.toString();}


    $j.ajax({
        url: '/api/id_unico',
        type: 'get',
        data: ajax_data,
        success: function(data) {


            if (data.visita!=null){location.href='/admin/visitas_stg/visita/'+data.visita.id+'/history';
            }
            else {
                //alert('No existen registros con el ID Único ' + idUnico);
                    $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA">'
                                  + '<div class="textoALERTA">'
                                  + 'No existe historial del ID Único: ' + idUnicoHist
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
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
            }

        },
        error: function(data) {
            alert('error!! ' + data.status);
        }
    });

};


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

    /*$j('#id_meta').bind('change', function () {
        var meta = $(this).val();
        var periodo = $('#id_periodo').find('option:selected').val();
        var valor = $('#id_estado').find('option:selected').val();
         alert('META: '+ valor+','+ periodo+','+meta);
        if (valor != null &&  periodo != null && meta != null) {
            getAvanceForPeriodo(valor,periodo,meta, function (ans) {
            });
        }
    });*/


});

// PARA CARGA DE DISTRITO ELECTORAL DEPENDIENDO DE ESTADO SELECCIONADO
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
