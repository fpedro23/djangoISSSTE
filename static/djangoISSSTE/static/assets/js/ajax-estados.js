
$(document).on('ready', function() {
    /*
        Only do the cleanup if the field didn't contain a value already
        this is used for the edit form
     */

    $("tr.add-row").on("click",function(){
        var estadoId = $('.tamcontrolsel').find('option:selected').val();
        var mismun=[];
        var edolenght=$('.tamcontrolsel').length;

        for(i=0;i<edolenght-2;i++)
        {
            mismun[i]=$("select#id_metamensual_set-"+i+"-estado").val();
            //alert("mismun;"+mismun[i]+'i:'+i);
        }

        for (var i = 0; i < mismun.length; i++) {
        $("select#id_metamensual_set-" + mismun.length + "-estado").find("option[value='" + mismun[i] + "']").hide();
        }
    });

    $(".tamcontrol").on("change",function(){
        //alert($(this).val());
        //alert($(this).attr("id"));

        var meslen=$('.tamcontrolsel').length;
        //alert(meslen);


    });


});

