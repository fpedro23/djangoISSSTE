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

    var mismun=[];
    var nom="";
    var idmun;
    //if (munlenght>0 && parseInt(estadoId) >0){
       // for (i = 0; i < munlenght - 1; i++) {

         //   mismun[i] = $j("select#id_avancemensual_set-" + i + "-municipio").val();
          // idmun= $j('.tamcontrolsel')[i].value;
          // nom=$j("select#id_avancemensual_set-" + i + "-municipio option:selected").text();
           //alert(i + ',value:' + $j('.tamcontrolsel')[i].value + "estaoId=" + estadoId + "nomMun" + nom);
          // clearMunicipios3(i);

           //$j("select#id_avancemensual_set-" + i + "-municipio").append('<option value="' + idmun + '">' + nom + '</option>');
           //$j("select#id_avancemensual_set-" + i + "-municipio option[value=" + idmun + "]").attr('selected', true);
       // }

        //obtiene municipios
        // getMunicipiosForEstado(estadoId, function (ans) {
        //    populateMunicpiosSelect3(ans,mismun);
        //   });
   // }

    // I know, I'm calling this again, I'll get around to fixingt it
    /*$('#id_estado').on('change', function() {
        var option = $(this).find('option:selected');

        if (option != null) {
            var estadoId = option.val();
            if (estadoId == "") {
                clearMunicipios();

            }
            else {
                getMunicipiosForEstado(parseInt(estadoId), function (ans) {
                    populateMunicpiosSelect(ans);
                });

            }
        }
    });*/

    $j(".tamcontrolsel").on("focus",function(){
          idmun= $( this ).attr('id');
          idmun= idmun.substring(21,23);
          idmun= idmun.replace('-','');
          nom=$( this).val();

        //alert(idmun+"_"+nom);
        if ( idmun < munlenght){
            var txt = $j("select#id_avancemensual_set-" + idmun + "-municipio option:selected").text();
            clearMunicipios3(idmun);
            $j("select#id_avancemensual_set-" + idmun + "-municipio").append(
                     '<option value="' + nom + '">' + txt + '</option>');
            $j("select#id_avancemensual_set-" + idmun + "-municipio option[value=" + nom + "]").attr('selected', true);
            //alert(txt);
        }
    });

    $j(".tamcontrolsel").on("change",function(){
            if ( idmun < munlenght){
                $j("select#id_avancemensual_set-" + idmun + "-municipio option[value=" + nom + "]").attr('selected', true);
                $( this).val(nom);
            }
    });

    $j("tr.add-row").on("click",function(){
        var estadoId = $('#id_estado').find('option:selected').val();
        var mismun=[];

        for(i=0;i<$j('.tamcontrolsel').length-2;i++)
        {
            mismun[i]=$j("select#id_avancemensual_set-"+i+"-municipio").val();
        }
            getMunicipiosForEstado(parseInt(estadoId), function (ans) {
                populateMunicpiosSelect2(ans,mismun);
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
function populateMunicpiosSelect(municipios) {
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



function populateMunicpiosSelect2(municipios,mismun) {
    // Clean the field
    //alert('lenght de mis municipios selected'+mismun.length);
    clearMunicipios2(mismun);

    for (var i = 0; i < municipios.length; i++) {

       $j("select#id_avancemensual_set-"+(mismun.length)+"-municipio").append(
            '<option value="'+municipios[i].id+'">' +
            municipios[i].nombreMunicipio +
            '</option>'
        );
    }
    for (var i = 0; i < mismun.length; i++) {
        //alert(mismun[i]);
        $j("select#id_avancemensual_set-" + mismun.length + "-municipio").find("option[value='" + mismun[i] + "']").hide();
    }

}

function clearMunicipios2(mismun) {


    $j("select#id_avancemensual_set-"+mismun.length+"-municipio")
        .empty()
        .append('<option value>---------</option>');
}


function populateMunicpiosSelect3(municipios,mismun) {
    //mismun los valores de municipios que ya han sido seleccionados y se deben ocultar
    // Clean the field
    //alert(', array'+mismun);


    for (var j=0;j <= mismun.length;j++) {
        for (var i = 0; i < municipios.length; i++) {

            $j("select#id_avancemensual_set-" + j + "-municipio").append(
                '<option value="' + municipios[i].id + '">' +
                municipios[i].nombreMunicipio +
                '</option>'
            );
        }
        $j("select#id_avancemensual_set-" + j + "-municipio option[value=" + mismun[j] + "]").attr('selected', true);
        $j("select#id_avancemensual_set-" + j + "-municipio option:not(:selected)").attr('disabled', true);
    }

}

function clearMunicipios3(i) {

    $j("select#id_avancemensual_set-"+i+"-municipio")
        .empty()
        .append('<option value>---------</option>');
}


