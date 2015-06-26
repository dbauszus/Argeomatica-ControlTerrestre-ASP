<%@ Page Language="vb" Culture="es-MX" UICulture="es" AutoEventWireup="false" CodeBehind="WebMap.aspx.vb" Inherits="Control.WebMap" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>Argeomatica CTRL Survey</title>
    <link rel="stylesheet" href="css/WebMap.css"/>
    <link rel="stylesheet" href="fontawesome/css/font-awesome.min.css"/>
    <meta name="viewport" content="width=500px, user-scalable=no"/>
</head>

<body>

    <div id="mask"></div>

    <a id="zoomLOC" class="btn" href="#" onclick="zoomLocation(); return false;"><i class="fa fa-compass fa-5x"></i></a>
    <a id="newCTRL" class="btn" href="#" onclick="newCTRL(); return false;"><i class="fa fa-asterisk fa-5x"></i></a>
    <a id="deleteCTRL" class="btn" href="#" onclick="deleteCTRL(); return false;"><i class="fa fa-trash-o fa-5x"></i></a>
    <a id="closeCTRL" class="btn" href="#" onclick="closeCTRL(); return false;"><i class="fa fa-sort-down fa-5x"></i></a>
    <a id="saveCTRL" class="btn" href="#" onclick="saveCTRL(); return false;"><i class="fa fa-lock fa-5x"></i></a>
    <a id="openReport" class="btn" href="#" ><i class="fa fa-file-text-o fa-5x"></i></a>
    <a id="moveCTRL" class="btn" href="#" onclick="moveCTRL(); return false;"><i class="fa fa-compress fa-5x"></i></a>
    <a id="undoCTRL" class="btn" href="#" onclick="undoCTRL(); return false;"><i class="fa fa-undo fa-5x"></i></a>

    <div id="map"></div>

    <form id="frmPanel" runat="server">

        <asp:ScriptManager ID="scriptManager" runat="server"></asp:ScriptManager>
        <asp:TextBox ID="tbSAS" CssClass="textbox" runat="server" style="display:none" />

        <asp:Panel ID="pnlCTRL" runat="server">

            <asp:UpdatePanel ID="updatePnlCTRL" runat="server">

                <ContentTemplate>

                    <div id="progressBar" style="width:100%; height:5px; background-color:#E8E8E8; position:fixed; top:50%; z-index:1001;"></div>
                    <div id="progressBarActual" style="width:0%; height:5px; background-color:#CC0066; position:fixed; top:50%; z-index:1001;"></div>

                    <div style="display: none">
                        <asp:Button ID="ASPsaveNew" Text="ASPsaveNew" runat="server"/>
                        <asp:Button ID="ASPsaveChg" Text="ASPsaveChg" runat="server"/>
                        <asp:Button ID="ASPdelete" Text="ASPdelete" runat="server"/>
                        <asp:TextBox ID="tbCONTRATO_CTRLID" runat="server"/>
                        <asp:TextBox ID="tbEX" runat="server"/>
                        <asp:TextBox ID="tbX" runat="server" />
                        <asp:TextBox ID="tbY" runat="server" />
                    </div>

                    <table>

                        <tr><td>CONTRATO</td></tr>
                        <tr><td><asp:TextBox ID="tbCONTRATO" runat="server" /></td></tr>

                        <tr><td>ID</td></tr>
                        <tr><td><asp:TextBox ID="tbCTRLID" runat="server" /></td></tr>

                        <tr><td>TIPO</td></tr>
                        <tr><td>
                            <asp:DropDownList id="ddCTRLTYPE" runat="server">
                                <asp:ListItem Value=""></asp:ListItem>
                                <asp:ListItem Value="VÉRTICE">VÉRTICE</asp:ListItem>
                                <asp:ListItem Value="PLACA">PLACA</asp:ListItem>
                                <asp:ListItem Value="MOJONERA">MOJONERA</asp:ListItem>
                                <asp:ListItem Value="BN">BN</asp:ListItem>
                                <asp:ListItem Value="OTRO">OTRO</asp:ListItem>
                            </asp:DropDownList>
                        </td></tr>

                        <tr><td>DESCRIPCIÓN</td></tr>
                        <tr><td><asp:TextBox ID="tbDESCRIPCION" runat="server" textmode="multiline" /></td></tr>

                    </table>

                    <div id="divImages">

                        <p>VISTA DETALLE</p>
                        <div id="divDETALLE"><a href="#" id="linkDETALLE" onclick="$('#inputDETALLE').click(); return false"><i class="fa fa-picture-o"/></i></a></div>
                        <input type="file" id="inputDETALLE" accept="image/*" onchange="loadPicture(this.files[0], 'DETALLE')" style="display: none" />

                        <p>VISTA PANORAMICO</p>
                        <div id="divPANORAMICO"><a href="#" id="linkPANORAMICO" onclick="$('#inputPANORAMICO').click(); return false"><i class="fa fa-picture-o"/></i></a></div>
                        <input type="file" id="inputPANORAMICO" accept="image/*" onchange="loadPicture(this.files[0], 'PANORAMICO')" style="display: none" />

                        <p  class="classHidden">VISTA PLACA</p>
                        <div class="classHidden" id="divPLACA"><a href="#" id="linkPLACA" onclick="$('#inputPLACA').click(); return false"><i class="fa fa-picture-o"/></i></a></div>
                        <input type="file" id="inputPLACA" accept="image/*" onchange="loadPicture(this.files[0], 'PLACA')" style="display: none" />

                        <p class="classHidden">VISTA MEDICION</p>
                        <div class="classHidden" id="divMEDICION"><a href="#" id="linkMEDICION" onclick="$('#inputMEDICION').click(); return false"><i class="fa fa-picture-o"/></i></a></div>
                        <input type="file" id="inputMEDICION" accept="image/*" onchange="loadPicture(this.files[0], 'MEDICION')" style="display: none" />

                    </div>

                </ContentTemplate>

            </asp:UpdatePanel>

        </asp:Panel>

        <div id="divCoordinateMask">
            <div id="divCoordinateInput">
                <table>
                    <tr><td>LATITUD</td></tr>
                    <tr><td><asp:TextBox ID="tbLAT" CssClass="textbox" runat="server" /></td></tr>
                    <tr><td>LONGITUD</td></tr>
                    <tr><td><asp:TextBox ID="tbLON" CssClass="textbox" runat="server" /></td></tr>
                </table>
                <a id="place" href="#" onclick="place(); return false;"><i class="fa fa-map-marker fa-5x"></i></a>
            </div>
        </div>

    </form>

</body>

<script type="text/javascript" src="//maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript" src="scripts/openLayers.2.13.1.js"></script>
<script type="text/javascript" src="scripts/jQuery.2.1.0.js"></script>
<script type="text/javascript" src="scripts/jQueryUI.1.10.4.js"></script>
<script type="text/javascript" src="scripts/queryString.js"></script>
<script type="text/javascript" src="scripts/WebMap.js"></script>

</html>