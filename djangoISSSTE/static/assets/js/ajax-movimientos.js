var $j = jQuery.noConflict();
$j(document).on('ready', main_consulta);

var datosJson;
var newToken
var spanA;
var htmlA;
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
               // alert($j('[name="csrfmiddlewaretoken"]').val());
			}
            if(settings.type == "GET"){
				xhr.setRequestHeader("X-CSRFToken", $j('[name="csrfmiddlewaretoken"]').val());
               //  alert($j('[name="csrfmiddlewaretoken"]').val());
			}
		}
	});

    $j('#historialICO').on('click', verHistoria);
	$j('#buscarICO').on('click', verDatos);
    $j('#id_dependencia').on('change', setImage);
    $j('#imprimirBTN').on('click', imprimeFicha);
    //valida_token();
    $.get("/obras/register-by-token", function(respu) {
        newToken=respu.access_token;
        setImage();
    });

}

function imprimeFicha(){
    if ($j('#idobraUNICO').val() != null && $j('#idobraUNICO').val() !="")
    {
        location.href="/obras/ficha?identificador_unico="+ $j.trim($j('#idobraUNICO').val().toString());
    };

}


function verDatos() {
    var idUnico = $j("#idobra").val();



    var ajax_data = {
      "access_token"  : newToken
    };

    if(idUnico.toString()!=""){ajax_data.identificador_unico=idUnico.toString();}


    $j.ajax({
        url: '/obras/api/id_unico',
        type: 'get',
        data: ajax_data,
        success: function(data) {
            //$j('#datos').html
           //alert('success!!! ' + data.id);
            if (data.id!=null && data.error == null){location.href='/admin/obras/obra/'+data.id+'/?m=1';
            }
            else {
                //alert('No existen registros con el ID Único ' + idUnico);
                    $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + data.error
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });
            }

        },
        error: function(data) {
            alert('error!! ' + data.status);
        }
    });
}

function verHistoria() {
    var idUnicoH = $j("#idobraUNICO").val();
    var idUnicoHist = idUnicoH.trim();

    var ajax_data = {
      "access_token"  : newToken
    };


    if(idUnicoHist.toString()!=""){ajax_data.identificador_unico=idUnicoHist.toString();}


    $j.ajax({
        url: '/obras/api/id_unico',
        type: 'get',
        data: ajax_data,
        success: function(data) {


            if (data.id!=null){location.href='/admin/obras/obra/'+data.id+'/history';
            }
            else {
                //alert('No existen registros con el ID Único ' + idUnico);
                    $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'No existe historial del ID Único: ' + idUnicoHist
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });
            }

        },
        error: function(data) {
            alert('error!! ' + data.status);
        }
    });
}

function setImage(){
            var idDep = $j("#id_dependencia").val();
            var sHtml="";

            var ajax_data = {"access_token"  : newToken};

            if(idDep.toString()!=""){ajax_data.id=idDep.toString();}


            $j.ajax({
                url: '/obras/api/dependencia_imagen',
                type: 'get',
                data: ajax_data,
                success: function(data) {
                    sHtml= '<img src="' + data[0].dependencia.imagenDependencia.toString() +'" width="210px" height="85px">'
                    $j('#logoDEP').html(sHtml);

                },
                error: function(data) {
                     console.log('Error ' + data.status);
                    /*     $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'Error ' + data.status
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });*/
                }
            });
        }


    var normalize = (function() {
          var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
              to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
              mapping = {};

          for(var i = 0, j = from.length; i < j; i++ )
              mapping[ from.charAt( i ) ] = to.charAt( i );

          return function( str ) {
              var ret = [];
              for( var i = 0, j = str.length; i < j; i++ ) {
                  var c = str.charAt( i );
                  if( mapping.hasOwnProperty( str.charAt( i ) ) )
                      ret.push( mapping[ c ] );
                  else
                      ret.push( c );
              }
              return ret.join( '' );
          }

    })();

    $j(document).on('click',"a", function () {
             spanA = $j(this);
             htmlA = spanA.html();
             //alert(htmlA);

    });

    $j(document).on('change',"input[type=file]", function () {
            var nomarc =$j(this).val();
            var input = $j(this);
            var $jel = $j(this);

            if(/^[:_.\\a-zA-Z0-9- ]*$/.test(nomarc) == false) {

                    $jel.wrap('<form>').closest('form').get(0).reset();
                    $jel.unwrap();
                    spanA.html(htmlA);
                    //lert(spanA.html());


                   $j.magnificPopup.open({
                       items: {
                           src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                 + '<div class="textoALERTA">'
                                 + 'El nombre del archivo no debe tener acentos ni caracteres especiales'
                                 + '</div>'
                                 + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                 + '</div>'
                       },
                       type: 'inline',
                       preloader: true,
                       modal: true });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                       e.preventDefault();
                       $j.magnificPopup.close();
                       });


                }
        });


    $j(document).ready(function() {
         /*$j( "a" ).click(function() {
             spanA = $j(this);
             htmlA = spanA.html();
             alert(htmlA);
         });*/

         $j("input[type=text]").keyup(function () {
             $j(this).val($j(this).val().toUpperCase());

         });

        $j("textarea").keyup(function () {
             $j(this).val($j(this).val().toUpperCase());

         });

        $j("#id_totalBeneficiarios").on('input',function(){
            if( $j(this).val().length>9) {
                 $j(this).val($j(this).val().slice(0,9));
            }
        });

         $j("input[name=inaugurada]").click(function () {
            var inauguradaOPC  = $j('input:radio[name=inaugurada]:checked').val();
             if (inauguradaOPC != "True") {
                 $j("#id_inaugurador").val('---------');
                 $j("#id_inaugurador").prop('disabled','disabled');
             }
             else{
                  $j("#id_inaugurador").removeAttr("disabled");
             }

         });


         $j('select#id_tipoObra').on('change',function () {
                var statusO = $j(this).val();
                var avanceO = $j("#id_porcentajeAvance").val();

                if (statusO == "1" && avanceO > 0) {
                    //alert('Si el Status de Obra es PROYECTADA, el porcentaje de Avance debe ser igual a 0. Favor de verificar el Status.');
                      $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'Si el Status de Obra es PROYECTADA, el porcentaje de Avance debe ser igual a 0. Favor de verificar el Status.'
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });

                    $j("#id_tipoObra").val('---------');
                }
                else if (statusO == "2" && (avanceO == 0 || avanceO == 100))
                {
                    //alert('Si el Status de Obra es en PROCESO, el porcentaje de Avance debe ser mayor a 0 y menor a 100. Favor de verificar el Status.');
                    $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'Si el Status de Obra es en PROCESO, el porcentaje de Avance debe ser mayor a 0 y menor a 100. Favor de verificar el Status.'
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });

                    $j("#id_tipoObra").val('---------');
                }
                else if (statusO == "3" && avanceO <100)
                {
                    //alert('Si el Status de Obra es CONCLUIDA, el porcentaje de Avance debe ser igual a 100. Favor de verificar el Status.');
                    $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'Si el Status de Obra es CONCLUIDA, el porcentaje de Avance debe ser igual a 100. Favor de verificar el Status.'
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });

                    $j("#id_tipoObra").val('---------');
                }

                if ($j('#id_fechaInicio').val() != '') {
                     var VSDate = new Date($dp('#id_fechaInicio').datepicker("getDate"));
                }
                else {
                    var VSDate = "";
                }
                if ($j('#id_fechaTermino').val() != '') {
                    var VEDate = new Date($dp('#id_fechaTermino').datepicker("getDate"));
                }
                else{
                    var VEDate ="";
                }
                var VToday = new Date();

                if(statusO == '1'){

                    if (VSDate !='' && VSDate < VToday){
                        $j('select#id_tipoObra').val('---------');
                                        $j.magnificPopup.open({
                                                items: {
                                                    src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                                          + '<div class="textoALERTA">'
                                                          +  'El Status de la obra debe ser en PROCESO  y el Avance mayor a 0'
                                                          + '</div>'
                                                          + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                                          + '</div>'
                                                },
                                                type: 'inline',
                                                preloader: true,
                                                modal: true
                                            });

                                            $j(document).on('click', '.popup-modal-dismiss', function (e) {
                                                e.preventDefault();
                                                $j.magnificPopup.close();
                                            });
                    }
                    if (VSDate !='' && VEDate !='' && VSDate < VToday && VEDate > VToday){
                        $j('select#id_tipoObra').val('---------');
                                        $j.magnificPopup.open({
                                                items: {
                                                    src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                                          + '<div class="textoALERTA">'
                                                          +  'El Status de la obra debe ser en PROCESO  y el Avance mayor a 0'
                                                          + '</div>'
                                                          + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                                          + '</div>'
                                                },
                                                type: 'inline',
                                                preloader: true,
                                                modal: true
                                            });

                                            $j(document).on('click', '.popup-modal-dismiss', function (e) {
                                                e.preventDefault();
                                                $j.magnificPopup.close();
                                            });
                    }
                    if (VSDate !="" && VEDate !="" && VSDate < VToday && VEDate < VToday) {
                        $j('select#id_tipoObra').val('---------');
                                        $j.magnificPopup.open({
                                                items: {
                                                    src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                                          + '<div class="textoALERTA">'
                                                          +  'El Status de la obra debe ser en CONCLUIDA  y el Avance igual a 100'
                                                          + '</div>'
                                                          + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                                          + '</div>'
                                                },
                                                type: 'inline',
                                                preloader: true,
                                                modal: true
                                            });

                                            $j(document).on('click', '.popup-modal-dismiss', function (e) {
                                                e.preventDefault();
                                                $j.magnificPopup.close();
                                            });
                    }
                }
                if(statusO == '2') {
                    if (VSDate !="" && VSDate > VToday) {
                        $j('select#id_tipoObra').val('---------');
                        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                + '<div class="textoALERTA">'
                                + 'El Status de la obra debe ser PROYECTADA  y el Avance igual a 0'
                                + '</div>'
                                + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                + '</div>'
                            },
                            type: 'inline',
                            preloader: true,
                            modal: true
                        });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                            e.preventDefault();
                            $j.magnificPopup.close();
                        });
                    }


                    if (VEDate !="" && VEDate < VToday){
                        $j('select#id_tipoObra').val('---------');
                                        $j.magnificPopup.open({
                                                items: {
                                                    src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                                          + '<div class="textoALERTA">'
                                                          +  'El Status de la obra debe ser CONCLUIDA  y el Avance igual a 100'
                                                          + '</div>'
                                                          + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                                          + '</div>'
                                                },
                                                type: 'inline',
                                                preloader: true,
                                                modal: true
                                            });

                                            $j(document).on('click', '.popup-modal-dismiss', function (e) {
                                                e.preventDefault();
                                                $j.magnificPopup.close();
                                            });
                    }
                }
                if(statusO == '3'){
                    if (VEDate !="" && VEDate > VToday){
                        $j('select#id_tipoObra').val('---------');
                                        $j.magnificPopup.open({
                                                items: {
                                                    src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                                          + '<div class="textoALERTA">'
                                                          +  'El Status de la obra debe ser en PROCESO  y el Avance mayor a 0'
                                                          + '</div>'
                                                          + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                                          + '</div>'
                                                },
                                                type: 'inline',
                                                preloader: true,
                                                modal: true
                                            });

                                            $j(document).on('click', '.popup-modal-dismiss', function (e) {
                                                e.preventDefault();
                                                $j.magnificPopup.close();
                                            });
                    }
                }
         });

         $j('#id_porcentajeAvance').on('change',function (){
                var avanceO = $j(this).val();
                var statusO = $j('select#id_tipoObra').val();
                if (avanceO > 100) {
                     $j.magnificPopup.open({
                        items: {
                            src:  '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                  + '<div class="textoALERTA">'
                                  + 'El porcentaje de Avance debe estar entre 0 y 100. Favor de verificar.'
                                  + '</div>'
                                  + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                  + '</div>'
                        },
                        type: 'inline',
                        preloader: true,
                        modal: true
                    });

                    $j(document).on('click', '.popup-modal-dismiss', function (e) {
                        e.preventDefault();
                        $j.magnificPopup.close();
                    });

                    $j("#id_porcentajeAvance").val('0');
                }
                else {
                    if (statusO == "1" && avanceO > 0) {
                        //alert('Si el Status de Obra es PROYECTADA, el porcentaje de Avance debe ser igual a 0. Favor de verificar el Status.');
                        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                + '<div class="textoALERTA">'
                                + 'Si el Status de Obra es PROYECTADA, el porcentaje de Avance debe ser igual a 0. Favor de verificar el Status.'
                                + '</div>'
                                + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                + '</div>'
                            },
                            type: 'inline',
                            preloader: true,
                            modal: true
                        });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                            e.preventDefault();
                            $j.magnificPopup.close();
                        });

                        $j("#id_porcentajeAvance").val('0');
                    }
                    else if (statusO == "2" && (avanceO == 0 || avanceO == 100)) {
                        //alert('Si el Status de Obra es en PROCESO, el porcentaje de Avance debe ser mayor a 0 y menor a 100. Favor de verificar el Status.');
                        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                + '<div class="textoALERTA">'
                                + 'Si el Status de Obra es en PROCESO, el porcentaje de Avance debe ser mayor a 0 y menor a 100. Favor de verificar el Status.'
                                + '</div>'
                                + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                + '</div>'
                            },
                            type: 'inline',
                            preloader: true,
                            modal: true
                        });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                            e.preventDefault();
                            $j.magnificPopup.close();
                        });

                        $j("#id_porcentajeAvance").val('0');
                    }
                    else if (statusO == "3" && avanceO < 100) {
                        //alert('Si el Status de Obra es CONCLUIDA, el porcentaje de Avance debe ser igual a 100. Favor de verificar el Status.');
                        $j.magnificPopup.open({
                            items: {
                                src: '<div id="test-modal" class="alertaVENTANA" style="top:0px; left: 450px;">'
                                + '<div class="textoALERTA">'
                                + 'Si el Status de Obra es CONCLUIDA, el porcentaje de Avance debe ser igual a 100. Favor de verificar el Status.'
                                + '</div>'
                                + '<a class="popup-modal-dismiss" href="#"><div class="aceptarBTN" style="left:150px;"> </div></a>'
                                + '</div>'
                            },
                            type: 'inline',
                            preloader: true,
                            modal: true
                        });

                        $j(document).on('click', '.popup-modal-dismiss', function (e) {
                            e.preventDefault();
                            $j.magnificPopup.close();
                        });

                        $j("#id_porcentajeAvance").val('100');
                    }
                }
         });

        $j("select#id_detalleclasificacion_set-0-tipoClasificacion").on("change",function(){
           var sCla = $j(this).val();

            if (sCla=='6'){
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if(sCla=='4' || sCla=='3' || sCla=='2'){

                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else{
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });

        $j("select#id_detalleclasificacion_set-1-tipoClasificacion").on("change",function(){
            var sCla = $j(this).val();
            if (sCla=='6'){
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled','disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if(sCla=='4' || sCla=='3' || sCla=='2'){

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else{
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled',false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                        $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                        $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });

        $j("select#id_detalleclasificacion_set-2-tipoClasificacion").on("change",function() {
            var sCla = $j(this).val();
            if (sCla == '6') {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if (sCla == '4' || sCla == '3' || sCla == '2') {

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + sCla + "']").hide();

                    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });

        $j("select#id_detalleclasificacion_set-3-tipoClasificacion").on("change",function() {
            var sCla = $j(this).val();
            if (sCla == '6') {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if (sCla == '4' || sCla == '3' || sCla == '2') {

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + sCla + "']").hide();

                    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });

        $j("select#id_detalleclasificacion_set-4-tipoClasificacion").on("change",function() {
            var sCla = $j(this).val();
            if (sCla == '6') {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if (sCla == '4' || sCla == '3' || sCla == '2') {

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + sCla + "']").hide();

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });
        $j("select#id_detalleclasificacion_set-5-tipoClasificacion").on("change",function() {
            var sCla = $j(this).val();
            if (sCla == '6') {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").val('---------');
            }
            else if (sCla == '4' || sCla == '3' || sCla == '2') {

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
            }

            else {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + sCla + "']").hide();

                    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });
        $j("select#id_detalleclasificacion_set-6-tipoClasificacion").on("change",function() {
            var sCla = $j(this).val();
            if (sCla == '6') {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', 'disabled');
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").val('---------');
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").val('---------');
            }
            else if (sCla == '4' || sCla == '3' || sCla == '2') {

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='2']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='3']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='4']").hide();
            }

            else {
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").attr('disabled', false);
                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + sCla + "']").hide();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + sCla + "']").hide();

                    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
            }
        });


         $j("tr.add-row").on("click",function() {

                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='']").show();

                $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-7-tipoClasificacion").val() + "']").hide();
    $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
    $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();

             for ( var i = 0; i < 11 ; i++ ){

                  if ($("select#id_detalleclasificacion_set-"+i+"-tipoClasificacion").val()=='2' || $("select#id_detalleclasificacion_set-"+i+"-tipoClasificacion").val()=='3' || $("select#id_detalleclasificacion_set-"+i+"-tipoClasificacion").val()=='4'){

                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='4']").hide();
                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='"+i+"']").hide();
                      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='4']").hide();
                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='"+i+"']").hide();
                       $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-7-tipoClasificacion").find("option[value='4']").hide();
                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='"+i+"']").hide();
                       $("select#id_detalleclasificacion_set-8-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-8-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-8-tipoClasificacion").find("option[value='4']").hide();
                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='"+i+"']").hide();
                       $("select#id_detalleclasificacion_set-9-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-9-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-9-tipoClasificacion").find("option[value='4']").hide();
                       $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='"+i+"']").hide();
                       $("select#id_detalleclasificacion_set-10-tipoClasificacion").find("option[value='2']").hide();
                        $("select#id_detalleclasificacion_set-10-tipoClasificacion").find("option[value='3']").hide();
                        $("select#id_detalleclasificacion_set-10-tipoClasificacion").find("option[value='4']").hide();
                  }
             }

              for ( var i = 0; i < 11 ; i++ ){

                  if ($("select#id_detalleclasificacion_set-"+i+"-tipoClasificacion").val()=='6'){
                        for ( var j = 0; j < 11 ; j++ ){
                            if (i != j) {
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='1']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='2']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='3']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='4']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='5']").hide();
                            }
                        }


                  }
             }

         });


        quitarepetido();
    });

function quitarepetido(){

      for ( var i = 0; i < 11 ; i++ ){

                  if ($("select#id_detalleclasificacion_set-"+i+"-tipoClasificacion").val()=='6'){
                        for ( var j = 0; j < 7 ; j++ ){
                            if (i != j) {
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='1']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='2']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='3']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='4']").hide();
                                $("select#id_detalleclasificacion_set-"+j+"-tipoClasificacion").find("option[value='5']").hide();
                            }
                        }


                  }
             }


      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-6-tipoInversion").val() + "']").hide();

      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-1-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-2-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-3-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-4-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-5-tipoInversion").val() + "']").hide();
      $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='" + $("select#id_detalleinversion_set-0-tipoInversion").val() + "']").hide();


     $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-6-tipoClasificacion").val() + "']").hide();

      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-1-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-2-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-3-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-4-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-5-tipoClasificacion").val() + "']").hide();
      $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='" + $("select#id_detalleclasificacion_set-0-tipoClasificacion").val() + "']").hide();


                 $("select#id_detalleclasificacion_set-0-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-1-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-3-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-4-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-5-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-2-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleclasificacion_set-6-tipoClasificacion").find("option[value='']").show();
                $("select#id_detalleinversion_set-0-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-1-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-2-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-3-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-4-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-5-tipoInversion").find("option[value='']").show();
                $("select#id_detalleinversion_set-6-tipoInversion").find("option[value='']").show();
};


