var map

OpenLayers.Renderer.symbol.BN = [0,9, 3,4.5, 8.5,4.5, 4.5,0, 8.5,-4.5, 3,-4.5, 0,-9, -3,-4.5, -8.5,-4.5, -4.5,0, -8.5,4.5, -3,4.5, 0,9];

window.onload = function () {

    OpenLayers.ProxyHost = 'proxy.ashx?url=';

    //test renderer for vector layers
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    //get map center from lon and lat label
    lat = $('#tbLAT').val();
    lon = $('#tbLON').val();
    var lonLat = new OpenLayers.LonLat(lon, lat);

    //google hybrid map layer
    var gMapLayer = new OpenLayers.Layer.Google("Hybrid", { type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20 });

    //define map object with base layers
    map = new OpenLayers.Map('mapFrame', {
        projection: new OpenLayers.Projection('EPSG:3857'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: 'm',
        layers: [gMapLayer],
        controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.ArgParser()],
        center: lonLat.transform('EPSG:4326', 'EPSG:3857'),
        zoom: 16
    });

    //tile layer
    layerXYZ = new OpenLayers.Layer.XYZ("MapTiler layer", "http://argeomatica2012.cloudapp.net/vuelo/${z}/${x}/${y}.png", {
        format: 'image/png',
        transitionEffect: 'resize',
        isBaseLayer: false
    });
    map.addLayer(layerXYZ);

    //create styleLookup for shapes
    var styleLookup = {
        '': { graphicName: 'cross' },
        'VÉRTICE': { graphicName: 'triangle' },
        'BN': { graphicName: 'BN' },
        'PLACA': { graphicName: 'circle' },
        'MOJONERA': { graphicName: 'square' },
        'OTRO': { graphicName: 'star' }
    };

    //make labels scale dependent
    var context = { getFontSize: function () {
            if (map.getZoom() > 14) {
                return '15px'
            } else {
                return '0px'
            } } }

    //defaultStyle (layerCTRL)
    var defaultStyle = new OpenLayers.Style({
        fillOpacity: 0,
        strokeColor: '#F30',
        strokeWidth: 2,
        pointRadius: 10,
        graphicName: '',
        label: '${CTRLID}',
        labelYOffset: 20,
        fontColor: '#F30',
        fontSize: '${getFontSize}',
        labelOutlineColor: 'white',
        labelOutlineWidth: 6
    }, { context: context })

    //stylemap (layerCTRL)
    var styleMapLayerCTRL = new OpenLayers.StyleMap({
        'default': defaultStyle
    });
    styleMapLayerCTRL.addUniqueValueRules('default', 'CTRLTYPE', styleLookup);

    //layerCTRL
    layerCTRL = new OpenLayers.Layer.Vector('layerCTRL', {
        projection: 'EPSG:3857',
        maxExtent: new OpenLayers.Bounds(-170, -80, 170, 80).transform('EPSG:4326', 'EPSG:3857'),
        sphericalMercator: true,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Refresh({ force: true, active: true })],
        protocol: new OpenLayers.Protocol.WFS({
            url: 'http://argeomatica2012.cloudapp.net/wxs/wfs.exe?',
            srsName: 'EPSG:3857',
            featureType: 'CTRL_CONTROL',
            geometryName: 'GML_Geometry'
        }),
        styleMap: styleMapLayerCTRL
    });
    map.addLayer(layerCTRL);

    if ($('#tbCROQUIS').val() != '') {
        var CROQUIS = $('#tbCROQUIS').val().split('/');
        lonLat = new OpenLayers.LonLat(CROQUIS[0], CROQUIS[1]);
        map.setCenter(lonLat, CROQUIS[2]);
    }

    map.events.on({
        "moveend": function (e) {
            document.getElementById('saveCroquis').style.visibility = 'visible';
            lonLat = map.getCenter();
            var CROQUIS = lonLat.lon + '/' + lonLat.lat + '/' + this.getZoom();
            $('#tbCROQUIS').val(CROQUIS);
        }
    });

}

function change(control) {
    control.style.backgroundColor = '#FFC';
    document.getElementById('saveDESCRIPCION').style.visibility = 'visible';
}

function loadPicture(file, fototype) {
    var canvasHold = document.getElementById('div' + fototype);
    canvasHold.innerHTML = '<a href="#" id="link' + fototype + '"><canvas id="canvas' + fototype + '" width="0" height="0"></canvas></a>';
    document.getElementById('link' + fototype).onclick = function () { $('#input' + fototype).click(); return false; };
    if (file) {
        var imgURL = window.URL.createObjectURL(file);
        document.getElementById('save' + fototype).style.visibility = 'visible';
    }
    else {
        var imgURL = 'http://portalvhds3dfldyxyc9m64.blob.core.windows.net/control/' + $('#tbCONTRATO_CTRLID').val() + '_' + fototype + '.jpg' + '?t=' + new Date().getTime();
        document.getElementById('link' + fototype).href = 'http://portalvhds3dfldyxyc9m64.blob.core.windows.net/control/' + $('#tbCONTRATO_CTRLID').val() + '_' + fototype + '.jpg';
    }
    var img = new Image();
    var imgCanvas = document.getElementById('canvas' + fototype);
    var ctx = imgCanvas.getContext('2d');
    img.onerror = function () {
        canvasHold.innerHTML = '<a href="#" id="link' + fototype + '"><i class="fa fa-picture-o"></i></a>';
        document.getElementById('link' + fototype).onclick = function () { $('#input' + fototype).click(); return false; };
    }
    img.onload = function () {
        var maxWidth = imgCanvas.parentNode.parentNode.offsetWidth;
        var maxHeight = imgCanvas.parentNode.parentNode.offsetHeight;
        var width = img.width;
        var height = img.height;
        height *= maxWidth / width;
        width = maxWidth;
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        imgCanvas.width = width;
        imgCanvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    }
    img.src = imgURL;
}

function imgUpload(fototype) {
    var r = new FileReader();
    r.onloadend = function (e) {
        document.getElementById('canvas' + fototype).style.opacity = 0.5;
        var baseUrl = $('#tbSAS').val();
        var fileName = $('#tbCONTRATO_CTRLID').val() + '_' + fototype + ".jpg";
        var indexOfQueryStart = baseUrl.indexOf('?');
        var submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + fileName + baseUrl.substring(indexOfQueryStart);
        var requestData = e.target.result;
        var XHR = new XMLHttpRequest();
        XHR.open('PUT', submitUri);
        XHR.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        XHR.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
        XHR.setRequestHeader('Content-Length', requestData.length);
        XHR.addEventListener('readystatechange', function (e) {
            //image uploade complete
            if (this.readyState === 4) {
                console.log('Upload: 100%');
                document.getElementById('save' + fototype).style.visibility = 'hidden';
                document.getElementById('canvas' + fototype).style.opacity = 1;
            }
        });
        XHR.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentComplete = parseInt((e.loaded / e.total) * 100);
                console.log('Upload: ' + percentComplete + '%');
            }
        };
        XHR.send(requestData);
    }
    var imgCanvas = document.getElementById('canvas' + fototype);
    try {
        var dataURL = imgCanvas.toDataURL('image/jpeg');
    }
    catch (err) {
        alert(err);
    }
    var dataBlob = dataURItoBlob(dataURL);
    r.readAsArrayBuffer(dataBlob);
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for (var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], { type: mimeString });
}

$(document).ready(function () {
    loadPicture(null, 'DETALLE');
    loadPicture(null, 'PANORAMICO');
    if ($('#lCTRLTYPE').text() == 'MOJONERA') {
        document.getElementById('secondPage').style.display = 'block';
        loadPicture(null, 'MEDICION');
        loadPicture(null, 'PLACA');
    };
})