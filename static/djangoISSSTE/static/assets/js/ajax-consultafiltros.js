/**
 *
 * filtrado de estados dependiendo de la region
 * filtrado de municipio y distrito electoral dependiendo del estado
 *
 */

$l(document).on('ready', function() {
    /*
     Only do the cleanup if the field didn't contain a value already
     this is used for the edit form
     */

    $l('#msRegiones').bind('change', function () {
        var regionId = $l(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        if (regionId != null) {
            getEstadosForRegion(parseInt(regionId), function (ans) {
                populateEstadosSelect(ans);
            });
        }
    });

    $('#msEstados').on('change', function () {
        var estadoId = $(this).$l(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();

        getMunicipiosForEstado(parseInt(estadoId), function (ans) {
            populateMunicpiosSelect(ans);
        });
        getDistritosForEstado(estadoId, function (ans) {
            populateDistritosSelect(ans);

        });
    });
});

// PARA CARGA DE ESTADOS POR REGION SELECCIONADA
    function getEstadosForRegion(regionId, onSuccess) {
        // Setup CSRF tokens and all that good stuff so we don't get hacked
        $j.ajaxSetup(
            {
                beforeSend: function (xhr, settings) {
                    if (settings.type == "POST")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                    if (settings.type == "GET")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                }
            }
        );
        alert("befget")
        // Get an Oauth2 access token and then do the ajax call, because SECURITY
        $.get('/visitas/register-by-token', function (ans) {
            // TODO: add a failure function
            var ajaxData = {access_token: ans.access_token, regiones: regionId.toString()};

            $j.ajax({
                url: '/api/estados',
                type: 'get',
                data: ajaxData,
                success: onSuccess
            });
        });
    }

// PARA CARGA DE MUNICIPIO POR ESTADO SELECCIONADO
    function getMunicipiosForEstado(estadoId, onSuccess) {
        // Setup CSRF tokens and all that good stuff so we don't get hacked
        $j.ajaxSetup(
            {
                beforeSend: function (xhr, settings) {
                    if (settings.type == "POST")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                    if (settings.type == "GET")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                }
            }
        );

        // Get an Oauth2 access token and then do the ajax call, because SECURITY
        $.get('/visitas/register-by-token', function (ans) {
            // TODO: add a failure function

            var ajaxData = {access_token: ans.access_token, estados: estadoId.toString()};

            $j.ajax({
                url: '/api/municipios',
                type: 'get',
                data: ajaxData,
                success: onSuccess
            });
        });
    }

// PARA CARGA DE DISTRITO ELECTORAL DEPENDIENDO DE ESTADO SELECCIONADO
    function getDistritosForEstado(estadoId, onSuccess) {
        // Setup CSRF tokens and all that good stuff so we don't get hacked
        $j.ajaxSetup(
            {
                beforeSend: function (xhr, settings) {
                    if (settings.type == "POST")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                    if (settings.type == "GET")
                        xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                }
            }
        );

        // Get an Oauth2 access token and then do the ajax call, because SECURITY
        $.get('/visitas/register-by-token', function (ans) {
            // TODO: add a failure function
            var ajaxData = {access_token: ans.access_token, estados: estadoId.toString()};

            $j.ajax({
                url: '/api/distritos_electorales',
                type: 'get',
                data: ajaxData,
                success: onSuccess
            });
        });
    }

// Once we're done filtering, we just put the results where they belong
    function populateEstadosSelect(estados) {
        // Clean the field
        clearEstados();
        var sHtml = '<select id="msEstados" multiple="multiple" style="width: 100%;height: auto;">';
        for (var i = 0; i < estados.length; i++) {
            sHtml = sHtml + '<option value=' + estados[i].id + '>' + estados[i].nombreEstado + '</option>';
        }
        sHtml = sHtml + '</select>';

        $l('#msEstados').html(sHtml);

        $l("#msEstados").multiselect({
            header: true,
            checkAllText: 'Marcar todos', uncheckAllText: 'Desmarcar todos',
            noneSelectedText: 'Estados',
            selectedText: '# Estados'
        });
    }

    function populateMunicpiosSelect(municipios) {
        // Clean the field
        clearMunicipios();

        var sHtml = '<select id="msMunicipios" multiple="multiple" style="width: 100%;height: auto;">';
        for (var i = 0; i < municipios.length; i++) {
            sHtml = sHtml + '<option value=' + municipios[i].id + '>' + municipios[i].nombreMunicipio + '</option>';
        }
        sHtml = sHtml + '</select>';

        $l('#msMunicipios').html(sHtml);

        $l("#msMunicipios").multiselect({
            header: true,
            checkAllText: 'Marcar todos', uncheckAllText: 'Desmarcar todos',
            noneSelectedText: 'Municipios',
            selectedText: '# Municipios'
        });
    }

    function populateDistritosSelect(distritos) {
        // Clean the field
        clearDistritoElectoral();

        var sHtml = '<select id="msDistritos" multiple="multiple" style="width: 100%;height: auto;">';
        for (var i = 0; i < distritos.length; i++) {
            sHtml = sHtml + '<option value=' + distritos[i].id + '>' + distritos[i].nombre_distrito_electoral + '</option>';
        }
        sHtml = sHtml + '</select>';

        $l('#msDistritos').html(sHtml);

        $l("#msDistritos").multiselect({
            header: true,
            checkAllText: 'Marcar todos', uncheckAllText: 'Desmarcar todos',
            noneSelectedText: 'Distrito Electoral',
            selectedText: '# Distritos Electorales'
        });

    }

    /*
     limpiar los multiselect si han elegido alguna opciòn de filtrado
     */

    function clearEstados() {
        $l('#msEstados').html('');
        $l('#msEstados').multiselect('destroy');

    }

    function clearMunicipios() {
        $l('#msMunicipios').html('');
        $l('#msMunicipios').multiselect('destroy');
    }

    function clearDistritoElectoral() {
        $l('#msDistritos').html('');
        $l('#msDistritos').multiselect('destroy');
    }

