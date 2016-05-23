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


function valida_token(){
var ajax_datatoken = {
      "access_token"  : 'O9BfPpYQuu6a5ar4rGTd2dRdaYimVa'
    };


    $j.ajax({
        url: '/register-by-token',
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
    avancePorMunicipio();


    $j('#enviaPDF2').on('click', demoFromHTML2)
    $j('#ver_datos #enviaPPT2').on('click', PptxReporte)





}

///********************************************************************************************************************
function PptxReporte() {
    var URL="/issste/api/PPTXlistadoAvances?access_token=" + newToken;

   location.href = URL;

}



function demoFromHTML2() {
    var pdf = new jsPDF('l', 'pt', 'letter');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    $pop('#tabla-exporta').show()

    source = $pop('#tabla-exporta')[0];
    // we support special element handlers. Register them with jQuery-style
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors
    // (class, of compound) at this time.
    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
    source, // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top, { // y coord
        'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandlers
    },

    function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        //          this allow the insertion of new lines after html
        pdf.save('Documentos.pdf');
    }, margins);

    $pop('#tabla-exporta').hide();
}

function avancePorMunicipio() {


    $j.get("/register-by-token", function(respu) {
        var ajax_data = {
            "access_token": respu.access_token
        };

        $j.ajax({
            url: '/issste/api/listadoAvances',
            type: 'get',
            data: ajax_data,
            success: function (data) {
                datosJson = data;
                tablaI(data);
            },
            error: function (data) {
                //alert('error!!! ' + data.status);
            }
        });
    });


}

function tablaI(Datos){
    var sHtmlExporta="";
    sHtmlExporta= '<table id="tablaExporta2" class="table2excel">'
                +' <colgroup>'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' <col width="10%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>ID</th>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acci&oacute;n</th>'
                            +'<th>Anio</th>'
                            +'<th>Estado</th>'
                            +'<th>Inversi&oacute;n Avance</th>'
                            +'<th>Monto Promedio</th>'
                            +'<th>Inversi&oacute;n Meta</th>'

                        +'</tr>'
                +'</thead>'
                +'<tbody>';


            for(var i= 0;i<Datos.length;i++){


                sHtmlExporta += '<tr>'
                        +'<td>' + Datos[i].id +'</td>'
                        +'<td>' + Datos[i].carencia +'</td>'
                        +'<td>' + Datos[i].subCarencia +'</td>'
                        +'<td>' + Datos[i].accion +'</td>'
                        +'<td>' + Datos[i].periodo +'</td>'
                        +'<td>' + Datos[i].estado +'</td>'
                        +'<td>' + Datos[i].inversionAvance +'</td>'
                        +'<td>' + Datos[i].monto +'</td>'
                        +'<td>' + Datos[i].inversionMeta +'</td>'
                        +'</tr>'
            }

    sHtmlExporta +='</tbody>'
                +'</table>';

    $j('#tabla-exporta').hide();
    $j('#tabla-exporta').html(sHtmlExporta);


}

