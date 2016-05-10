/**
 * Created by mng687 on 9/1/15.
 * This script will handle all if the dynamic filtering
 * required for the municipios field in the Obra form
 *
 * We are using ajax to call the municipios_for_estado_endpoint
 */
var $j = jQuery.noConflict();

$j(document).on('ready', function() {
    /*
        Only do the cleanup if the field didn't contain a value already
        this is used for the edit form
     */

    var estadoId = $('#id_estado').find('option:selected').val();
    var municipioId = $j('.tamcontrolsel').find('option:selected').val();
    var munlenght = $j('.tamcontrolsel').length;
    alert("municipioID "+$j('.tamcontrolsel').length);

    var arrmun;

    for(i=0;i<$j('.tamcontrolsel').length-1;i++)
    {
        alert($j('.tamcontrolsel')[i].value);
        $j("select#id_avancemensual_set-"+i+"-municipio").attr('disabled','disabled');
          arrmun =$j('.tamcontrolsel')[i];
    }

    if ( municipioId == "" && munlenght ==0 ) {
        clearMunicipios();
        alert("no municipios previos")
    }
    else {
        // No need to check for nulls here, wel already did in the first if
        if (estadoId != "") {
             //obtiene municipios
            alert("si municipios previos")
            getMunicipiosForEstado(estadoId, function (ans) {
                populateMunicpiosSelect(ans,arrmun);

            });

        }
    }



    // I know, I'm calling this again, I'll get around to fixingt it
    $('#id_estado').on('change', function() {
        var option = $(this).find('option:selected');

        if (option != null) {
            var estadoId = option.val();
            if (estadoId == "") {
                clearMunicipios();

            }
            else {
                getMunicipiosForEstado(parseInt(estadoId), function (ans) {
                    populateMunicpiosSelect(ans,arrmun);
                });

            }
        }
    });

    $j("tr.add-row").on("click",function(){
        getMunicipiosForEstado(parseInt(estadoId), function (ans) {
                    populateMunicpiosSelect2(ans,arrmun);
                });
    });


});

// PARA CARGA DE MUNICIPIO POR ESTADO SELECCIONADO
function getMunicipiosForEstado(estadoId, onSuccess) {
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
        var ajaxData = { access_token: ans.access_token, estados: estadoId };

        $j.ajax({
            url: '/issste/api/municipios_por_estado',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}


// Once we're done filtering, we just put the results where they belong
function populateMunicpiosSelect(municipios,arrmun) {
    // Clean the field
    //clearMunicipios();

    for (var i = 0; i < municipios.length; i++) {

       $j(".tamcontrolsel").append(
            '<option value="'+municipios[i].id+'">' +
            municipios[i].nombreMunicipio +
            '</option>'
        );
    }
}


/*
    Doesn't really clear the field
    it keeps the default option
*/
function clearMunicipios() {


    $j('.tamcontrolsel')
        .empty()
        .append('<option value>---------</option>');
}



function populateMunicpiosSelect2(municipios,munlenght) {
    // Clean the field
    clearMunicipios2(munlenght-1);

    for (var i = 0; i < municipios.length; i++) {

       $j("select#id_avancemensual_set-"+(munlenght-1)+"-municipio").append(
            '<option value="'+municipios[i].id+'">' +
            municipios[i].nombreMunicipio +
            '</option>'
        );
    }
    for (var i = 0; i < munlenght.length; i++)
    $("select#id_detalleclasificacion_set-"+(munlenght-1)+"-tipoClasificacion").find("option[value='"+munlenght[i].value+"']").hide();
}

function clearMunicipios2(munlenght) {


    $j("select#id_avancemensual_set-"+munlenght+"-municipio")
        .empty()
        .append('<option value>---------</option>');
}
