  var map;
  var markersArray = [];
$(function(){

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(getCoords, getError);
    }else{
        initialize(-34.397, 150.644);
        showOverlays();
    }

    function getCoords(position)
    {
        var lat= position.coords.latitude;
        var lng = position.coords.longitude;

        initialize(lat, lng);
        showOverlays();
    }

    function getError(err)
    {
        initialize(-34.397, 150.644);
        showOverlays();
    }

    function initialize(lat, lng)
    {
        var latlng = new google.maps.LatLng(lat, lng);
        var mapSettings = {
            center:latlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map($('#mapa').get(0), mapSettings);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: true,
            title: 'Arrastrar'
        });

        google.maps.event.addListener(marker,'position_changed',function(event){
            getMarkerCoords(marker);
        });

    }


    function getMarkerCoords(marker)
    {
        var markerCoords = marker.getPosition();
        $('#id_lat').val( markerCoords.lat() );
        $('#id_lng').val( markerCoords.lng() );
    }


    $('#form_coords').submit(function(e){
        e.preventDefault();

        $.post('/coords/save', $(this).serialize(), function(data){
            if (data.ok)
            {
                $('#data').html(data.msg);
                $('#form_coords').each(function(){this.reset();});
            }else{
                alert(data.msg);
            }
        }, 'json');
    });
});

      function addMarker(location,titulo) {
            marker = new google.maps.Marker({
            position: location,
            title: titulo,
            map: map
        });
        markersArray.push(marker);
    }

    function showOverlays() {
    if (markersArray) {
        for (i in markersArray) {
           markersArray[i].setMap(map);
        }
     }
    }