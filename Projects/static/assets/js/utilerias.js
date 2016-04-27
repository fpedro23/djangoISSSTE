/**
 * 
 */

    

var num = 50; //number of pixels before modifying styles
var $nums=jQuery.noConflict();
$nums(window).bind('scroll', function () {
    if ($nums(window).scrollTop() > 50) {
        $nums('.busca').addClass('fixed');
    } else {
        $nums('.busca').removeClass('fixed');
    }
});


$nums(document).ready(function() {
    
    $nums('#inversionInicial').numeric({ decimalPlaces: 2 });
    $nums('#inversionFinal').numeric({ decimalPlaces: 2 });
    $nums('#id_totalBeneficiarios').numeric({ decimal: false });
    $nums('#id_inversionTotal').numeric({ decimalPlaces: 2 });
    $nums('#id_montoRegistroHacendario').numeric({ decimalPlaces: 2 });
    $nums('#id_porcentajeAvance').numeric({ decimalPlaces: 2 , negative:false });
    $nums('#id_latitud').numeric({ decimalPlaces: 10 });
    $nums('#id_longitud').numeric({ decimalPlaces: 10 });
    $nums('#id_detalleinversion_set-__prefix__-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-0-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-1-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-2-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-3-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-4-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-5-monto').numeric({ decimalPlaces: 2 });
    $nums('#id_detalleinversion_set-6-monto').numeric({ decimalPlaces: 2 });

    $nums(".numeric").numeric();
	$nums(".integer").numeric(false, function() { alert("Integers only"); this.value = ""; this.focus(); });
	$nums(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	$nums(".positive-integer").numeric({ decimal: false, negative: false }, function() { alert("Positive integers only"); this.value = ""; this.focus(); });
    
	$nums("#remove").click(
		function(e)
		{
			e.preventDefault();
			$nums(".numeric,.integer,.positive,.positive-integer,.decimal-2-places").removeNumeric();
		}
	);
    
    
});


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