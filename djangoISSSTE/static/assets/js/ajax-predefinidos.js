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
var cualPpxt = 0;

var descripcionIniciadas = "Obras proyectadas que a la fecha deberían estar en proceso";
var descripcionVencidas = "Obras en proceso que a la fecha deberían estar concluidas";
var descripcionDependencias = "Dependencias sin actividad en los últimos 15 días.";
function valida_token(){
var ajax_datatoken = {
      "access_token"  : 'O9BfPpYQuu6a5ar4rGTd2dRdaYimVa'
    };


    $j.ajax({
        url: '/obras/register-by-token',
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
    //volverHistorico();
    //$j('#obrasPorAutorizar').on('click', verDatos('obras_por_autorizar'))
    //$j('#obrasIniciadas').on('click', verDatos('obras_iniciadas'))
    //$j('#obrasVencidas').on('click', verDatos('obras_vencidas'))
    //$j('#obrasPorDependencia').on('click', verDatos('obras_por_dependencia'))
    $j('#obrasPorAutorizar').on('click', verDatos)
    $j('#obrasIniciadas').on('click', obrasIniciadas)
    $j('#obrasVencidas').on('click', obrasVencidas)
    $j('#obrasPorDependencia').on('click', obrasPorDependencia)
    $j('#prsentacionAPF').on('click', prsentacionAPF)
    $j('#enviaPDF2').on('click', demoFromHTML2)
    $j('#ver_datos #enviaPPT2').on('click', PptxReporte)


}


function PptxReporte() {
    var URLiniciadas="/obras/api/PptxIniciadas?access_token=" + newToken;
    var URLvencidas="/obras/api/PptxVencidas?access_token=" + newToken;
    var URLbitacora="/obras/api/PptxBitacora?access_token=" + newToken;

    if (cualPpxt==1) {location.href = URLiniciadas;}
    if (cualPpxt==2) {location.href = URLvencidas;}
    if (cualPpxt==3) {location.href = URLbitacora;}


}

function demoFromHTML2() {
    var pdf = new jsPDF('p', 'pt', 'letter');
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
        pdf.save('DocumentoObras.pdf');
    }, margins);

    $pop('#tabla-exporta').hide();
}

function verDatos() {
    $j('#load3').removeClass("mfp-hide");
    $j('#load3').addClass("mfp-show");
    cualPpxt=4;
    var ajax_data = {
      "access_token"  : newToken
    };
    $j.ajax({
        url: '/obras/api/obras_por_autorizar',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            $j('#historico').val("SI");
            tablaI(data,'Obras por Autorizar');
            datosJson=data;
            $j('#load3').addClass("mfp-hide");
        },
        error: function(data) {
            $j('#load3').addClass("mfp-hide");
            alert('error!!! ' + data.status);
        }
    });
}


function prsentacionAPF() {

    var URL="/obras/api/PptxObrasImages?access_token=" + newToken;
    location.href = URL;

}

function obrasIniciadas() {
    $j('#load1').removeClass("mfp-hide");
    $j('#load1').addClass("mfp-show");
    cualPpxt=1;
    var ajax_data = {
      "access_token"  : newToken
    };
    $j.ajax({
        url: '/obras/api/obras_iniciadas',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            $j('#historico').val("SI");
            tablaI(data,'Obras Iniciadas',descripcionIniciadas);
            datosJson=data;
            $j('#load1').addClass("mfp-hide");
        },
        error: function(data) {
            $j('#load1').addClass("mfp-hide");
            alert('error!!! ' + data.status);
        }
    });

}

function obrasVencidas() {
    $j('#load2').removeClass("mfp-hide");
    $j('#load2').addClass("mfp-show");
    cualPpxt=2;
    var ajax_data = {
      "access_token"  : newToken
    };
    //alert(descripcionVencidas);
    $j.ajax({
        url: '/obras/api/obras_vencidas',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            $j('#historico').val("SI");

            tablaI(data,'Obras Vencidas',descripcionVencidas);
            datosJson=data;
            $j('#load2').addClass("mfp-hide");
        },
        error: function(data) {
            alert('error!!! ' + data.status);
            $j('#load2').addClass("mfp-hide");
        }
    });

}

function obrasPorDependencia() {
    $j('#load3').removeClass("mfp-hide");
    $j('#load3').addClass("mfp-show");
    cualPpxt=3;
    var ajax_data = {
      "access_token"  : newToken
    };
    $j.ajax({
        url: '/obras/api/noTrabajo',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            $j('#historico').val("SI");
            tablaD(data,'Obras por Dependencia',descripcionDependencias);
            datosJson=data;
            $j('#load3').addClass("mfp-hide");
        },
        error: function(data) {
            $j('#load3').addClass("mfp-hide");
            alert('error!!! ' + data.status);

        }
    });

}

function tablaI(Datos,titulo,descripcion){
    var sHtmlExporta="";
    var sHtmlShorter="";
    var sHtmlistado="";
    sHtmlExporta= '<table id="tablaExporta" class="table2excel">'
                +' <colgroup>'
                +' <col width="30%">'
                +' <col width="40%">'
                +' <col width="30%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Id</th>'
                            +'<th>Denominaci&oacute;n</th>'
                            +'<th>Estado</th>'
                        +'</tr>'
                +'</thead>'
                +'<tbody>';


    var sHtml = '<table cellspacing="1"  id="tablaIzquierda">'
                +' <colgroup>'
                +' <col width="30%">'
                +' <col width="40%">'
                +' <col width="30%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Id</th>'
                            +'<th>Denominaci&oacute;n</th>'
                            +'<th>Estado</th>'
                        +'</tr>'
                +'</thead>'
                +'<tfoot>'
                        +'<tr>'
                            +'<th>Id</th>'
                            +'<th>Denominaci&oacute;n</th>'
                            +'<th>Estado</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerI" colspan="3">'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/first.png" class="first" id="firstI"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/prev.png" class="prev" id="prevI"/>'
                        +'<span class="pagedisplay" id="pagedisplayI"></span>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/next.png" class="next" id="nextI"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/last.png" class="last" id="lastI"/>'
                        +'<select class="pagesize" id="pagesizeI">'
                        +'<option selected="selected"  value="10">10</option>'
                        +'    <option value="20">20</option>'
                        +'    <option value="30">30</option>'
                        +'    <option  value="40">40</option>'
                        +'</select></td></tr>'

                    +'</tfoot>'
                    +'<tbody>';

    for(var i= 0;i<Datos.length;i++){
        sHtml +='<tr>'
                +'<td><a href="/admin/obras/obra/' + Datos[i].id + '/?m=1">' + Datos[i].identificador_unico +'</a></td>'
                +'<td>' + Datos[i].denominacion +'</td>'
                +'<td>' + Datos[i].estado__nombreEstado +'</td>'
                +'</tr>'
        sHtmlExporta += '<tr>'
                +'<td><a href="/admin/obras/obra/' + Datos[i].id + '/?m=1">' + Datos[i].identificador_unico +'</a></td>'
                +'<td>' + Datos[i].denominacion +'</td>'
                +'<td>' + Datos[i].estado__nombreEstado +'</td>'
                +'</tr>'
    }

        sHtml +='</tbody>'
                +'</table>'
                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaIzquierda").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager", "scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 190,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'          pager_selectors: {'
                +'                container   : "#pagerI",'
                +'                first       : "#firstI",'
                +'                prev        : "#prevI",'
                +'                next        : "#nextI",'
                +'                last        : "#lastI",'
                +'                gotoPage    : "#gotoPageI",'
                +'                pageDisplay : "#pagedisplayI",'
                +'                pageSize    : "#pagesizeI"'
                +'        }'
                +'    }'
                +'});'
                +'});'
                +'</script>';
    sHtmlExporta +='</tbody>'
                +'</table>';
    $j('#tabla-exporta').hide();
    $j('#titulo').html(titulo);
    $j('#descripcion').html(descripcion);
    $j('#tabla-exporta').html(sHtmlExporta);
    $j('#tabla').html(sHtml);


}

function volverHistorico() {
    //var variable = (opener) ? opener.location.href : 'No disponible' ;
    //document.write(variable);
    var sHistorico = $j('#historico').val();
    if (sHistorico.toString() =="SI") {
        $.get("/obras/register-by-token", function (respu) {
           newToken = respu.access_token;
           verDatos()
        });
    }
}

function tablaD(Datos,titulo,descripcion){
    var sHtmlExporta= '<table id="tablaExporta" class="table2excel">'
                +' <colgroup>'
                +' <col width="30%">'
                +' <col width="40%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Dependencia</th>'
                            +'<th>Fecha de última Modificación</th>'

                        +'</tr>'
                +'</thead>'
                +'<tbody>';

    var sHtml = '<table id="tablaIzquierda" class="table table-striped">'
                +' <colgroup>'
                +' <col width="30%">'
                +' <col width="70%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Dependencia</th>'
                            +'<th>Fecha de última Modificación</th>'
                        +'</tr>'
                +'</thead>'
                +'<tfoot>'
                        +'<tr>'
                            +'<th>Dependencia</th>'
                            +'<th>Fecha de última Modificación</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerI" colspan="3">'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/first.png" class="first" id="firstI"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/prev.png" class="prev" id="prevI"/>'
                        +'<span class="pagedisplay" id="pagedisplayI"></span>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/next.png" class="next" id="nextI"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/last.png" class="last" id="lastI"/>'
                        +'<select class="pagesize" id="pagesizeI">'
                        +'<option selected="selected"  value="10">10</option>'
                        +'    <option value="20">20</option>'
                        +'    <option value="30">30</option>'
                        +'    <option  value="40">40</option>'
                        +'</select></td></tr>'

                    +'</tfoot>'
                    +'<tbody>';
    for(var i= 0;i<Datos.length;i++){
        sHtml +='<tr>'
                +'<td>' + Datos[i].nombreDependencia +'</td>'
                +'<td>' + myDateFormatter(Datos[i].fecha_ultima_modificacion) +'</td>'
                +'</tr>'
        sHtmlExporta += '<tr>'
                +'<td>' + Datos[i].nombreDependencia +'</td>'
                +'<td>' + myDateFormatter(Datos[i].fecha_ultima_modificacion) +'</td>'
                +'</tr>'
    }

        sHtml +='</tbody>'
                +'</table>'
                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaIzquierda").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager", "scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 190,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'          pager_selectors: {'
                +'                container   : "#pagerI",'
                +'                first       : "#firstI",'
                +'                prev        : "#prevI",'
                +'                next        : "#nextI",'
                +'                last        : "#lastI",'
                +'                gotoPage    : "#gotoPageI",'
                +'                pageDisplay : "#pagedisplayI",'
                +'                pageSize    : "#pagesizeI"'
                +'        }'
                +'    }'
                +'});'
                +'});'
                +'</script>'
                +'</tbody>'
                +'</table>';
    sHtmlExporta +='</tbody>'
                +'</table>';
    $j('#tabla-exporta').hide();
    $j('#titulo').html(titulo);
    $j('#descripcion').html(descripcion);
    $j('#tabla').html(sHtml);
    $j('#tabla-exporta').html(sHtmlExporta);

}

function myDateFormatter (dateObject) {
        var d = new Date(dateObject);
        var day = d.getDate();
        var month = d.getMonth()+1;
        var year = d.getFullYear()
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        //var fecha =year + "-" + month + "-" + day;
        var fecha =day + "-" + month + "-" + year;

        return fecha;
    };