/**
 * ajax  Dependencia cargo nombre
 */
var $j = jQuery.noConflict();

$j(document).on('ready', function() {


    var dependenciaId = $('#id_dependencia').find('option:selected').val();
    var cargoId = $('#id_cargo').find('option:selected').val();
    var nombreId = $('#id_nombre_funcionario').val();

    if ( dependenciaId == "") {
        clearCargo();
        clearNombre();
    }
    else {
        if (dependenciaId != "") {
            getCargosForDependencia(dependenciaId, function (ans) {
                populateCargosSelect(ans);
                $('#id_cargo').val(cargoId);
            });
            if (cargoId != "") {
                getNombresForCargo(parseInt(cargoId), function (ans) {
                        populateNombreSelect(ans);
                    //$('#id_nombre_funcionario').val(nombreId);
                });
            }
        }

    }

    if (dependenciaId != "") {
            getCargosForDependencia(dependenciaId, function (ans) {
                populateCargosSelect(ans);
                $('#id_cargo').val(cargoId);
            });
             if (cargoId != "") {
                 getNombresForCargo(parseInt(cargoId), function (ans) {
                     populateNombreSelect(ans);
                     //$('#id_nombre_funcionario').val(nombreId);
                 });
             }
     }

    $('#id_dependencia').on('change', function() {
        var option = $(this).val();

        if (option != null) {
            if (option == "") {
                clearCargo();
                clearNombre();
            }
            else {
                clearNombre();
                getCargosForDependencia(parseInt(option), function (ans) {
                    populateCargosSelect(ans);
                });
            }
        }
    });

     $('#id_cargo').on('change', function() {
        var option = $(this).val();

        if (option != null) {

            if (option == "") {

                clearNombre();
            }
            else {
                getNombresForCargo(parseInt(option), function (ans) {
                    populateNombreSelect(ans);
                });
            }
        }
    });
});




// Does the actual filtering
function getCargosForDependencia(dependenciaId, onSuccess) {
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
    $.get('/visitas/register-by-token', function(ans) {
        // TODO: add a failure function
        var ajaxData = { access_token: ans.access_token, dependencias: dependenciaId };

        $j.ajax({
            url: '/api/cargos',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}

function getNombresForCargo(cargoID, onSuccess) {
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
    $.get('/visitas/register-by-token', function(ans) {
        // TODO: add a failure function
        var ajaxData = { access_token: ans.access_token, id_cargo: cargoID };

        $j.ajax({
            url: '/api/cargo_nombre',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}

// Once we're done filtering, we just put the results where they belong
function populateCargosSelect(cargos) {
    // Clean the field
    clearCargo();

    for (var i = 0; i < cargos.length; i++) {
        $j('#id_cargo').append(
            '<option value="'+cargos[i].id+'">' +
            cargos[i].nombre_cargo +
            '</option>'
        );
    }

}

function populateNombreSelect(cargos) {
    // Clean the field
    clearNombre();

    for (var i = 0; i < cargos.length; i++) {
        $j('#id_nombre_funcionario').val(cargos[i].nombre_funcionario);
    }


}

/*
    Doesn't really clear the field
    it keeps the default option
*/
function clearCargo() {
    $j('#id_cargo')
        .empty()
        .append('<option value>---------</option>');
}

function clearNombre() {
    $j('#id_nombre_funcionario').val("");

}