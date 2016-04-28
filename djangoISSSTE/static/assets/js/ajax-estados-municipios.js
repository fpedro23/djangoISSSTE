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
    var municipioId = $('#id_municipio').find('option:selected').val();

    if ( municipioId == "")
        clearMunicipios();
    else {
        // No need to check for nulls here, wel already did in the first if
        if (estadoId != "") {
            getMunicipiosForEstado(estadoId, function (ans) {
                populateMunicpiosSelect(ans);
                $('#id_municipio').val(municipioId);
            });
        }
    }

    if (estadoId != "") {
            getMunicipiosForEstado(estadoId, function (ans) {
                populateMunicpiosSelect(ans);
                $('#id_municipio').val(municipioId);
            });
     }

    // I know, I'm calling this again, I'll get around to fixingt it
    $('#id_estado').on('change', function() {
        var option = $(this).find('option:selected');

        if (option != null) {
            var estadoId = option.val();
            if (estadoId == "")
                clearMunicipios();
            else
                getMunicipiosForEstado(parseInt(estadoId), function(ans) {
                populateMunicpiosSelect(ans);
            });
        }
    });
});

// Does the actual filtering
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
    $.get('/obras/register-by-token', function(ans) {
        // TODO: add a failure function
        var ajaxData = { access_token: ans.access_token, estados: estadoId };

        $j.ajax({
            url: '/obras/api/municipios_por_estado',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}

// Once we're done filtering, we just put the results where they belong
function populateMunicpiosSelect(municipios) {
    // Clean the field
    clearMunicipios();

    for (var i = 0; i < municipios.length; i++) {
        $j('#id_municipio').append(
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
    $j('#id_municipio')
        .empty()
        .append('<option value>---------</option>');
}
