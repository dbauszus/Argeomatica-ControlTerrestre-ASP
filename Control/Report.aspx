<%@ Page Language="vb" Culture="es-MX" UICulture="es" AutoEventWireup="false" CodeBehind="Report.aspx.vb" Inherits="Control.Report" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
        <title>Argeomatica CTRL Report</title>
        <link rel="stylesheet" href="css/ReportPage.css" />
        <link rel="stylesheet" href="fontawesome/css/font-awesome.min.css" />
</head>

<body>
<form id="form" runat="server">
<asp:ScriptManager ID="scriptManager" runat="server"></asp:ScriptManager>

<div class="page">
<div class="pageFrame">
    
    <asp:TextBox class="displayNone" ID="tbSAS" runat="server" />
    <asp:TextBox class="displayNone" ID="tbCONTRATO_CTRLID" runat="server" />
    <asp:TextBox class="displayNone" ID="tbCONTRATO" runat="server" />
    <asp:TextBox class="displayNone" ID="tbLOGO" runat="server" />
    <asp:TextBox class="displayNone" ID="tbLAT" runat="server" />
    <asp:TextBox class="displayNone" ID="tbLON" runat="server" />
    
    <div id="topFrame">

        <div id="topLeftFrame"><span class="centererClass"></span><asp:Image ID="topLeftImg" runat="server" /></div>

        <div id="topCentreFrame">
            <asp:Label ID="lTitelo1" runat="server" />
            <asp:Label ID="lTitelo2" runat="server" />
            <asp:Label ID="lTitelo3" runat="server" />
            <asp:Label ID="lTitelo4" runat="server" />
            <asp:Label ID="lTitelo5" runat="server" />
            <asp:Label ID="lTitelo6" runat="server" />
            <asp:Label ID="lTitelo7" runat="server" />
        </div> 

        <div id="topRightFrame"><span class="centererClass"></span><asp:Image ID="topRightImg" runat="server" /></div> 

    </div>

    <div id="titleRow">
        <asp:Label ID="lCTRLTYPE" runat="server" /> :   <asp:Label ID="lCTRLID" runat="server" />
    </div>

    <div id="coordFrame">

        <table id="coordLeftFrame">
            <colgroup><col/><col/></colgroup>
            <thead>
                <tr><th colspan="2">COORDENADAS (<asp:Label ID="lCOORD_GEO" runat="server" />)</th></tr>
            </thead>
            <tbody>
                <tr><td>LATITUD</td><td><asp:Label ID="lLAT" runat="server" /></td></tr>
                <tr><td>LONGITUD</td><td><asp:Label ID="lLON" runat="server" /></td></tr>
                <tr><td>ALTURA ELIPSOIDAL</td><td><asp:Label ID="lALT" runat="server" /></td></tr>
            </tbody>
        </table>

        <table id="coordRightFrame">
            <colgroup><col/><col/></colgroup>
            <thead>
                <tr><th colspan="2">COORDENADAS (<asp:Label ID="lCOORD_CARTO" runat="server" />)</th></tr>
            </thead>
            <tbody>
                <tr><td>X</td><td><asp:Label ID="lX" runat="server" /></td></tr>
                <tr><td>Y</td><td><asp:Label ID="lY" runat="server" /></td></tr>
                <tr><td>Z</td><td><asp:Label ID="lZ" runat="server" /></td></tr>
            </tbody>
        </table>

    </div>

    <div id="leftFrame">

        <p>DESCRIPCIÓN</p>
        <div class="contentBlockTop">
            <asp:TextBox ID="tbDESCRIPCION" enabled="true" textmode="multiline" runat="server" />          
        </div>
        <a id="saveDESCRIPCION" href="#" onclick="document.getElementById('ASPsaveDesc').click(); return false;"><i class="fa fa-lock fa-3x"></i></a>
        <asp:Panel ID="pnlDesc" runat="server">
            <asp:UpdatePanel ID="updatePnlDesc" runat="server">
                <ContentTemplate>
                    <asp:Button id="ASPsaveDesc" class="displayNone" text="ASPsaveDesc" runat="server" />
                </ContentTemplate>
            </asp:UpdatePanel>
        </asp:Panel>

        <p>FOTOGRAFÍA DEL DETALLE</p>
        <a class="btnSave" id="saveDETALLE" href="#" onclick="imgUpload('DETALLE'); return false;"><i class="fa fa-lock fa-3x"></i></a>
        <div class="contentBlockBottom" id="divDETALLE"></div>
        <input class="displayNone" type="file" id="inputDETALLE" accept="image/*" onchange="loadPicture(this.files[0], 'DETALLE')" />

    </div>

    <div id="rightFrame">

        <p>FOTOGRAFÍA PANORAMICO</p>
        <a class="btnSave" id="savePANORAMICO" href="#" onclick="imgUpload('PANORAMICO'); return false;"><i class="fa fa-lock fa-3x"></i></a>
        <div class="contentBlockTop" id="divPANORAMICO"></div>
        <input class="displayNone" type="file" id="inputPANORAMICO" accept="image/*" onchange="loadPicture(this.files[0], 'PANORAMICO')" />

        <p>CROQUIS DEL DETALLE</p>
        <asp:TextBox class="displayNone" ID="tbCROQUIS" runat="server" />
        <asp:Panel ID="pnlCroquis" runat="server">
            <asp:UpdatePanel ID="updatePnlCroquis" runat="server">
                <ContentTemplate>
                    <asp:Button id="ASPsaveCroquis" class="displayNone" text="ASPsaveCroquis" runat="server" />
                </ContentTemplate>
            </asp:UpdatePanel>
        </asp:Panel>
        <a class="btnSave" id="saveCroquis" href="#" onclick="document.getElementById('ASPsaveCroquis').click(); return false;"><i class="fa fa-lock fa-3x"></i></a>
        <div class="contentBlockBottom" id="mapFrame"></div>

    </div>

</div>
</div>

<div id="secondPage" class="page">
<div class="pageFrame">

    <div id="topFrame_P2">

        <div id="topLeftFrame_P2"><span class="centererClass"></span><asp:Image ID="topLeftImg_P2" runat="server" /></div>

        <div id="topCentreFrame_P2">
            <asp:Label ID="lTitelo1_P2" runat="server" />
            <asp:Label ID="lTitulo2_P2" runat="server" />
            <asp:Label ID="lTitulo3_P2" runat="server" />
            <asp:Label ID="lTitulo4_P2" runat="server" />
            <asp:Label ID="lTitulo5_P2" runat="server" />
            <asp:Label ID="lTitulo6_P2" runat="server" />
            <asp:Label ID="lTitulo7_P2" runat="server" />
        </div>

        <div id="topRightFrame_P2"><span class="centererClass"></span><asp:Image ID="topRightImg_P2" runat="server" /></div>

    </div>

    <div id="titleRow_P2">
        <asp:Label ID="lCTRLTYPE_P2" runat="server" /> : <asp:Label ID="lCTRLID_P2" runat="server" />
    </div>

    <p>FOTOGRAFÍA DE MEDICIÓN</p>
    <a class="btnSave" id="saveMEDICION" href="#" onclick="imgUpload('MEDICION'); return false;"><i class="fa fa-lock fa-3x"></i></a>
    <div class="contentBlockP2" id="divMEDICION"></div>
    <input class="displayNone" type="file" id="inputMEDICION" accept="image/*" onchange="loadPicture(this.files[0], 'MEDICION')" />

    <p>FOTOGRAFÍA DE LA PLACA</p>
    <a class="btnSave" id="savePLACA" href="#" onclick="imgUpload('PLACA'); return false;"><i class="fa fa-lock fa-3x"></i></a>
    <div class="contentBlockP2" id="divPLACA"></div>
    <input class="displayNone" type="file" id="inputPLACA" accept="image/*" onchange="loadPicture(this.files[0], 'PLACA')" />

</div>
</div>

    <asp:SqlDataSource runat="server" ID="sqlCONTROL" ConnectionString='<%$ ConnectionStrings:SQLConnectionString %>' SelectCommand="SELECT DISTINCT [CONTRATO], [CTRLID], [LAT], [LON], [ALTURA], [COORD_GEO], [X], [Y], [Z], [COORD_CARTO], [CTRLTYPE], [DESCRIPCION], [CONTRATO_CTRLID], [CROQUIS] FROM [CTRL_CONTROL] WHERE ([CONTRATO_CTRLID] = @CONTRATO_CTRLID)">
    <SelectParameters>
        <asp:ControlParameter ControlID="tbCONTRATO_CTRLID" PropertyName="Text" Name="CONTRATO_CTRLID" Type="String"></asp:ControlParameter>
    </SelectParameters>
    </asp:SqlDataSource>

    <asp:SqlDataSource runat="server" ID="sqlCONTRATO" ConnectionString='<%$ ConnectionStrings:SQLConnectionString %>' SelectCommand="SELECT DISTINCT [CONTRATO], [TITULO1], [TITULO2], [TITULO3], [TITULO4], [TITULO5], [TITULO6], [TITULO7], [LOGO], [LOGO_RIGHT] FROM [CTRL_CONTRATO] WHERE ([CONTRATO] = @CONTRATO)">
    <SelectParameters>
        <asp:ControlParameter ControlID="tbCONTRATO" PropertyName="Text" Name="CONTRATO" Type="String"></asp:ControlParameter>
    </SelectParameters>
    </asp:SqlDataSource>

</form>
</body>

<script type="text/javascript" src="//maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="scripts/openLayers.2.13.1.js"></script>
<script type="text/javascript" src="scripts/jQuery.2.1.0.js"></script>
<script type="text/javascript" src="scripts/jQueryUI.1.10.4.js"></script>
<script type="text/javascript" src="scripts/Report.js"></script>
</html>