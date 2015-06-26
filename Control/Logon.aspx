<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Logon.aspx.vb" Inherits="Control.Logon" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Argeomatica WebMap Secure Logon</title>
    <link href="css/Logon.css" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=500px" />
</head>
<body>

    <form id="LogonForm" runat="server">

        <div style="border:1px solid black; width: 300px; display:block; margin:200px auto">

            <p>Usuario</p>
            <asp:TextBox style="width:calc(100% - 25px); margin-left: 10px; margin-right: 10px" ID="UserName" runat="server"></asp:TextBox>
            
            <p>Contraseña</p>
            <asp:TextBox style="width:calc(100% - 25px); margin-left: 10px; margin-right: 10px" ID="Password" runat="server" TextMode="Password" AutoPostBack="true"></asp:TextBox>
            
            <p></p>
            <asp:Label style="margin-bottom: 10px;" ID="InvalidCredentialsMessage" runat="server" ForeColor="Red" Text="Usuario o contraseña inválidos." Visible="False"></asp:Label>
            
        </div>

    </form>

</body>
</html>