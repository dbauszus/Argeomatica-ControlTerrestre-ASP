Imports System.Data
Imports System.Data.SqlClient
Imports System.Configuration
Imports System.Globalization
Imports Microsoft.WindowsAzure.Storage
Imports Microsoft.WindowsAzure.Storage.Auth
Imports Microsoft.WindowsAzure.Storage.Blob
Imports Microsoft.WindowsAzure.Storage.Shared.Protocol

Public Class Report
    Inherits System.Web.UI.Page

    Private storageAccount As CloudStorageAccount
    Private blobClient As CloudBlobClient
    Private serviceProperties As ServiceProperties
    Private blobContainer As CloudBlobContainer
    Private conn As SqlConnection

    Protected Sub Page_Load() Handles Me.Load
        If Not IsPostBack Then

            tbDESCRIPCION.Attributes.Add("onkeyup", "change(this);")

            storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings("StorageConnectionString").ConnectionString)
            blobClient = storageAccount.CreateCloudBlobClient
            blobContainer = blobClient.GetContainerReference("control")
            createSAS()

            'get control data
            Try
                tbCONTRATO_CTRLID.Text = Request.QueryString("CONTRATO_CTRLID")
                Page.Title = tbCONTRATO_CTRLID.Text
                Dim dv As DataView = DirectCast(sqlCONTROL.Select(DataSourceSelectArguments.Empty), DataView)
                For Each drv As DataRowView In dv
                    tbCONTRATO.Text = drv("CONTRATO").ToString()
                    lCTRLID.Text = drv("CTRLID").ToString()
                    lCTRLID_P2.Text = drv("CTRLID").ToString()
                    lCTRLTYPE.Text = drv("CTRLTYPE").ToString()
                    lCTRLTYPE_P2.Text = drv("CTRLTYPE").ToString()
                    tbDESCRIPCION.Text = drv("DESCRIPCION").ToString()
                    tbCROQUIS.Text = drv("CROQUIS").ToString()
                    lCOORD_GEO.Text = drv("COORD_GEO").ToString()
                    lLAT.Text = DD2DMS(drv("LAT")) & " N"
                    tbLAT.Text = drv("LAT")
                    lLON.Text = DD2DMS(drv("LON")) & " O"
                    tbLON.Text = drv("LON")
                    lALT.Text = drv("ALTURA").ToString()
                    lCOORD_CARTO.Text = drv("COORD_CARTO").ToString()
                    Dim x As Double = drv("X")
                    lX.Text = x.ToString("N", CultureInfo.InvariantCulture)
                    Dim y As Double = drv("Y")
                    lY.Text = y.ToString("N", CultureInfo.InvariantCulture)
                    Dim z As Double = drv("Z")
                    lZ.Text = z.ToString("N", CultureInfo.InvariantCulture)
                Next
            Catch ex As Exception
            End Try

            'get contrato data
            Try
                Dim dv As DataView = DirectCast(sqlCONTRATO.Select(DataSourceSelectArguments.Empty), DataView)
                For Each drv As DataRowView In dv
                    tbLOGO.Text = drv("LOGO").ToString()
                    topLeftImg.ImageUrl = "img/" + drv("LOGO").ToString()
                    topLeftImg_P2.ImageUrl = "img/" + drv("LOGO").ToString()
                    topRightImg.ImageUrl = "img/" + drv("LOGO_RIGHT").ToString()
                    topRightImg_P2.ImageUrl = "img/" + drv("LOGO_RIGHT").ToString()
                    lTitelo1.Text = drv("TITULO1").ToString()
                    lTitelo1_P2.Text = drv("TITULO1").ToString()
                    lTitelo2.Text = drv("TITULO2").ToString()
                    lTitulo2_P2.Text = drv("TITULO2").ToString()
                    lTitelo3.Text = drv("TITULO3").ToString()
                    lTitulo3_P2.Text = drv("TITULO3").ToString()
                    lTitelo4.Text = drv("TITULO4").ToString()
                    lTitulo4_P2.Text = drv("TITULO4").ToString()
                    lTitelo5.Text = drv("TITULO5").ToString()
                    lTitulo5_P2.Text = drv("TITULO5").ToString()
                    lTitelo6.Text = drv("TITULO6").ToString()
                    lTitulo6_P2.Text = drv("TITULO6").ToString()
                    lTitelo7.Text = drv("TITULO7").ToString()
                    lTitulo7_P2.Text = drv("TITULO7").ToString()
                Next
            Catch ex As Exception
            End Try

        End If
    End Sub

    Private Function DD2DMS(ByVal DD As Double) As String
        Dim Degrees As Int32 = 0
        Dim Minutes As Single = 0
        Dim Seconds As Single = 0
        Dim DMS As String = ""
        Degrees = Fix(DD)
        Minutes = (DD - Degrees) * 60
        Seconds = (Minutes - Fix(Minutes)) * 60
        DMS = System.Math.Abs(Degrees) & Chr(186) & _
        " " & Format(System.Math.Abs(Fix(Minutes)), "00") & _
        "' " & Format(System.Math.Abs(Seconds), "00.00") & Chr(34)
        Return DMS
    End Function

    Protected Sub saveCroquis() Handles ASPsaveCroquis.Click
        Try
            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "UPDATE [GIS].[dbo].[CTRL_CONTROL] SET CROQUIS = @CROQUIS WHERE CONTRATO_CTRLID = @CONTRATO_CTRLID;"
            cmd.Parameters.AddWithValue("@CROQUIS", tbCROQUIS.Text)
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID", tbCONTRATO_CTRLID.Text)
            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "document.getElementById('saveCroquis').style.visibility = 'hidden';", True)
            End If

        Catch ex As Exception
            conn.Close()
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "alert('SQL save fail');", True)
        End Try
    End Sub

    Protected Sub saveDesc() Handles ASPsaveDesc.Click
        Try
            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "UPDATE [GIS].[dbo].[CTRL_CONTROL] SET DESCRIPCION = @DESCRIPCION WHERE CONTRATO_CTRLID = @CONTRATO_CTRLID;"
            cmd.Parameters.AddWithValue("@DESCRIPCION", tbDESCRIPCION.Text)
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID", tbCONTRATO_CTRLID.Text)
            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "document.getElementById('saveDESCRIPCION').style.visibility = 'hidden'; document.getElementById('tbDESCRIPCION').style.backgroundColor = '#FFF';", True)
            End If

        Catch ex As Exception
            conn.Close()
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "alert('SQL save fail');", True)
        End Try

    End Sub

    Protected Sub createSAS()
        Dim sas = blobContainer.GetSharedAccessSignature(New SharedAccessBlobPolicy() With { _
        .Permissions = SharedAccessBlobPermissions.Write, _
        .SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(360)})
        tbSAS.Text = String.Format(CultureInfo.InvariantCulture, "{0}{1}", blobContainer.Uri, sas)
    End Sub

End Class