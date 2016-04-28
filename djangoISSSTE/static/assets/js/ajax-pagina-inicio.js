/**
 * Created by usuario on 30/04/2015.
 */
/**
 * Created by db2 on 7/04/15.
 */
var $j = jQuery.noConflict();
$j(document).on('ready', main_consulta);

var datosJson;

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
    verDatos();

}




function verDatos() {


    $.get("/visitas/register-by-token", function(respu) {
        var ajax_data = {
            "access_token": respu.access_token
        };

        $j.ajax({
            url: '/api/Inicio',
            type: 'get',
            data: ajax_data,
            success: function (data) {
                datosJson = data;

                graficas();
                datosConcluidas();

                // MAPA
                var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(22.6526121, -100.1780452),
                mapTypeId: google.maps.MapTypeId.HYBRID,
                styles:[
                    {
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ]
                }


                var map = new google.maps.Map(document.getElementById('mapaVISITAS'),
                                            mapOptions)
                var lugares =  new Array();
                lugares=puntosMapaTotales(datosJson);
                setMarkers(map,lugares);
                google.maps.event.addDomListener(window, 'load', initialize);
                // mapa

            },
            error: function (data) {
                alert('error!!! ' + data.status);
            }
        });
    });
}



function datosConcluidas() {
    for (i=0;i<5;i++){
       if (datosJson.medios[i].total_apariciones == null){
           datosJson.medios[i].total_apariciones=0;
       }
    }


    $j('#medioTV').html(formato_numero(datosJson.medios[0].total_apariciones, 0, '.', ','));
    $j('#medioRadio').html(formato_numero(datosJson.medios[1].total_apariciones, 0, '.', ','));
    $j('#medioPeriodico').html(formato_numero(datosJson.medios[3].total_apariciones, 0, '.', ','));
    $j('#medioInternet').html(formato_numero(datosJson.medios[2].total_apariciones, 0, '.', ','));
    $j('#medioRevistas').html(formato_numero(datosJson.medios[4].total_apariciones, 0, '.', ','));

}

function graficas(){

    titulo="Visitas por Estado";


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



    pieGrafica(arregloDataGrafica(datosJson), titulo, 0,"Número de Visitas");

}


function arregloDataGrafica(Datos) {
    var arregloSimple=new Array();
    var arregloDoble=new Array();
    var arregloObjeto = new Object();


    for(var i= 0;i<Datos.estados.length;i++) {
        var arregloSimple2 = new Array();
        arregloSimple2.push(Datos.estados[i].estado.nombreEstado);
        arregloSimple2.push(Datos.estados[i].total_visitas);
        arregloSimple2.push(Datos.estados[i].total_visitas);
        arregloDoble.push(arregloSimple2);
    }


    arregloObjeto = arregloDoble;
    return arregloObjeto;
}


function pieGrafica(datas,titulo,dona,nombreData) {

    var myComments=["First input","second comment","another comment","last comment"]
    $j('#anioVISITAS').highcharts({
        chart: {
            type: 'pie',
            zoomType: 'x',
            panning: true,
            panKey: 'shift',
            options3d: {
                enabled: true,
                alpha: 35,
                beta: 0
            },
            style: {
                 color: '#FFFFFF',
                 fontFamily: 'Verdana, Geneva, sans-serif',
                 fontSize: '8px'
            }
        },
        title: {
            style: {
                 color: '#FFFFFF',
                 fontFamily: 'Verdana, Geneva, sans-serif'
            },
            text: titulo
        },
        credits: {
            enabled: false
        },
        tooltip: {
            style: { fontFamily: 'Verdana, Geneva, sans-serif', fontSize: '15px' },
            pointFormat: 'Número de visitas: <b>{point.y}</b><br>Porcentaje del Total: <b>{point.percentage:.2f}%</b>'

            //    var comment = myComments[serieI];


        },
        plotOptions: {
            pie: {
                style: { fontFamily: 'Verdana, Geneva, sans-serif',color: '#FFFFFF' ,fontSize: '8px' },
                innerSize: dona,
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    style: { fontFamily: 'Verdana, Geneva, sans-serif',color: '#FFFFFF' ,fontSize: '8px' },
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
    for(var i= 0;i<Datos.estados.length;i++){
        var arregloSimple=new Array();
        arregloSimple.push(Datos.estados[i].estado.nombreEstado + ", númerp de visitas : " + Datos.estados[i].total_visitas);
        arregloSimple.push(Datos.estados[i].estado.latitud);
        arregloSimple.push(Datos.estados[i].estado.longitud);
        arregloSimple.push(i);
        arregloDoble.push(arregloSimple);
    }



    arregloObjeto = arregloDoble;
    return arregloObjeto;
}

function puntosMapaTotales(Datos) {
    var arregloSimple = new Array();
    var arregloDoble = new Array();
    var arregloObjeto = new Object();
    for (var i = 0; i < Datos.estados.length; i++) {
        var arregloSimple = new Array();
        arregloSimple.push(Datos.estados[i].estado.nombreEstado + ", " + Datos.estados[i].total_visitas + " Visitas, ");
        arregloSimple.push(Datos.estados[i].estado.latitud);
        arregloSimple.push(Datos.estados[i].estado.longitud);
        arregloSimple.push(i);
        arregloDoble.push(arregloSimple);
    }
    arregloObjeto = arregloDoble;
    return arregloObjeto;

}

function setMarkers(mapa, lugares) {


  var image = {
    url: '../../static/assets/js/pines/pin.png',
    size: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0,32)};

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


function formato_numero(numero, decimales, separador_decimal, separador_miles){
    numero=parseFloat(numero);
    if(isNaN(numero)){
        return "";
    }

    if(decimales!==undefined){
        // Redondeamos
        numero=numero.toFixed(decimales);
    }

    // Convertimos el punto en separador_decimal
    numero=numero.toString().replace(".", separador_decimal!==undefined ? separador_decimal : ",");

    if(separador_miles){
        // Añadimos los separadores de miles
        var miles=new RegExp("(-?[0-9]+)([0-9]{3})");
        while(miles.test(numero)) {
            numero=numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}