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
var descripcionavanceMunicipio = "Se muestran los avances por cada municipio";
var descripcionMetasSinAvances = "Metas que no tienen registrados avances"

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
    $j('#balanceGeneral').on('click', balanceGeneral)
    $j('#balanceEntidad').on('click', balanceEntidad)
    $j('#informacionGeneral').on('click', informacionGeneral)
    $j('#avancesPeriodo').on('click', avancesPeriodo)


    $j('#avancepormunicipio').on('click', avancePorMunicipio);
    $j('#metassinavances').on('click', metasSinAvances);

    $j('#enviaPDF2').on('click', demoFromHTML2)




}

///********************************************************************************************************************

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
        pdf.save('Documentos.pdf');
    }, margins);

    $pop('#tabla-exporta').hide();
}

function balanceGeneral() {
    var URL="/issste/api/balanceGeneral?access_token="+newToken;
    location.href = URL;

}

function balanceEntidad() {
    var URL="/issste/api/balancePorEntidad?access_token="+newToken;
    location.href = URL;

}

function avancesPeriodo() {
    var URL="/issste/api/reporteAvancesPeriodo?access_token="+newToken;
    location.href = URL;

}

function informacionGeneral() {
    var URL="/issste/api/informacionGeneral?access_token="+newToken;
    location.href = URL;

}




function avancePorMunicipio() {
    $j('#load1').removeClass("mfp-hide");
    $j('#load1').addClass("mfp-show");
    var ajax_data = {
      "access_token"  : newToken
    };
    $j.ajax({
        url: '/issste/api/PD_AvancePorMunicipio',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            tablaI(data,'Avances por Municipio',descripcionavanceMunicipio);
            datosJson=data;
            $j('#load1').addClass("mfp-hide");
        },
        error: function(data) {
            $j('#load1').addClass("mfp-hide");
            alert('error!!! ' + data.status);
        }
    });

}

function metasSinAvances() {
    $j('#load2').removeClass("mfp-hide");
    $j('#load2').addClass("mfp-show");
    var ajax_data = {
      "access_token"  : newToken
    };
    $j.ajax({
        url: '/issste/api/PD_MetasSinAvances',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            tablaMA(data,'Metas sin Avances',descripcionMetasSinAvances);
            datosJson=data;
            $j('#load2').addClass("mfp-hide");
        },
        error: function(data) {
            $j('#load2').addClass("mfp-hide");
            alert('error!!! ' + data.status);
        }
    });

}

function tablaI(Datos,titulo,descripcion){
    var sHtmlExporta="";
    var sHtmlShorter="";
    var sHtmlistado="";
    sHtmlExporta= '<table id="tablaExporta2" class="table2excel">'
                +' <colgroup>'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acci&oacute;n</th>'
                            +'<th>Municipio</th>'
                            +'<th>Avance Total</th>'
                        +'</tr>'
                +'</thead>'
                +'<tbody>';

    var sHtml='<table cellspacing="1"  id="tablaIzquierda">'
                +' <colgroup>'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="30%">'
                +' <col width="20%">'
                +' <col width="10%">'
                +' </colgroup>'
                +' <thead>'
                        +'<tr>'
                            +'<th width="30%">Carencia</th>'
                            +'<th width="40%">SubCarencia</th>'
                            +'<th width="30%">Acci&oacute;n</th>'
                            +'<th width="30%">Municipio</th>'
                            +'<th width="30%">Avance Total</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tfoot>'
                        +'<tr>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acci&oacute;n</th>'
                            +'<th>Municipio</th>'
                            +'<th>Avance Total</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerI" colspan="5">'
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


            for(var i= 0;i<Datos.reporte_por_municipio.length;i++){
                sHtml +='<tr>'
                        +'<td style="width:28%"><a href="/admin/djangoISSSTE/avancepormunicipio/' + Datos.reporte_por_municipio[i].avancePorMunicipio_id + '/change">' + Datos.reporte_por_municipio[i].carencia +'</a></td>'
                        +'<td style="width:36%">' + Datos.reporte_por_municipio[i].subCarencia +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_por_municipio[i].accion +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_por_municipio[i].municipio +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_por_municipio[i].suma_avance +'</td>'
                        +'</tr>'

                sHtmlExporta += '<tr>'
                        +'<td>' + Datos.reporte_por_municipio[i].carencia +'</td>'
                        +'<td>' + Datos.reporte_por_municipio[i].subCarencia +'</td>'
                        +'<td>' + Datos.reporte_por_municipio[i].accion +'</td>'
                        +'<td>' + Datos.reporte_por_municipio[i].municipio +'</td>'
                        +'<td>' + Datos.reporte_por_municipio[i].suma_avance +'</td>'
                        +'</tr>'
            }

        sHtml +=' </tbody>'
                +'</table>'
                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaIzquierda").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager", "scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 180,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'        pager_selectors: {'
                +'                container   : "#pagerI",'
                +'                first       : "#firstI",'
                +'                prev        : "#prevI",'
                +'                next        : "#nextI",'
                +'                last        : "#lastI",'
                +'                gotoPage    : "#gotoPageI",'
                +'                pagedisplay : "#pagedisplayI",'
                +'                pagesize    : "#pagesizeI"'
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


function tablaMA(Datos,titulo,descripcion){
    var sHtmlExporta="";
    var sHtmlShorter="";
    var sHtmlistado="";
    sHtmlExporta= '<table id="tablaExporta2" class="table2excel">'
                +' <colgroup>'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acci&oacute;n</th>'
                            +'<th>Estado</th>'
                            +'<th>Meta</th>'
                        +'</tr>'
                +'</thead>'
                +'<tbody>';

    var sHtml='<table cellspacing="1"  id="tablaIzquierda">'
                +' <colgroup>'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="30%">'
                +' <col width="20%">'
                +' <col width="10%">'
                +' </colgroup>'
                +' <thead>'
                        +'<tr>'
                            +'<th width="30%">Carencia</th>'
                            +'<th width="40%">SubCarencia</th>'
                            +'<th width="30%">Acci&oacute;n</th>'
                            +'<th width="30%">Estado</th>'
                            +'<th width="30%">Meta</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tfoot>'
                        +'<tr>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acci&oacute;n</th>'
                            +'<th>Estado</th>'
                            +'<th>Meta</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerI" colspan="5">'
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


            for(var i= 0;i<Datos.reporte_metas.length;i++){
                sHtml +='<tr>'
                        +'<td style="width:28%">' + Datos.reporte_metas[i].carencia +'</a></td>'
                        +'<td style="width:36%">' + Datos.reporte_metas[i].subCarencia +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_metas[i].accion +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_metas[i].estado +'</td>'
                        +'<td style="width:28%">' + Datos.reporte_metas[i].suma_meta +'</td>'
                        +'</tr>'

                sHtmlExporta += '<tr>'
                        +'<td>' + Datos.reporte_metas[i].carencia +'</td>'
                        +'<td>' + Datos.reporte_metas[i].subCarencia +'</td>'
                        +'<td>' + Datos.reporte_metas[i].accion +'</td>'
                        +'<td>' + Datos.reporte_metas[i].estado +'</td>'
                        +'<td>' + Datos.reporte_metas[i].suma_meta +'</td>'
                        +'</tr>'
            }

        sHtml +=' </tbody>'
                +'</table>'
                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaIzquierda").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager", "scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 180,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'        pager_selectors: {'
                +'                container   : "#pagerI",'
                +'                first       : "#firstI",'
                +'                prev        : "#prevI",'
                +'                next        : "#nextI",'
                +'                last        : "#lastI",'
                +'                gotoPage    : "#gotoPageI",'
                +'                pagedisplay : "#pagedisplayI",'
                +'                pagesize    : "#pagesizeI"'
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