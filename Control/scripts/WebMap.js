var map,
    lonLat,
    xY,
    featureSelected,
    featureDraw,
    pLOC,
    layerLOC,
    layerCONTRATO,
    layerCTRL,
    layerDRAW,
    layerXYZ,
    controlSelect,
    controlDraw
var chgFotoDETALLE = false;
var chgFotoPANORAMICO = false;
var chgFotoPLACA = false;
var chgFotoMEDICION = false;
var newCONTROL = false;

//define openlayers vector symbol
OpenLayers.Renderer.symbol.BN = [0,9, 3,4.5, 8.5,4.5, 4.5,0, 8.5,-4.5, 3,-4.5, 0,-9, -3,-4.5, -8.5,-4.5, -4.5,0, -8.5,4.5, -3,4.5, 0,9];

function activateControl(id) {
    for (var i in map.controls) {
        var control = map.controls[i]; if (control.id == id) { control.activate(); }
    }
}

function deactivateControl(id) {
    for (var i in map.controls) {
        var control = map.controls[i]; if (control.id == id) { control.deactivate(); }
    }
}

window.onload = function () {

    OpenLayers.ProxyHost = 'proxy.ashx?url=';

    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    //google hybrid map layer
    var gMapLayer = new OpenLayers.Layer.Google("Hybrid", { type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20 });
    
    //define map object with base layers
    map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection('EPSG:3857'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: 'm',
        layers: [gMapLayer],
        controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.ArgParser()],
        center: new OpenLayers.LonLat(-103.77, 24.59).transform('EPSG:4326', 'EPSG:3857'),
        zoom: 5
    });
    
    //layerXYZ
    layerXYZ = new OpenLayers.Layer.XYZ("MapTiler layer", "http://argeomatica2012.cloudapp.net/vuelo/${z}/${x}/${y}.png", {
        format: 'image/png',
        transitionEffect: 'resize',
        isBaseLayer: false
    });
    map.addLayer(layerXYZ);

    //defaultStyle (layerCONTRATO)
    var defaultStyle = new OpenLayers.Style({
        fillColor: '',
        fillOpacity: 0,
        strokeColor: '#F30',
        strokeWidth: 2,
        pointRadius: 10
    });

    //stylemap (layerCONTRATO)
    var styleMapLayerCONTRATO = new OpenLayers.StyleMap({
        'default': defaultStyle,
        'select': defaultStyle
    });

    //layerCONTRATO
    layerCONTRATO = new OpenLayers.Layer.Vector('layerCONTRATO', {
        projection: 'EPSG:3857',
        maxExtent: new OpenLayers.Bounds(-170, -80, 170, 80).transform('EPSG:4326', 'EPSG:3857'),
        sphericalMercator: true,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Refresh({ force: true, active: true })],
        protocol: new OpenLayers.Protocol.WFS({
            url: 'http://argeomatica2012.cloudapp.net/wxs/wfs.exe?',
            srsName: 'EPSG:3857',
            featureType: 'CTRL_CONTRATO',
            geometryName: 'GML_Geometry'
        }),
        styleMap: styleMapLayerCONTRATO
    });
    map.addLayer(layerCONTRATO);

    //styleLookup (layerCTRL)
    var styleLookup = {
        '': { graphicName: 'cross' },
        'VÉRTICE': { graphicName: 'triangle' },
        'BN': { graphicName: 'BN' },
        'PLACA': { graphicName: 'circle' },
        'MOJONERA': { graphicName: 'square' },
        'OTRO': { graphicName: 'star' }
    };

    //make labels scale dependent
    var contextCTRL = {
        getFontSize: function () {
            if (map.getZoom() > 14) {
                return '15px'
            } else {
                return '0px'
            }
        }
    };

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
        labelOutlineWidth: 4
    }, { context: contextCTRL });

    //selectStyle (layerCTRL)
    var selectStyle = new OpenLayers.Style({
        fillOpacity: 0,
        strokeColor: '#F0F',
        strokeWidth: 2,
        pointRadius: 10,
        graphicName: '',
        label: '${CTRLID}',
        labelYOffset: 20,
        fontColor: '#F0F',
        fontSize: 15
    });

    //stylemap (layerCTRL)
    var styleMapLayerCTRL = new OpenLayers.StyleMap({
        'default': defaultStyle,
        'select': selectStyle
    });
    styleMapLayerCTRL.addUniqueValueRules('default', 'CTRLTYPE', styleLookup);
    styleMapLayerCTRL.addUniqueValueRules('select', 'CTRLTYPE', styleLookup);

    //layerCTRL
    layerCTRL = new OpenLayers.Layer.Vector('layerCTRL', {
        projection: 'EPSG:3857',
        maxExtent: new OpenLayers.Bounds(-170, -80, 170, 80).transform('EPSG:4326', 'EPSG:3857'),
        sphericalMercator: true,
        strategies: [ new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Refresh({ force: true, active: true }) ],
        protocol: new OpenLayers.Protocol.WFS({
            url: 'http://argeomatica2012.cloudapp.net/wxs/wfs.exe?',
            srsName: 'EPSG:3857',
            featureType: 'CTRL_CONTROL',
            geometryName: 'GML_Geometry'
        }),
        styleMap: styleMapLayerCTRL,
        visibility: false
    });
    map.addLayer(layerCTRL);
    
    //select control (layerCTRL)
    controlSelect = new OpenLayers.Control.SelectFeature(layerCTRL, {
        clickout: false,
        onSelect: selectCTRL
    });
    controlSelect.id = 'controlSelect';
    controlSelect.handlers.feature.stopDown = false;
    map.addControl(controlSelect);
    
    //layerLOC
    layerLOC = new OpenLayers.Layer.Vector('layerLOC');
    layerLOC.style = { fillColor: '#FFF', strokeColor: '#000', strokeWidth: 3, pointRadius: 9 };
    map.addLayer(layerLOC);
    pLOC = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0), null, null);
    layerLOC.addFeatures([pLOC]);

    //layerDRAW
    layerDRAW = new OpenLayers.Layer.Vector('layerDRAW');
    layerDRAW.style = { fillColor: '#0F0', strokeColor: '', strokeWidth: 0, pointRadius: 10, graphicName: 'cross' };
    map.addLayer(layerDRAW);

    //controlDraw
    controlDraw = new OpenLayers.Control.DrawFeature(layerDRAW, OpenLayers.Handler.Point);
    controlDraw.id = 'controlDraw';
    controlDraw.events.register('featureadded', controlDraw, function (e) {
        featureDraw = e.feature
        xY = new OpenLayers.LonLat(featureDraw.geometry.x, featureDraw.geometry.y)
        $('#tbX').val(xY.lon);
        $('#tbY').val(xY.lat);
        lonLat = xY.transform('EPSG:3857', 'EPSG:4326')
        $('#tbLON').val(lonLat.lon);
        $('#tbLAT').val(lonLat.lat);
        deactivateControl('controlDraw');
        $('#undoCTRL').show();
    });
    map.addControl(controlDraw);

    map.events.on({
        "zoomend": function (e) {
            if (this.getZoom() < 13) {
                layerCTRL.setVisibility(false);
                deactivateControl('controlSelect');
            }
            else {
                layerCTRL.setVisibility(true);
                activateControl('controlSelect');
            }
        },
        "moveend": function (e) {
            lonLat = map.getCenter();
            queryString.push('X', lonLat.lon);
            queryString.push('Y', lonLat.lat);
            queryString.push('Z', this.getZoom());
        }
    });
    
    //buttons
    $('#deleteCTRL').hide();
    $('#closeCTRL').hide();
    $('#saveCTRL').hide();
    $('#openReport').hide();
    $('#moveCTRL').hide();
    $('#undoCTRL').hide();

    //set center from URL params
    var URLparams = queryString.parse(location.search);
    if (URLparams.X != null && URLparams.Y != null && URLparams.Z != null) {
        lonLat = new OpenLayers.LonLat(URLparams.X, URLparams.Y);
        map.setCenter(lonLat, URLparams.Z);
    }

}

function zoomLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform('EPSG:4326', map.getProjectionObject());
            pLOC.move(lonLat);
            map.setCenter(lonLat, 16);
        });
    }
}

function selectCTRL(f) {
    featureSelected = f;
    xY = new OpenLayers.LonLat(featureSelected.geometry.x, featureSelected.geometry.y);
    map.setCenter(xY);
    $('#tbX').val(xY.lon);
    $('#tbY').val(xY.lat);
    lonLat = xY.transform('EPSG:3857', 'EPSG:4326')
    $('#tbLON').val(lonLat.lon);
    $('#tbLAT').val(lonLat.lat);
    $('#tbDESCRIPCION').val(featureSelected.attributes.DESCRIPCION);
    $('#tbCONTRATO_CTRLID').val(featureSelected.attributes.CONTRATO_CTRLID);
    $('#tbCONTRATO').val(featureSelected.attributes.CONTRATO);
    $('#tbCTRLID').val(featureSelected.attributes.CTRLID);
    $('#ddCTRLTYPE').val(featureSelected.attributes.CTRLTYPE);
    //queryString.push('CONTRATO_CTRLID', featureSelected.attributes.CONTRATO_CTRLID);
    document.getElementById('divImages').style.display = 'block'

    controlFotoVisibility();

    //set link for report
    var link = document.getElementById('openReport');
    //link.setAttribute('href', 'http://argeomatica2012.cloudapp.net/Control/report.aspx?CONTRATO_CTRLID=' + f.attributes.CONTRATO_CTRLID);
    link.setAttribute('href', 'http://localhost/Control/report.aspx?CONTRATO_CTRLID=' + f.attributes.CONTRATO_CTRLID);
    
    //panel
    if ($('#pnlCTRL').is(":hidden")) {
        $('#pnlCTRL').slideToggle('fast');
        $('#map').height('55%');
        map.updateSize();
    }

    //buttons
    $('#newCTRL').hide();
    $('#deleteCTRL').show();
    $('#closeCTRL').show();
    $('#openReport').show();
    $('#moveCTRL').show();

    //load pictures
    loadPicture(null, 'DETALLE');
    loadPicture(null, 'PANORAMICO');
    loadPicture(null, 'PLACA');
    loadPicture(null, 'MEDICION');
}

function closeCTRL() {
    //features
    controlSelect.unselectAll();
    layerDRAW.removeAllFeatures();

    //controls
    deactivateControl('controlDraw');
    activateControl('controlSelect');

    //panel
    $('#divCoordinateMask').hide();
    $('#pnlCTRL').slideToggle('fast');
    $('#map').height('100%');
    map.updateSize();

    //buttons
    $('#newCTRL').show();
    $('#deleteCTRL').hide();
    $('#closeCTRL').hide();
    $('#saveCTRL').hide();
    $('#openReport').hide();
    $('#moveCTRL').hide();
    $('#undoCTRL').hide();
}

function deleteCTRL() {
    if (newCONTROL == true) {
        newCONTROL = false;
        closeCTRL();
    } else {
        if (confirm('Eliminar CTRL?')) {
            document.getElementById('ASPdelete').click();
        }
    }
}

function newCTRL() {

    //create feature
    xY = map.getCenter();
    featureSelected = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(xY.lon, xY.lat), null, null);
    $('#tbCONTRATO').val('');
    $('#tbCTRLID').val('');
    $('#ddCTRLTYPE').val('');
    $('#tbDESCRIPCION').val('');

    //test location
    for (var i in layerCONTRATO.features) {
        var testFeature = layerCONTRATO.features[i];
        var testFilter = new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.INTERSECTS,
            value: testFeature.geometry
        });
        myTest = testFilter.evaluate(featureSelected);
        if (myTest == true) {
            $('#tbCONTRATO').val(testFeature.attributes.CONTRATO);
        }
    }

    //create CTRL template
    if ($('#tbCONTRATO').val() == '') {
        alert('No la posición en un área del contrato');
    } else {
        newCONTROL = true;

        //set location
        document.getElementById('divImages').style.display = 'none';
        layerDRAW.addFeatures([featureSelected]);
        $('#tbX').val(xY.lon);
        $('#tbY').val(xY.lat);
        lonLat = xY.transform('EPSG:3857', 'EPSG:4326');
        $('#tbLON').val(lonLat.lon);
        $('#tbLAT').val(lonLat.lat);

        //controls
        deactivateControl('controlSelect');

        //panel
        $('#pnlCTRL').slideToggle('fast');
        $('#map').height('55%');
        map.updateSize();

        //buttons
        $('#newCTRL').hide();
        $('#openReport').hide();
        $('#deleteCTRL').show();
        $('#saveCTRL').show();
        $('#moveCTRL').show();     
    }
}

function moveCTRL() {
    layerDRAW.removeAllFeatures();
    xY = new OpenLayers.LonLat(featureSelected.geometry.x, featureSelected.geometry.y);
    $('#tbX').val(xY.lon);
    $('#tbY').val(xY.lat);
    lonLat = xY.transform('EPSG:3857', 'EPSG:4326')
    $('#tbLON').val(lonLat.lon);
    $('#tbLAT').val(lonLat.lat);
    $('#saveCTRL').hide();
    $('#closeCTRL').hide();
    $('#openReport').hide();
    $('#divCoordinateMask').show();
    deactivateControl('controlSelect');
    activateControl('controlDraw');
}

function place() {
    lonLat = new OpenLayers.LonLat($('#tbLON').val(), $('#tbLAT').val());
    xY = lonLat.transform('EPSG:4326', 'EPSG:3857');
    featureDraw.move(xY);
    $('#tbX').val(xY.lon);
    $('#tbY').val(xY.lat);
    map.setCenter(xY);
    $('#divCoordinateMask').hide();
    $('#saveCTRL').show();
}

function undoCTRL() {
    xY = new OpenLayers.LonLat(featureSelected.geometry.x, featureSelected.geometry.y)
    if (newCONTROL == true) {
        featureDraw.move(xY);
        $('#saveCTRL').show();
    } else {
        layerDRAW.removeAllFeatures();
        $('#saveCTRL').hide();
        $('#openReport').show();
        $('#closeCTRL').show();
    }
    $('#divCoordinateMask').hide();
    $('#tbX').val(xY.lon);
    $('#tbY').val(xY.lat);
    map.setCenter(xY);
    lonLat = xY.transform('EPSG:3857', 'EPSG:4326');
    $('#tbLON').val(lonLat.lon);
    $('#tbLAT').val(lonLat.lat);
    $('#tbDESCRIPCION').val(featureSelected.attributes.DESCRIPCION);
    document.getElementById('tbDESCRIPCION').style.backgroundColor = '#FFF';
    $('#tbCTRLID').val(featureSelected.attributes.CTRLID);
    document.getElementById('tbCTRLID').style.backgroundColor = '#FFF';
    $('#ddCTRLTYPE').val(featureSelected.attributes.CTRLTYPE);
    document.getElementById('ddCTRLTYPE').style.backgroundColor = '#FFF';
    
    controlFotoVisibility();

    //reset fotos
    if (chgFotoDETALLE == true) {
        chgFotoDETALLE = false;
        loadPicture(null, 'DETALLE');
    }
    if (chgFotoPANORAMICO == true) {
        chgFotoPANORAMICO = false;
        loadPicture(null, 'PANORAMICO');
    }
    if (chgFotoPLACA == true) {
        chgFotoPLACA = false;
        loadPicture(null, 'PLACA');
    }
    if (chgFotoMEDICION == true) {
        chgFotoMEDICION = false;
        loadPicture(null, 'MEDICION');
    }

    //buttons
    $('#undoCTRL').hide();

    activateControl('controlSelect');
}

function change(control) {
    if (newCONTROL == false) {
        deactivateControl('controlSelect');
        control.style.backgroundColor = '#FFC';
        controlFotoVisibility();

        //buttons
        $('#closeCTRL').hide();
        $('#openReport').hide();
        $('#saveCTRL').show();
        $('#undoCTRL').show();
    }
}

function controlFotoVisibility() {
    var classHidden = document.getElementsByClassName('classHidden');
    if ($('#ddCTRLTYPE').val() == 'MOJONERA' || $('#ddCTRLTYPE').val() == 'PLACA') {
        for (i = 0; i < classHidden.length; i++) {
            classHidden[i].style.display = 'block';
        }
    } else {
        for (i = 0; i < classHidden.length; i++) {
            classHidden[i].style.display = 'none';
        }
    }
}

function saveCTRL() {
    $('#mask').show();
    if (chgFotoDETALLE == true) {
        imgUpload('DETALLE');
    }
    if (chgFotoPANORAMICO == true) {
        imgUpload('PANORAMICO');
    }
    if (chgFotoPLACA == true) {
        imgUpload('PLACA');
    }
    if (chgFotoMEDICION == true) {
        imgUpload('MEDICION');
    }
    if (newCONTROL == true) {
        document.getElementById('ASPsaveNew').click();
    } else {
        document.getElementById('ASPsaveChg').click();
    }
}

function SQLsavedFail() {
    alert($('#tbEX').val());
    if (newCONTROL == false) {
        if (featureSelected.attributes.CTRLID != $('#tbCTRLID').val()) { document.getElementById('tbCTRLID').style.backgroundColor = '#FFC'; }
        if (featureSelected.attributes.DESCRIPCION != $('#tbDESCRIPCION').val()) { document.getElementById('tbDESCRIPCION').style.backgroundColor = '#FFC'; }
        if (featureSelected.attributes.CTRLTYPE != $('#ddCTRLTYPE').val()) { document.getElementById('ddCTRLTYPE').style.backgroundColor = '#FFC'; }

        //load pictures
        loadPicture(null, 'DETALLE');
        loadPicture(null, 'PANORAMICO');
        loadPicture(null, 'PLACA');
        loadPicture(null, 'MEDICION');
    }
    $('#mask').hide();
}

function SQLsavedOK() {
    newCONTROL = false;
    layerCTRL.refresh({ force: true });
    $('#mask').hide();
    closeCTRL();
}

function loadPicture(file, fototype) {
    var canvasHold = document.getElementById('div' + fototype);
    canvasHold.innerHTML = '<a href="#" id="link' + fototype + '"><canvas id="canvas' + fototype + '" width="0" height="0"></canvas></a>';
    document.getElementById('link' + fototype).onclick = function () { $('#input' + fototype).click(); return false; };
    
    //check whether load from file or URL
    if (file) {
        var imgURL = window.URL.createObjectURL(file);
        if (fototype == 'DETALLE') { chgFotoDETALLE = true; }
        if (fototype == 'PANORAMICO') { chgFotoPANORAMICO = true; }
        if (fototype == 'PLACA') { chgFotoPLACA = true; }
        if (fototype == 'MEDICION') { chgFotoMEDICION = true; }
        deactivateControl('controlSelect');
        //buttons
        $('#closeCTRL').hide();
        $('#openReport').hide();
        $('#saveCTRL').show();
        $('#undoCTRL').show();
    }
    else {
        var imgURL = 'http://portalvhds3dfldyxyc9m64.blob.core.windows.net/control/' + $('#tbCONTRATO_CTRLID').val() + '_' + fototype + '.jpg' + '?t=' + new Date().getTime();;
    }

    //load image
    var img = new Image();
    var imgCanvas = document.getElementById('canvas' + fototype);
    var ctx = imgCanvas.getContext('2d');
    img.onerror = function () {
        canvasHold.innerHTML = '<a href="#" id="link' + fototype + '"><i class="fa fa-picture-o"></i></a>';
        document.getElementById('link' + fototype).onclick = function () { $('#input' + fototype).click(); return false; };
    }
    img.onload = function () {
        var width = document.getElementById('tbCTRLID').offsetWidth;
        var height = img.height;
        height *= width / img.width;
        imgCanvas.width = width;
        imgCanvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    }
    img.src = imgURL;
}

function imgUpload(fototype) {
    var r = new FileReader();
    r.onloadend = function (e) {
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
                    document.getElementById('progressBarActual').style.width = '0%';
                    console.log('Upload: 100%');
                    if (fototype == 'DETALLE') { chgFotoDETALLE = false; }
                    if (fototype == 'PANORAMICO') { chgFotoPANORAMICO = false; }
                    if (fototype == 'PLACA') { chgFotoPLACA = false; }
                    if (fototype == 'MEDICION') { chgFotoMEDICION = false; }
                }
            });
            XHR.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var percentComplete = parseInt((e.loaded / e.total) * 100);
                    document.getElementById('progressBarActual').style.width = percentComplete + '%';
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