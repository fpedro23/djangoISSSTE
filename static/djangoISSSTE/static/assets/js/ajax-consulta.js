/**
 * Created by usuario on 30/04/2015.
 */
/**
 * Created by db2 on 7/04/15.
 */
var $j = jQuery.noConflict();

$j(document).on('ready', main_consulta);

var datosJson
var newToken

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
                //xhr.overrideMimeType( "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" );
			}
            if(settings.type == "GET"){
				xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
                //xhr.overrideMimeType( "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8" );
			}
		}
	});

    valida_token();

	$j('#ver_datos #button').on('click', verDatos);
    $j('#ver_datos #enviaPPT2').on('click', ResultadosPptx)
    $j('#ver_datos #enviaPPT').on('click', ReportePptx)
    $j('#enviaPDF').on('click', demoFromHTML)
    $j('#enviaPDF2').on('click', demoFromHTML2)
    $j('#art_limpiar #limpiar').on('click', limpia);
    $j('#ver_grafica #grafica').on('click', graficas)



    $j('#ver_tabla_estado #estado').on('click', mostrarTablas);
    $j('#ver_tabla_carencia #carencia').on('click', mostrarTablas)
    $j('#ver_tabla_accion #accion').on('click', mostrarTablas)
    $j('#ver_grafica_estado #estado').on('click', graficas);
    $j('#ver_grafica_carencia #carencia').on('click', graficas);
    $j('#ver_grafica_accion #accion').on('click', graficas);
    $j('#ver_grafica_tipos #tipoGrafica').on('change', graficas);
    $j('#ver_grafica_datos #datosGrafica').on('change', graficas);

    $j('#listado #listar').on('click', listarObras)

    $j('#regresaGraficas #regresarBTN').on('click', regresa)
    $j('#openWin').on('click', openWin)


    $j('#mapaEstado').on('click', ponerMapaEstado)
    $j('#mapaObra').on('click', ponerMapaObra)

    


    volverHistorico();
    //cargaMunicipios();
    //cargaSubDependencias();





}





function volverHistorico() {
    //var variable = (opener) ? opener.location.href : 'No disponible' ;
    //document.write(variable);
    var sHistorico = $j('#historico').val();
    if (sHistorico.toString() =="SI") {
        $.get("/register-by-token", function (respu) {
           newToken = respu.access_token;
           verDatos()
        });
    }
}

function demoFromHTML() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    $pp('#tabla-exporta').show()

    source = $pp('#tabla-exporta')[0];
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
        pdf.save('Reporte.pdf');
    }, margins);

    $pp('#tabla-exporta').hide();
}

function demoFromHTML2() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    $pp('#tabla-exporta2').show()

    source = $pp('#tabla-exporta2')[0];
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
        pdf.save('Resultados.pdf');
    }, margins);

    $pp('#tabla-exporta2').hide();
}

function openWin() {
    myWindow = window.open("/admin/obras/obra/4/?m=1", "Ficha Técnica", "width=1200, height=700");   // Opens a new window
}



function limpia(){
   $j("#forma").reset();
}

jQuery.fn.reset = function () {
  $j(this).each (function() { this.reset(); });
}

function listarObras() {
    var tipoReporte = $j('input:radio[name=tipoReporte]:checked').val();

    var arrayDependencias = $l("#msDependencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var fechaInicio1 = $l("#fechaInicial1").val();
    var fechaInicio2 = $l("#fechaInicial2").val();
    var arrayRegion = $l("#msRegiones").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayEstados = $l("#msEstados").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMunicipios = $l("#msMunicipios").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayFuncionarios= $l("#msFuncionarios").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayDistritos= $l("#msDistritos").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayClasificacion = $l("#msClasificaciones").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayTipoCapitalizacion = $l("#msTipoCapitalizacion").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayTipoActividad = $l("#msTipoActividad").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMedios = $l("#msMedios").multiselect("getChecked").map(function(){return this.value;}).get();

    var fechaFin1 = $l("#fechaFinal1").val();
    var fechaFin2 = $l("#fechaFinal2").val();
    var inversionInicial = $l("#inversionInicial").val();
    var inversionFinal = $l("#inversionFinal").val();

    var descripcion = $l("#descripcion").val();
    var problematica = $l("#problematica").val();
    var nombreMedio = $l("#nombreMedio").val();
    var identificador_unico = $l("#identificador_unico").val();
    var arrayPartidos = $l("#msPartidos").multiselect("getChecked").map(function(){return this.value;}).get();


    if (fechaInicio1!=""){fechaInicio1 = myDateFormatter($dp('#fechaInicial1').datepicker("getDate"));}
    if (fechaInicio2!=""){ fechaInicio2 = myDateFormatter($dp('#fechaInicial2').datepicker("getDate"));}
    if (fechaFin1!=""){fechaFin1 = myDateFormatter($dp('#fechaFinal1').datepicker("getDate"));}
    if (fechaFin2!=""){fechaFin2 = myDateFormatter($dp('#fechaFinal2').datepicker("getDate"));}


    var URL="/visitas/listar-visitas?access_token=" + newToken;

    if(arrayDependencias.toString()!=""){URL += "&dependencia=" + arrayDependencias.toString();}
    if(arrayRegion.toString()!=""){URL += "&region=" +arrayRegion.toString();}
    if(arrayMunicipios.toString()!=""){URL += "&municipio=" + arrayMunicipios.toString();}
    if(arrayFuncionarios.toString()!=""){URL += "&cargoEjecuta=" + arrayFuncionarios.toString();}
    if(arrayDistritos.toString()!=""){URL += "&distritoElectoral=" + arrayDistritos.toString();}
    if(arrayEstados.toString()!=""){URL += "&estado=" + arrayEstados.toString();}
    if(arrayClasificacion.toString()!=""){URL += "&clasificacion=" + arrayClasificacion.toString();}
    if(arrayTipoCapitalizacion.toString()!=""){URL += "capitalizacion=" + arrayTipoCapitalizacion.toString();}
    if(arrayTipoActividad.toString()!=""){URL += "&tipoactividad=" + arrayTipoActividad.toString();}
    if(arrayMedios.toString()!=""){URL += "&medio=" + arrayMedios.toString();}
    if(fechaInicio1!=""){URL += "&fechaInicio=" + fechaInicio1;}
    if(fechaInicio2!=""){URL += "&fechaFin=" + fechaInicio2;}

    if(inversionInicial!=""){URL += "&inversionMinima=" + inversionInicial;}
    if(inversionFinal!=""){URL += "&inversionMaxima=" + inversionFinal;}

    if(arrayPartidos.toString()!=""){URL += "&partido=" + arrayDependencias.toString();}
    if(descripcion!=""){URL += "&descripcion=" + descripcion;}
    if(problematica!=""){URL += "&problematica=" + problematica;}
    if(nombreMedio!=""){URL += "&nombreMedio=" + nombreMedio;}
    if(identificador_unico!=""){URL += "&identificador_unico=" + identificador_unico;}

    location.href = URL


}

function ResultadosPptx() {
    var tipoReporte = $j('input:radio[name=tipoReporte]:checked').val();

    var arrayCarencias = $l("#msCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arraySubCarencias = $l("#msSubCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayEstados = $l("#msEstados").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMunicipios = $l("#msMunicipios").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayResponsables= $l("#msResponsables").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayPeriodos= $l("#msPeriodos").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMeses = $l("#msMeses").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayAcciones = $l("#msAcciones").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayUnidades = $l("#msUnidadMedida").multiselect("getChecked").map(function(){return this.value;}).get();


    var inversionInicial = $l("#inversionInicial").val();
    var inversionFinal = $l("#inversionFinal").val();

    var avanceInicial = $l("#avanceInicial").val();
    var avanceFinal = $l("#avanceFinal").val();

    var metaInicial = $l("#metaInicial").val();
    var metaFinal = $l("#metaFinal").val();

    var observaciones = $l("#observaciones").val();



    var URL="/issste/api/ResultadosPptx?access_token=" + newToken;


    if(arrayCarencias.toString()!=""){URL += "&carencias=" + arrayCarencias.toString();}
    if(arraySubCarencias.toString()!=""){URL += "&subcarencias=" + arraySubCarencias.toString();}
    if(arrayMunicipios.toString()!=""){URL += "&municipios=" + arrayMunicipios.toString();}
    //if(arrayResponsables.toString()!=""){URL += "&cargoEjecuta=" + arrayResponsables.toString();}
    if(arrayPeriodos.toString()!=""){URL += "&periodos=" + arrayPeriodos.toString();}
    if(arrayEstados.toString()!=""){URL += "&estados=" + arrayEstados.toString();}
    if(arrayMeses.toString()!=""){URL += "&meses=" + arrayMeses.toString();}
    if(arrayAcciones.toString()!=""){URL += "&acciones=" + arrayAcciones.toString();}
    if(arrayUnidades.toString()!=""){ajax_data.unidadDeMedida=arrayUnidades.toString();}

    if(inversionInicial!=""){URL += "&inversionMinima=" + inversionInicial;}
    if(inversionFinal!=""){URL += "&inversionMaxima=" + inversionFinal;}
    if(avanceInicial!=""){URL += "&avanceMinimo=" + avanceInicial;}
    if(avanceFinal!=""){URL += "&avanceMaximo=" + avanceFinal;}



    if(observaciones!=""){URL += "&observaciones=" + observaciones;}


    location.href = URL


}

function ReportePptx() {
    var tipoReporte = $j('input:radio[name=tipoReporte]:checked').val();
    var arrayCarencias = $l("#msCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arraySubCarencias = $l("#msSubCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayEstados = $l("#msEstados").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMunicipios = $l("#msMunicipios").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayResponsables= $l("#msResponsables").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayPeriodos= $l("#msPeriodos").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMeses = $l("#msMeses").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayAcciones = $l("#msAcciones").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayUnidades = $l("#msUnidadMedida").multiselect("getChecked").map(function(){return this.value;}).get();
    var inversionInicial = $l("#inversionInicial").val();
    var inversionFinal = $l("#inversionFinal").val();

    var avanceInicial = $l("#avanceInicial").val();
    var avanceFinal = $l("#avanceFinal").val();

    var metaInicial = $l("#metaInicial").val();
    var metaFinal = $l("#metaFinal").val();

    var observaciones = $l("#observaciones").val();



    var URL="/issste/api/ReportePptx?access_token=" + newToken;
    URL += "&tipoReporte=" + tipoReporte.toString();

    if(arrayCarencias.toString()!=""){URL += "&carencias=" + arrayCarencias.toString();}
    if(arraySubCarencias.toString()!=""){URL += "&subcarencias=" + arraySubCarencias.toString();}
    if(arrayMunicipios.toString()!=""){URL += "&municipios=" + arrayMunicipios.toString();}
    //if(arrayResponsables.toString()!=""){URL += "&cargoEjecuta=" + arrayResponsables.toString();}
    if(arrayPeriodos.toString()!=""){URL += "&periodos=" + arrayPeriodos.toString();}
    if(arrayEstados.toString()!=""){URL += "&estados=" + arrayEstados.toString();}
    if(arrayMeses.toString()!=""){URL += "&meses=" + arrayMeses.toString();}
    if(arrayAcciones.toString()!=""){URL += "&acciones=" + arrayAcciones.toString();}
    if(arrayUnidades.toString()!=""){ajax_data.unidadDeMedida=arrayUnidades.toString();}

    if(inversionInicial!=""){URL += "&inversionMinima=" + inversionInicial;}
    if(inversionFinal!=""){URL += "&inversionMaxima=" + inversionFinal;}
    if(avanceInicial!=""){URL += "&avanceMinimo=" + avanceInicial;}
    if(avanceFinal!=""){URL += "&avanceMaximo=" + avanceFinal;}
    //if(metaInicial!=""){ajax_data.inversionMinima=metaInicial;}
    //if(metaFinal!=""){ajax_data.inversionMaxima=metaFinal;}


    if(observaciones!=""){URL += "&observaciones=" + observaciones;}


    location.href = URL


}


function verDatos() {

    var arrayCarencias = $l("#msCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arraySubCarencias = $l("#msSubCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayEstados = $l("#msEstados").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMunicipios = $l("#msMunicipios").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayResponsables= $l("#msResponsables").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayPeriodos= $l("#msPeriodos").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayMeses = $l("#msMeses").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayAcciones = $l("#msAcciones").multiselect("getChecked").map(function(){return this.value;}).get();
    var arrayUnidades = $l("#msUnidadMedida").multiselect("getChecked").map(function(){return this.value;}).get();

    var inversionInicial = $l("#inversionInicial").val();
    var inversionFinal = $l("#inversionFinal").val();

    var avanceInicial = $l("#avanceInicial").val();
    var avanceFinal = $l("#avanceFinal").val();

    var metaInicial = $l("#metaInicial").val();
    var metaFinal = $l("#metaFinal").val();

    var observaciones = $l("#observaciones").val();



    var ajax_data = {
      "access_token"  : newToken
    };

    if(arrayCarencias.toString()!=""){ajax_data.carencias=arrayCarencias.toString();}
    if(arraySubCarencias.toString()!=""){ajax_data.subcarencias=arraySubCarencias.toString();}
    if(arrayMunicipios.toString()!=""){ajax_data.municipios=arrayMunicipios.toString();}
    //if(arrayResponsables.toString()!=""){ajax_data.cargoEjecuta=arrayResponsables.toString();}
    if(arrayPeriodos.toString()!=""){ajax_data.periodos=arrayPeriodos.toString();}
    if(arrayEstados.toString()!=""){ajax_data.estados=arrayEstados.toString();}
    if(arrayMeses.toString()!=""){ajax_data.meses=arrayMeses.toString();}
    if(arrayAcciones.toString()!=""){ajax_data.acciones=arrayAcciones.toString();}
    if(arrayUnidades.toString()!=""){ajax_data.unidadDeMedida=arrayUnidades.toString();}

    if(inversionInicial!=""){ajax_data.inversionMinima=inversionInicial;}
    if(inversionFinal!=""){ajax_data.inversionMaxima=inversionFinal;}
    if(avanceInicial!=""){ajax_data.avanceMinimo=avanceInicial;}
    if(avanceFinal!=""){ajax_data.avanceMaximo=avanceFinal;}


    if(observaciones!=""){ajax_data.observaciones=observaciones;}





    $j("#ajaxProgress").show();
    $j.ajax({
        url: '/issste/api/busqueda',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            $j('#historico').val("SI");
            tablaI(data);
            tablaD(data);
            datosJson=data;
            // MAPA
            var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(22.6526121, -100.1780452),
                mapTypeId: google.maps.MapTypeId.SATELLITE
            }
            var map = new google.maps.Map(document.getElementById('map-canvas'),
                                        mapOptions)
            var lugares =  new Array();
            lugares=puntosMapa(data);
            setMarkers(map,lugares);
            google.maps.event.addDomListener(window, 'load', initialize);
            // mapa
            // graficas

            $j("#ajaxProgress").hide();
        },
        error: function(data) {
            alert('error!!! ' + data.status);
            $j("#ajaxProgress").hide();
        }
    });
}

function ponerMapaEstado(){

    var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(22.6526121, -100.1780452),
                mapTypeId: google.maps.MapTypeId.SATELLITE
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'),
                                        mapOptions)
    var lugares =  new Array();
    lugares=puntosMapa(datosJson);
    setMarkers(map,lugares);
    google.maps.event.addDomListener(window, 'load', initialize);
}

function ponerMapaObra(){

    var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(22.6526121, -100.1780452),
                mapTypeId: google.maps.MapTypeId.SATELLITE
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'),
                                        mapOptions)
    var lugares =  new Array();
    lugares=puntosMapaObra(datosJson);
    setMarkers(map,lugares);
    google.maps.event.addDomListener(window, 'load', initialize);
}


function regresa(){
    $pp('#pagina').show();
    $pp('#div-grafica').removeClass("mfp-show");
    $pp('#div-grafica').addClass("mfp-hide");
}


function mostrarTablas() {

            tablaD(datosJson);
}

function graficas(){
    var tipoReporte = $j('input:radio[name=graficaTipo]:checked').val();
    var tipoGrafica = $j("#tipoGrafica").val();
    var datosGrafica = $j("#datosGrafica").val();
    var titulo="";
    var categorias = new Array();
    var datas = new Array();
    var montos = new Array()
    var Series = new Object();
    var SeriesCategorias = new Object();
    var SeriesTipeadas = new Object();

    $pp('#pagina').hide();
    $pp('#div-grafica').removeClass("mfp-hide");
    $pp('#div-grafica').addClass("mfp-show");

    if (tipoReporte=="Estado") {
        for (var i = 0; i < datosJson.reporte_por_estado.length; i++) {
            categorias.push(datosJson.reporte_por_estado[i].estado);
            datas.push(datosJson.reporte_por_estado[i].avance);
            montos.push(datosJson.reporte_por_estado[i].suma_meta);
            titulo="Total de avances por Estado";
        }
        Series=jsonSeries(datosJson,tipoReporte);
        SeriesCategorias = jsonSeriesCategorias(datosJson,tipoReporte);
        SeriesTipeadas = jsonSeriesTipeada(datosJson,tipoReporte,datosGrafica);
    }else{
        if (tipoReporte=="Carencia") {
            for (var i = 0; i < datosJson.reporte_por_carencia.length; i++) {
                categorias.push(datosJson.reporte_por_carencia[i].nombreCarencia);
                datas.push(datosJson.reporte_por_carencia[i].avance);
                montos.push(datosJson.reporte_por_carencia[i].suma_meta);
                titulo="Total de alcances por Carencia";
            }
            Series = jsonSeries(datosJson, tipoReporte);
            SeriesCategorias = jsonSeriesCategorias(datosJson, tipoReporte);
            SeriesTipeadas = jsonSeriesTipeada(datosJson, tipoReporte, datosGrafica);
        }else{
            for (var i = 0; i < datosJson.reporte_por_accion.length; i++) {
                categorias.push(datosJson.reporte_por_accion[i].nombreAccion);
                datas.push(datosJson.reporte_por_accion[i].avance);
                montos.push(datosJson.reporte_por_accion[i].suma_meta);
                titulo="Total de alcances por Acción";
            }
            Series = jsonSeries(datosJson, tipoReporte);
            SeriesCategorias = jsonSeriesCategorias(datosJson, tipoReporte);
            SeriesTipeadas = jsonSeriesTipeada(datosJson, tipoReporte, datosGrafica);

        }


    }

    Highcharts.setOptions({
        lang: {
                downloadJPEG: "Descargar imágen JPEG",
                downloadPDF: "Descargar documento PDF",
                downloadPNG: "Descargar imágen PNG",
                downloadSVG: "Descargar vector de imágen SVG",
                loading: "Cargando...",
                printChart: "Imprimir Gráfica",
                resetZoom: "Quitar zoom",
                resetZoomTitle: "Quitar el nivel de zoom ",
                numericSymbols: [' mil', ' millones']
            }
    });


    switch (tipoGrafica) {
        case "Columna3D":
            if(datosGrafica=="Numero"){
                columnaGrafica(categorias,datas,titulo,"Total de Avances");
            }else{
                columnaGrafica(categorias,montos,titulo,"Meta Total");
            }
            break;
        case "Columna2D":
            if(datosGrafica=="Numero"){
                columna2DGrafica(categorias,datas,titulo,"Total de Avances");
            }else{
                columna2DGrafica(categorias,montos,titulo,"Meta Total");
            }

            break;
        case "Pastel":
            if(datosGrafica=="Numero") {
                pieGrafica(arregloDataGrafica(datosJson, tipoReporte,datosGrafica), titulo, 0,"Total de Avances");
            }else{
                pieGrafica(arregloDataGrafica(datosJson, tipoReporte,datosGrafica), titulo, 0,"Meta Total");
            }
            break;
        case "Dona":
            if(datosGrafica=="Numero") {
                pieGrafica(arregloDataGrafica(datosJson, tipoReporte,datosGrafica), titulo, 100,"Total de Avances");
            }else{
                pieGrafica(arregloDataGrafica(datosJson, tipoReporte,datosGrafica), titulo, 100,"Meta Total");
            }
            break;
        case "Barra":
            if(datosGrafica=="Numero"){
                barraGrafica(categorias,datas,titulo,"Total de Avances","unidades"," unidad");
            }else{
                barraGrafica(categorias,montos,titulo,"Meta Total","unidades"," unidad");
            }
            break;
        case "columnaTipeada":
            if(datosGrafica=="Numero") {
                columnaTipeada(SeriesTipeadas,"Total de Avances");
            }else{
                columnaTipeada(SeriesTipeadas,"Meta Total");
            }
            break;
        case "BarraApiladaBarra":
            barrasApiladas(Series,"bar");
            break;
        case "BarraApiladaColumna":
            barrasApiladas(Series,"column");
            break;
        case "Area":
            Area(Series);
            break;
        case "Piramide":
            Piramide(SeriesCategorias);
            break;

        case "Mapa":
                //alert(JSON.parse(arregloDataMapa(datosJson)));
                graficoMapa();
            break;
        case "Lineal":

            break;
    }


    $j.tablaGrafica(datosJson);
}

function jsonSeriesTipeada(Datos,tipoReporte,datosGrafica) {
    var Series = {
        'serie': []
    };
    var arregloSimple=new Array();
    var arregloCategoria=new Array();
    var arregloTotal=new Array();
    var Data ="";

    if (tipoReporte == "Estado") {
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            if(datosGrafica=="Numero") {
                arregloSimple.push([Datos.reporte_por_estado[i].Estado, Datos.reporte_por_estado[i].avance]);
            }else{
                arregloSimple.push([Datos.reporte_por_estado[i].Estado, Datos.reporte_por_estado[i].suma_meta]);
            }
        }
        Series.serie.push({
           'name': 'Total de Avances y Metas',
           'data': arregloSimple,
           'dataLabels': {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: -50, // 10 pixels down from the top
                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        });

    } else {
        if (tipoReporte == "Carencia") {
            for (var i = 0; i < datosJson.reporte_por_carencia.length; i++) {
                if (datosGrafica == "Numero") {
                    arregloSimple.push([Datos.reporte_por_carencia[i].nombreCarencia, Datos.reporte_por_carencia[i].avance]);
                } else {
                    arregloSimple.push([Datos.reporte_por_carencia[i].nombreCarencia, Datos.reporte_por_carencia[i].suma_meta]);
                }
            }
            Series.serie.push({
                'name': 'Total de Avances y Metas',
                'data': arregloSimple,
                'dataLabels': {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: -50, // 10 pixels down from the top
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            });
        }else{
            for (var i = 0; i < datosJson.reporte_por_accion.length; i++) {
                if (datosGrafica == "Numero") {
                    arregloSimple.push([Datos.reporte_por_accion[i].nombreAccion, Datos.reporte_por_accion[i].avance]);
                } else {
                    arregloSimple.push([Datos.reporte_por_accion[i].nombreAccion, Datos.reporte_por_accion[i].suma_meta]);
                }
            }
            Series.serie.push({
                'name': 'Total de Avances y Metas',
                'data': arregloSimple,
                'dataLabels': {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: -50, // 10 pixels down from the top
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            });
        }
    }
    console.log(Series.serie[0]);
    return Series;
}

function jsonSeriesCategorias(Datos,tipoReporte) {
    var Series = {
        'serie': [],
        'categories': []
    };
    var arregloSimple=new Array();
    var arregloCategoria=new Array();
    var arregloTotal=new Array();
    var Data ="";

    if (tipoReporte == "Estado") {
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            arregloTotal.push(Datos.reporte_por_estado[i].suma_meta);
            arregloSimple.push(-1*Datos.reporte_por_estado[i].avance);
            arregloCategoria.push(Datos.reporte_por_estado[i].estado);
        }
        Series.serie.push({
           'name': 'Total de Avances',
           'data': arregloSimple
        });
        Series.serie.push({
           'name': 'Meta Total',
           'data': arregloTotal
        });
        Series.categories.push(arregloCategoria);

    } else {
        if (tipoReporte == "Carencia") {
            for (var i = 0; i < datosJson.reporte_por_carencia.length; i++) {
                arregloTotal.push(Datos.reporte_por_carencia[i].suma_meta);
                arregloSimple.push(-1 * Datos.reporte_por_carencia[i].avance);
                arregloCategoria.push(Datos.reporte_por_carencia[i].nombreCarencia);
            }
            Series.serie.push({
                'name': 'Total de Avances',
                'data': arregloSimple
            });
            Series.serie.push({
                'name': 'Meta Total',
                'data': arregloTotal
            });
            Series.categories.push(arregloCategoria);
        }else{
            for (var i = 0; i < datosJson.reporte_por_accion.length; i++) {
                arregloTotal.push(Datos.reporte_por_accion[i].suma_meta);
                arregloSimple.push(-1 * Datos.reporte_por_accion[i].avance);
                arregloCategoria.push(Datos.reporte_por_accion[i].nombreAccion);
            }
            Series.serie.push({
                'name': 'Total de Avances',
                'data': arregloSimple
            });
            Series.serie.push({
                'name': 'Meta Total',
                'data': arregloTotal
            });
            Series.categories.push(arregloCategoria);
        }
    }
    //console.log(Series.serie);
    //console.log(Series.categories[0]);
    return Series;
}

function jsonSeries(Datos,tipoReporte) {
    var Series = {
      'serie': []
    };

    if (tipoReporte=="Estado") {
        for(var i= 0;i<Datos.reporte_por_estado.length;i++){
            Series.serie.push({ 'name': Datos.reporte_por_estado[i].estado, 'data': [Datos.reporte_por_estado[i].avance,Datos.reporte_por_estado[i].suma_meta] });
        }
    }else{
        if (tipoReporte=="Carencia") {
            for (var i = 0; i < datosJson.reporte_por_carencia.length; i++) {
                Series.serie.push({
                    'name': Datos.reporte_por_carencia[i].nombreCarencia,
                    'data': [Datos.reporte_por_carencia[i].avance, Datos.reporte_por_carencia[i].suma_meta]
                });
            }
        }else{
            for (var i = 0; i < datosJson.reporte_por_accion.length; i++) {
                Series.serie.push({
                    'name': Datos.reporte_por_accion[i].nombreAccion,
                    'data': [Datos.reporte_por_accion[i].avance, Datos.reporte_por_accion[i].suma_meta]
                });
            }
        }
    }
    //console.log(Series.serie);
    return Series.serie;
}

function arregloDataGrafica(Datos,tipoReporte,datosGrafica) {
    var arregloSimple=new Array();
    var arregloDoble=new Array();
    var arregloObjeto = new Object();

    if (tipoReporte=="Estado") {
        for(var i= 0;i<Datos.reporte_por_estado.length;i++){
            var arregloSimple=new Array();
            arregloSimple.push(Datos.reporte_por_estado[i].estado);
            if(datosGrafica=="Numero") {
                arregloSimple.push(Datos.reporte_por_estado[i].avance);
            }else{
                arregloSimple.push(Datos.reporte_por_estado[i].suma_meta);
            }
            arregloDoble.push(arregloSimple);
        }
    }else{
        if (tipoReporte=="Carencia") {
            for (var i = 0; i < datosJson.reporte_por_carencia.length; i++) {
                var arregloSimple = new Array();
                arregloSimple.push(Datos.reporte_por_carencia[i].nombreCarencia);
                if (datosGrafica == "Numero") {
                    arregloSimple.push(Datos.reporte_por_carencia[i].avance);
                } else {
                    arregloSimple.push(Datos.reporte_por_carencia[i].suma_meta);
                }
                arregloDoble.push(arregloSimple);
            }
        }else{
            for (var i = 0; i < datosJson.reporte_por_accion.length; i++) {
                var arregloSimple = new Array();
                arregloSimple.push(Datos.reporte_por_accion[i].nombreAccion);
                if (datosGrafica == "Numero") {
                    arregloSimple.push(Datos.reporte_por_accion[i].avance);
                } else {
                    arregloSimple.push(Datos.reporte_por_accion[i].suma_meta);
                }
                arregloDoble.push(arregloSimple);
            }
        }
    }
    arregloObjeto = arregloDoble;
    return arregloObjeto;
}



function arregloDataMapa(Datos) {
    var arregloSimple=new Array();
    var arregloDoble=new Array();
    var arregloObjeto = new Object();

        for (var i = 0; i < datosJson.reporte_por_estado.length; i++) {
            var arregloSimple=new Array();
            arregloSimple.push("name:" +Datos.reporte_por_estado[i].estado);
            if(datosGrafica=="Numero") {
                arregloSimple.push("value:" +Datos.reporte_por_estado[i].avance);
            }else{
                arregloSimple.push("value:" +Datos.reporte_por_estado[i].inversion_aproximada);
            }
            arregloDoble.push(arregloSimple);
        }

    arregloObjeto = arregloDoble;
    return arregloObjeto;
}


function graficoMapa(){
     // Prepare demo

    var data = [
        {
            "hc-key": "mx-3622",
            "value": 0
        },
        {
            "hc-key": "mx-bc",
            "value": 1
        },
        {
            "hc-key": "mx-bs",
            "value": 2
        },
        {
            "hc-key": "mx-so",
            "value": 3
        },
        {
            "hc-key": "mx-cl",
            "value": 4
        },
        {
            "hc-key": "mx-na",
            "value": 5
        },
        {
            "hc-key": "mx-cm",
            "value": 6
        },
        {
            "hc-key": "mx-qr",
            "value": 7
        },
        {
            "hc-key": "mx-mx",
            "value": 8
        },
        {
            "hc-key": "mx-mo",
            "value": 9
        },
        {
            "hc-key": "mx-df",
            "value": 10
        },
        {
            "hc-key": "mx-qt",
            "value": 11
        },
        {
            "hc-key": "mx-tb",
            "value": 12
        },
        {
            "hc-key": "mx-cs",
            "value": 13
        },
        {
            "hc-key": "mx-nl",
            "value": 14
        },
        {
            "hc-key": "mx-si",
            "value": 15
        },
        {
            "hc-key": "mx-ch",
            "value": 16
        },
        {
            "hc-key": "mx-ve",
            "value": 17
        },
        {
            "hc-key": "mx-za",
            "value": 18
        },
        {
            "hc-key": "mx-ag",
            "value": 19
        },
        {
            "hc-key": "mx-ja",
            "value": 20
        },
        {
            "hc-key": "mx-mi",
            "value": 21
        },
        {
            "hc-key": "mx-oa",
            "value": 22
        },
        {
            "hc-key": "mx-pu",
            "value": 23
        },
        {
            "hc-key": "mx-gr",
            "value": 24
        },
        {
            "hc-key": "mx-tl",
            "value": 25
        },
        {
            "hc-key": "mx-gj",
            "value": 26
        },
        {
            "hc-key": "mx-tm",
            "value": 27
        },
        {
            "hc-key": "mx-co",
            "value": 28
        },
        {
            "hc-key": "mx-dg",
            "value": 29
        },
        {
            "hc-key": "mx-yu",
            "value": 30
        },
        {
            "hc-key": "mx-sl",
            "value": 31
        },
        {
            "hc-key": "mx-hg",
            "value": 32
        }
    ];

    // Initiate the chart
    $pp('#containerMapa').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mx/mx-all.js">Mexico</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['paises/mx/mx-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

}


function columnaTipeada(Series,titulo) {
    $pp('#containerGrafica').highcharts({
        chart: {
            type: 'column',
            zoomType: 'y',
            panning: true,
            panKey: 'shift'
        },
        title: {
            text: titulo
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '10px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: titulo
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: titulo + ' : <b>{point.y:.1f}</b>'
        },
        series: Series.serie
    });
}

function Area(Series) {
    $pp('#containerGrafica').highcharts({
        chart: {
            type: 'area',
            zoomType: 'y',
            panning: true,
            panKey: 'shift'
        },
        title: {
            text: 'Area'
        },
        xAxis: {
            categories: ['Avance', 'Meta']
        },
        credits: {
            enabled: false
        },
        series: Series
    });
}

function Piramide(Series) {
    // Age categories
    var categories = Series.categories[0];
    $(document).ready(function () {
        $pp('#containerGrafica').highcharts({
            chart: {
                type: 'bar',
                zoomType: 'y',
                panning: true,
                panKey: 'shift'
            },
            title: {
                text: 'Pirámide para Total de Avances y Meta Total'
            },
            credits: {
                enabled: false
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + '%';
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ',' + this.point.category + '</b><br/>' +
                        Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

            series: Series.serie
        });
    });

}

function barrasApiladas(series,tipo) {
    $pp('#containerGrafica').highcharts({
        chart: {
            type: tipo,
            zoomType: 'y',
            panning: true,
            panKey: 'shift'
        },
        title: {
            text: 'Barras Apiladas'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: ['Total de Avances', 'Meta Total']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total de Avances y Meta Total'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        series: series
    });
}

function columnaGrafica(categorias,datas,titulo,nombreData){


    $pp('#containerGrafica').highcharts({
        chart: {
            renderTo: 'container',
            type: 'column',
            margin: 120,
            marginLeft: 50,
            marginRight: 50,
            marginTop: 50,
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 70
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: titulo
        },

        subtitle: {
            text: ''
        },
        plotOptions: {
            column: {
                depth: 25
            },
            series: {
                pointWidth: 15
            }

        },
        xAxis: {
            categories: categorias
        },
        yAxis: {
            title: {
                text: null
            }
        },
        series: [{
            name: nombreData,
            data: datas
        }]
    });
}


function pieGrafica(datas,titulo,dona,nombreData) {

    $pp('#containerGrafica').highcharts({
        chart: {
            type: 'pie',
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: titulo
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                innerSize: dona,
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: [{
            type: 'pie',
            name: nombreData,
            data: datas
        }]
    });
}

function barraGrafica(categorias,datas,titulo,nombreData,unidades,sufijo){
    Highcharts.setOptions({
        lang: {
                numericSymbols: [unidades]
            }
    });
    $pp('#containerGrafica').highcharts({
        chart: {
            type: 'bar',
            zoomType: 'x',
            panning: true,
            panKey: 'shift'
        },
        title: {
            text: titulo
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: categorias,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: sufijo
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: nombreData,
            data: datas
        }]
    });
}

function columna2DGrafica(categorias,datas,titulo,nombreData){
    $pp('#containerGrafica').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: titulo
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: categorias,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: nombreData,
            data: datas

        }]
    });
}


$j.date = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day;

    return date;
};

function puntosMapa(Datos) {
  var arregloSimple=new Array();
  var arregloDoble=new Array();
    var arregloObjeto = new Object();
    for(var i= 0;i<Datos.reporte_general.length;i++){
        var arregloSimple=new Array();
        arregloSimple.push(Datos.reporte_general[i].accion + ", " + Datos.reporte_general[i].municipio + ", Total de Avances : " + Datos.reporte_general[i].suma_avance);
        arregloSimple.push(Datos.reporte_general[i].latitud);
        arregloSimple.push(Datos.reporte_general[i].longitud);
        arregloSimple.push(i);
        arregloDoble.push(arregloSimple);
    }
    arregloObjeto = arregloDoble;
    return arregloObjeto;
}

function puntosMapaObra(Datos) {
  var arregloSimple=new Array();
  var arregloDoble=new Array();
    var arregloObjeto = new Object();
    for(var i= 0;i<Datos.obras.length;i++){
        var arregloSimple=new Array();
        arregloSimple.push(Datos.obras[i].identificador_unico+ ", " + Datos.obras[i].estado__nombreEstado);
        arregloSimple.push(Datos.obras[i].latitud);
        arregloSimple.push(Datos.obras[i].longitud);
        arregloSimple.push(i);
        arregloDoble.push(arregloSimple);
    }
    arregloObjeto = arregloDoble;
    return arregloObjeto;
}
function setMarkers(mapa, lugares) {
  var infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < lugares.length; i++) {
    var puntos = lugares[i];
    var myLatLng = new google.maps.LatLng(puntos[1], puntos[2]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: mapa,
        icon: '../../static/assets/js/pines/pin4.png',
        title: puntos[0],
        zIndex: puntos[3]
    });

      google.maps.event.addListener(marker, 'click', (function(marker, puntos) {
        return function() {
          infowindow.setContent(puntos[0]);
          infowindow.open(mapa, marker);
        }
      })(marker, puntos));
  }
}



function tablaI(Datos){
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
                            +'<th>Acción</th>'
                            +'<th>Municipio</th>'
                            +'<th>Avance Total</th>'
                        +'</tr>'
                +'</thead>'
                +'<tbody>';
    sHtmlShorter ='<table cellspacing="1"  id="tablaIzquierda">'
                +' <colgroup>'
                +' <col width="20%">'
                +' <col width="20%">'
                +' <col width="30%">'
                +' <col width="20%">'
                +' <col width="10%">';



    sHtmlistado ='<table cellspacing="1" id="tablaListado">';
    var sHtml='<thead>'
                        +'<tr>'
                            +'<th width="30%">Carencia</th>'
                            +'<th width="40%">SubCarencia</th>'
                            +'<th width="30%">Acción</th>'
                            +'<th width="30%">Municipio</th>'
                            +'<th width="30%">Avance Total</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tfoot>'
                        +'<tr>'
                            +'<th>Carencia</th>'
                            +'<th>SubCarencia</th>'
                            +'<th>Acción</th>'
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
                    //+' </colgroup>'
                    +'<tbody>';


    sHtmlistado = sHtml;
    for(var i= 0;i<Datos.reporte_general.length;i++){
                sHtml +='<tr>'
                +'<td style="width:28%"><a href="/admin/djangoISSSTE/avancepormunicipio/' + Datos.reporte_general[i].avancePorMunicipio_id + '/change">' + Datos.reporte_general[i].carencia +'</a></td>'
                +'<td style="width:36%">' + Datos.reporte_general[i].subCarencia +'</td>'
                +'<td style="width:28%">' + Datos.reporte_general[i].accion +'</td>'
                +'<td style="width:28%">' + Datos.reporte_general[i].municipio +'</td>'
                +'<td style="width:28%">' + Datos.reporte_general[i].suma_avance +'</td>'
                +'</tr>'


        sHtmlistado +='<tr>'
                +'<td>' + Datos.reporte_general[i].carencia +'</td>'
                +'<td>' + Datos.reporte_general[i].subCarencia +'</td>'
                +'<td>' + Datos.reporte_general[i].accion +'</td>'
                +'<td>' + Datos.reporte_general[i].municipio +'</td>'
                +'<td>' + Datos.reporte_general[i].suma_avance +'</td>'
                +'</tr>'
        sHtmlExporta += '<tr>'
                +'<td>' + Datos.reporte_general[i].carencia +'</td>'
                +'<td>' + Datos.reporte_general[i].subCarencia +'</td>'
                +'<td>' + Datos.reporte_general[i].accion +'</td>'
                +'<td>' + Datos.reporte_general[i].municipio +'</td>'
                +'<td>' + Datos.reporte_general[i].suma_avance +'</td>'
                +'</tr>'
    }

        sHtml +=' </tbody>'
                +'</table>'

               /*+'<link class="ui-theme" rel="stylesheet" href="../../static/assets/tablesorter/css/jquery-ui.min.css">'
                +'<link class="theme blue" rel="stylesheet" href="../../static/assets/tablesorter/themes/blue/theme.blue.css">'
                +'<script type="text/javascript" src="../../static/assets/tablesorter/jquery.tablesorter.js"></script>'
                +'<script src="../../static/assets/tablesorter/jquery.tablesorter.widgets.js"></script>'
                +'<script type="text/javascript" src="../../static/assets/tablesorter/widget-pager.js"></script>'
                +'<script src="../../static/assets/tablesorter/widget-scroller.js"></script>' */

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
                //+'        pager_output: "{startRow:input} to {endRow} of {totalRows} rows",'
                //+'        pager_updateArrows: true,'
                //+'        pager_startPage: 0,'
                //+'        pager_size: 10,'
                //+'        pager_savePages: true,'
                //+'        pager_fixedHeight: true,'
                //+'        pager_removeRows: false,'
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
     $j('#tabla-exporta2').hide();
    $j('#datos').html(sHtmlShorter + sHtml);
    $j('#tabla-exporta2').html(sHtmlExporta);

}


// llena la tabla del lado derecho
function tablaD(Datos){
    var tipoReporte = $j('input:radio[name=tipoReporte]:checked').val();
    var dependenciasChecked="";
    var estadosChecked="";
    var sHtmlExporta="";
    var sHtmlShorter="";

    var totalAvances = 0
    var totalInversion = 0
    var tituloColumna = "";
    if (tipoReporte=="Estado") {
        tituloColumna = "Estado";
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            totalAvances += Datos.reporte_por_estado[i].avance
            totalInversion += Datos.reporte_por_estado[i].suma_meta
        }
    }else{
        if (tipoReporte=="Carencia") {
            tituloColumna = "Carencia";
            for (var i = 0; i < Datos.reporte_por_carencia.length; i++) {
                totalAvances += Datos.reporte_por_carencia[i].avance
                totalInversion += Datos.reporte_por_carencia[i].suma_meta
            }
        }else{
            tituloColumna = "Acción";
            for (var i = 0; i < Datos.reporte_por_accion.length; i++) {
                totalAvances += Datos.reporte_por_accion[i].avance
                totalInversion += Datos.reporte_por_accion[i].suma_meta
            }
        }
    }

    sHtmlExporta= '<table id="tablaExporta" class="table table-striped">'
                +' <colgroup>'
                +' <col width="40%">'
                //+' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' </colgroup> '
                +'<thead>'
                        +'<tr>'
                            +'<th>' + tituloColumna + '</th>'
                            //+'<th>Estado</th>'
                            +'<th>Avance Total</th>'
                            +'<th>Meta Total</th>'
                        +'</tr>'
                +'</thead>'
                +'<tbody>';
    sHtmlShorter ='<table cellspacing="1"  id="tablaDerecha">'
                +' <colgroup>'
                +' <col width="40%">'
                //+' <col width="20%">'
                +' <col width="20%">'
                +' <col width="20%">'
                +' </colgroup> ';
    //alert($j('input:radio[name=tipoReporte]:checked').val());

    var sHtml='<thead>'
                        +'<tr>'
                            +'<th width= "40%">' + tituloColumna + '</th>'
                           // +'<th width= "20%">Estado</th>'
                            +'<th width= "20%">Avance Total</th>'
                            +'<th width= "20%">Meta Total</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tfoot>'
                        +'<tr>'
                            //+'<th></th>'
                            +'<th>TOTALES</th>'
                            +'<th style="text-align:right;">'+ formato_numero(totalAvances, 0, '.', ',') +'</th>'
                            +'<th style="text-align:right; padding-right:10px;">'+ formato_numero(totalInversion, 0, '.', ',') +'</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerD" colspan="3">'
                        //+'<div class="first principioFLECHA" id="firstD" style="height:11px"></div>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/first.png" class="first" id="firstD"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/prev.png" class="prev" id="prevD"/>'
                        +'<span class="pagedisplay" id="displayPage"></span>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/next.png" class="next" id="nextD"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/last.png" class="last" id="lastD"/>'
                        +'<select class="pagesize" id="pagesizeD">'
                        +'<option selected="selected"  value="10">10</option>'
                        +'    <option value="20">20</option>'
                        +'    <option value="30">30</option>'
                        +'    <option  value="40">40</option>'
                        +'</select></td></tr>'

                    +'</tfoot>'
                    +'<tbody>';

    if (tipoReporte=="Estado") {
        estadosChecked="checked";
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            sHtml += '<tr>'
            //+ '<td width= "40%"></td>'
            + '<td width= "40%" align="right">' + Datos.reporte_por_estado[i].estado + '</td>'
            + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_estado[i].avance, 0, '.', ',') + '</td>'
            + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_estado[i].suma_meta, 0, '.', ',') + '</td>'
            + '</tr>'

            sHtmlExporta += '<tr>'
            //+ '<td width= "40%"></td>'
            + '<td width= "40%" align="right">' + Datos.reporte_por_estado[i].estado + '</td>'
            + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_estado[i].avance, 0, '.', ',') + '</td>'
            + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_estado[i].suma_meta, 2, '.', ',') + '</td>'
            + '</tr>'
        }
    }else{
        if (tipoReporte=="Carencia") {
            carenciasChecked="checked";
            for (var i = 0; i < Datos.reporte_por_carencia.length; i++) {
                sHtml += '<tr>'
                //+ '<td width= "40%"></td>'
                + '<td width= "40%" align="right">' + Datos.reporte_por_carencia[i].nombreCarencia + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_carencia[i].avance, 0, '.', ',') + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_carencia[i].suma_meta, 0, '.', ',') + '</td>'
                + '</tr>'

                sHtmlExporta += '<tr>'
                //+ '<td width= "40%"></td>'
                + '<td width= "40%" align="right">' + Datos.reporte_por_carencia[i].nombreCarencia + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_carencia[i].avance, 0, '.', ',') + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_carencia[i].suma_meta, 2, '.', ',') + '</td>'
                + '</tr>'
            }
        }else{
            accionesChecked="checked";
            for (var i = 0; i < Datos.reporte_por_accion.length; i++) {
                sHtml += '<tr>'
               // + '<td width= "40%"></td>'
                + '<td width= "40%" align="right">' + Datos.reporte_por_accion[i].nombreAccion + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_accion[i].avance, 0, '.', ',') + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_accion[i].suma_meta, 0, '.', ',') + '</td>'
                + '</tr>'

                sHtmlExporta += '<tr>'
                //+ '<td width= "40%"></td>'
                + '<td width= "40%" align="right">' + Datos.reporte_por_accion[i].nombreAccion + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_accion[i].avance, 0, '.', ',') + '</td>'
                + '<td width= "20%" align="right">' + formato_numero(Datos.reporte_por_accion[i].suma_meta, 2, '.', ',') + '</td>'
                + '</tr>'
            }
        }
    }



    /*if (tipoReporte=="Estado") {
        estadosChecked="checked";
        for (var i = 0; i < Datos.reporte_estado.length; i++) {
            sHtml += '<tr>'
            + '<td>' + Datos.reporte_estado[i].estado + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_visitas, 0, '.', ',') + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_apariciones_otros, 0, '.', ',') + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_apariciones_internet, 0, '.', ',') + '</td>'
            + '</tr>'

            sHtmlExporta += '<tr>'
            + '<td>' + Datos.reporte_estado[i].estado + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_visitas, 0, '.', ',') + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_apariciones_otros, 0, '.', ',') + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_estado[i].numero_apariciones_internet, 0, '.', ',') + '</td>'
            + '</tr>'
        }
    }*/

        sHtml += '<tr>'
            //+ '<td width= "40%"></td>'
            + '<td width= "40%" align="right"></td>'
            + '<td width= "20%" align="right"></td>'
            + '<td width= "20%" align="right"></td>'
            + '</tr>'
            + '</tbody>'
                +'</table>'

                //+'<fieldset>'
                //+'   <div class="row"><div class="col-xs-8">'
                //+'       Dependencia'
                //+'       </div>'
                //+'       <div class="col-xs-4">'
                //+'            <input type="radio" name="tipoReporte" value="Dependencia" ' + dependenciasChecked +'/>'   //onclick="verDatos()"
                //+'       </div>'
                //+'   </div>'
                //+'   <div class="row"><div class="col-xs-8">'
                //+'       Estado'
                //+'       </div>'
                //+'       <div class="col-xs-4">'
                //+'            <article id="ver_tablas">'
                //+'            <input type="radio" name="tipoReporte" value="Estado" ' + estadosChecked +'/>'
                //+'       </article>'
                //+'            <input type="radio" name="tipoReporte" value="Estado" ' + estadosChecked +'/>'
                //+'       </div>'
                //+'   </div>'
                //+'   <div class="row"><div class="col-xs-8">'
                //+'       RCI'
                //+'       </div>'
                //+'       <div class="col-xs-4">'
                //+'            <input type="radio" name="tipoReporte" value="RCI" "/>'
               // +'       </div>'
               // +'   </div>'
               // +'</fieldset>'



               /*+'<link class="ui-theme" rel="stylesheet" href="../../static/assets/tablesorter/css/jquery-ui.min.css">'
                +'<link class="theme blue" rel="stylesheet" href="../../static/assets/tablesorter/themes/blue/theme.blue.css">'
                +'<script type="text/javascript" src="../../static/assets/tablesorter/jquery.tablesorter.js"></script>'
                +'<script src="../../static/assets/tablesorter/jquery.tablesorter.widgets.js"></script>'
                +'<script type="text/javascript" src="../../static/assets/tablesorter/widget-pager.js"></script>'
                +'<script src="../../static/assets/tablesorter/widget-scroller.js"></script>' */

                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaDerecha").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager", "scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 120,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'          pager_selectors: {'
                +'                container   : "#pagerD",'
                +'                first       : "#firstD",'
                +'                prev        : "#prevD",'
                +'                next        : "#nextD",'
                +'                last        : "#lastD",'
                +'                gotoPage    : "#gotoPageD",'
                +'                pagedisplay : "#displayPage",'
                +'                pageSize    : "#pagesizeD"'
                +'        }'
                +'    }'
                 +'});'
                +'});'
                +'</script>';

    sHtmlExporta +='</tbody>'
                +'</table>';

    $j('#tabla-exporta').hide();
    $j('#datostablaDerecha').html(sHtmlShorter + sHtml);
    $j('#tabla-exporta').html(sHtmlExporta);

}

// llena la tabla del lado derecho

$j.tablaGrafica = function(Datos){
    var tipoReporte = $j('input:radio[name=graficaTipo]:checked').val();
    var dependenciasChecked="";
    var estadosChecked="";

    var totalAvances = 0
    var totalInversion = 0
    var tituloColumna="";
    if (tipoReporte=="Estado") {
        tituloColumna="Estado";
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            totalAvances += Datos.reporte_por_estado[i].avance
            totalInversion += Datos.reporte_por_estado[i].suma_meta
        }
    }else{
        if (tipoReporte=="Carencia") {
            tituloColumna="Carencia";
            for (var i = 0; i < Datos.reporte_por_carencia.length; i++) {
                totalAvances += Datos.reporte_por_carencia[i].avance
                totalInversion += Datos.reporte_por_carencia[i].suma_meta
            }
        }else{
            tituloColumna="Acción";
           for (var i = 0; i < Datos.reporte_por_accion.length; i++) {
                totalAvances += Datos.reporte_por_accion[i].avance
                totalInversion += Datos.reporte_por_accion[i].suma_meta
            }
        }
    }
    //alert($j('input:radio[name=tipoReporte]:checked').val());
    var sHtml= '<div class="row tituloFiltros">'
                    + '<div class="col-md-6">'
                    +     'Reporte'
                   + ' </div>'
               + '</div>'
                    +'<table cellspacing="1"   id="tablaGrafica">'
                    +'<thead>'
                        +'<tr>'
                            //+'<th>Carencia</th>'
                            +'<th>' + tituloColumna +'</th>'
                            +'<th>Avances</th>'
                            +'<th>Meta</th>'
                        +'</tr>'
                    +'</thead>'
                    +'<tfoot>'
                        +'<tr>'
                            //+'<th></th>'
                            +'<th>TOTALES</th>'
                            +'<th style="text-align:right;">'+ formato_numero(totalAvances, 0, '.', ',') +'</th>'
                            +'<th style="text-align:right; padding-right:10px;">'+ formato_numero(totalInversion, 0, '.', ',') +'</th>'
                        +'</tr>'

                        +'<tr><td class="pager" id="pagerG" colspan="3">'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/first.png" class="first" id="firstG"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/prev.png" class="prev" id="prevG"/>'
                        +'<span class="pagedisplay" id="displayPageG"></span>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/next.png" class="next" id="nextG"/>'
                        +'<img src="../../static/assets/tablesorter/addons/pager/icons/last.png" class="last" id="lastG"/>'
                        +'<select class="pagesize" id="pagesizeG">'
                        +'<option selected="selected"  value="10">10</option>'
                        +'    <option value="20">20</option>'
                        +'    <option value="30">30</option>'
                        +'    <option  value="40">40</option>'
                        +'</select></td></tr>'

                    +'</tfoot>'
                    +'<tbody>';

    if (tipoReporte=="Estado") {
        estadosChecked="checked";
        for (var i = 0; i < Datos.reporte_por_estado.length; i++) {
            sHtml += '<tr>'
            //+ '<td>' + Datos.reporte_por_estado[i].carencia + '</td>'
            + '<td align="right">' + Datos.reporte_por_estado[i].estado + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_por_estado[i].avance, 0, '.', ',') + '</td>'
            + '<td align="right">' + formato_numero(Datos.reporte_por_estado[i].suma_meta, 0, '.', ',') + '</td>'
            + '</tr>'
        }
    }else{
        if (tipoReporte=="Carencia") {
            estadosChecked="checked";
            for (var i = 0; i < Datos.reporte_por_carencia.length; i++) {
                sHtml += '<tr>'
                //+ '<td></td>'
                + '<td align="right">' + Datos.reporte_por_carencia[i].nombreCarencia + '</td>'
                + '<td align="right">' + formato_numero(Datos.reporte_por_carencia[i].avance, 0, '.', ',') + '</td>'
                + '<td align="right">' + formato_numero(Datos.reporte_por_carencia[i].suma_meta, 0, '.', ',') + '</td>'
                + '</tr>'
            }
        }else{
            estadosChecked="checked";
            for (var i = 0; i < Datos.reporte_por_accion.length; i++) {
                sHtml += '<tr>'
                //+ '<td></td>'
                + '<td align="right">' + Datos.reporte_por_accion[i].nombreAccion + '</td>'
                + '<td align="right">' + formato_numero(Datos.reporte_por_accion[i].avance, 0, '.', ',') + '</td>'
                + '<td align="right">' + formato_numero(Datos.reporte_por_accion[i].suma_meta, 0, '.', ',') + '</td>'
                + '</tr>'
            }
        }
    }

        sHtml +='</tbody>'
                +'</table>'

                +'<script id="js" type="text/javascript">'
                +'$ts(function() {'
                +'    $ts("#tablaGrafica").tablesorter({'
                +'    theme: "blue",'
                +'    showProcessing: true,'
                +'    headerTemplate : "{content} {icon}",'
                +'    widgets: [ "uitheme", "zebra", "pager","scroller" ],'
                +'    widgetOptions : {'
                +'        scroller_height : 95,'
                +'        scroller_upAfterSort: true,'
                +'        scroller_jumpToHeader: true,'
                +'        scroller_barWidth : null,'
                +'          pager_selectors: {'
                +'                container   : "#pagerG",'
                +'                first       : "#firstG",'
                +'                prev        : "#prevG",'
                +'                next        : "#nextG",'
                +'                last        : "#lastG",'
                +'                gotoPage    : "#gotoPageG",'
                +'                pagedisplay : "#displayPageG",'
                +'                pageSize    : "#pagesizeG"'
                +'        }'
                +'    }'
                +'});'
                +'});'
                +'</script>';

        $j('#divTablaGrafica').html($j(sHtml));

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
        var fecha =year + "-" + month + "-" + day;

        return fecha;
}






/**
 *
 * filtrado de estados dependiendo de la region
 * filtrado de municipio y distrito electoral dependiendo del estado
 *
 */

$l(function() {
    $l('#msCarencias').bind('change', function () {

        var carenciaId = $l("#msCarencias").multiselect("getChecked").map(function(){return this.value;}).get();
        if (carenciaId != null) {
            getSubcarenciasForCarencia(carenciaId, function (ans) {
                populateSubCarenciasSelect(ans);
            });
        }
    });

    $l('#msEstados').on('change', function () {
        var estadoId = $l(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();

        getMunicipiosForEstado(estadoId, function (ans) {
            populateMunicpiosSelect(ans);
        });
        getDistritosForEstado(estadoId, function (ans) {

            populateDistritosSelect(ans);

        });
    });

    $l('#msSubCarencias').on('change', function () {
        var subcarencias = $l(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();

        getAccionesForSubCarencias(subcarencias, function (ans) {
            populateAccionesSelect(ans);
        });

    });
});

function getAccionesForSubCarencias(subcarenciasId, onSuccess) {
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

        var ajaxData = { access_token: ans.access_token, subcarencias: subcarenciasId.toString() };

        $j.ajax({
            url: '/issste/api/acciones_por_subcarencia',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}

// PARA CARGA DE SUBCARENCIA POR CARENCIA SELECCIONADA
function getSubcarenciasForCarencia(carenciaId, onSuccess) {
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

        var ajaxData = { access_token: ans.access_token, carencias: carenciaId.toString() };

        $j.ajax({
            url: '/issste/api/subcarencias_por_carencia',
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

        var ajaxData = { access_token: ans.access_token, estados: estadoId.toString() };

        $j.ajax({
            url: '/issste/api/municipios_por_estado',
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
        var ajaxData = { access_token: ans.access_token, estados: estadoId.toString() };

        $j.ajax({
            url: '/api/distritos_electorales',
            type: 'get',
            data: ajaxData,
            success: onSuccess
        });
    });
}

// Once we're done filtering, we just put the results where they belong
function populateAccionesSelect(acciones) {
    // Clean the field
    clearAcciones();
    var sHtml='<select id="msAcciones" multiple="multiple" style="width: 100%;height: auto;">';

    for(var i= 0;i<acciones.length;i++) {
       sHtml= sHtml +'<option value='+ acciones[i].id +'>' + acciones[i].nombreAccion +'</option>';
    }
    sHtml= sHtml +'</select>';

    $l('#msAcciones').html(sHtml);

    $l("#msAcciones").multiselect({
       header: true,
       checkAllText: 'Marcar todas', uncheckAllText: 'Desmarcar todas',
       noneSelectedText: 'Acción',
       selectedText: '# Acciones'
   });
}

function populateSubCarenciasSelect(subcarencias) {
    // Clean the field
    clearSubCarencias();
    var sHtml='<select id="msSubCarencias" multiple="multiple" style="width: 100%;height: auto;">';
    for(var i= 0;i<subcarencias.length;i++) {
       sHtml= sHtml +'<option value='+ subcarencias[i].id +'>' + subcarencias[i].nombreSubCarencia +'</option>';
    }
    sHtml= sHtml +'</select>';

    $l('#msSubCarencias').html(sHtml);

    $l("#msSubCarencias").multiselect({
       header: true,
       checkAllText: 'Marcar todas', uncheckAllText: 'Desmarcar todas',
       noneSelectedText: 'SubCarencia',
       selectedText: '# SubCarencias'
   });
}

function populateMunicpiosSelect(municipios) {
    // Clean the field
    clearMunicipios();

    var sHtml='<select id="msMunicipios" multiple="multiple" style="width: 100%;height: auto;">';
    for(var i= 0;i<municipios.length;i++) {
       sHtml= sHtml +'<option value='+ municipios[i].id +'>' + municipios[i].nombreMunicipio +'</option>';
    }
    sHtml= sHtml +'</select>';

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

    var sHtml='<select id="msDistritos" multiple="multiple" style="width: 100%;height: auto;">';
    for(var i= 0;i<distritos.length;i++) {
       sHtml= sHtml +'<option value='+ distritos[i].id +'>' + distritos[i].nombre_distrito_electoral +'</option>';
    }
    sHtml= sHtml +'</select>';

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

function clearSubCarencias() {
    $l('#msSubCarencias').html('');
    $l('#msSubCarencias').multiselect('destroy');

}
function clearMunicipios() {
    $l('#msMunicipios').html('');
    $l('#msMunicipios').multiselect('destroy');
}

function clearDistritoElectoral() {
    $l('#msDistritos').html('');
    $l('#msDistritos').multiselect('destroy');
}

function clearAcciones() {
    $l('#msAcciones').html('');
    $l('#msAcciones').multiselect('destroy');

}


