Imports System.Data
Imports System.Data.SqlClient
Imports System.Configuration
Imports System.Globalization
Imports Microsoft.WindowsAzure.Storage
Imports Microsoft.WindowsAzure.Storage.Auth
Imports Microsoft.WindowsAzure.Storage.Blob
Imports Microsoft.WindowsAzure.Storage.Shared.Protocol

Public Class WebMap

    Inherits System.Web.UI.Page

    Private storageAccount As CloudStorageAccount
    Private blobClient As CloudBlobClient
    Private serviceProperties As ServiceProperties
    Private blobContainer As CloudBlobContainer
    Private conn As SqlConnection

    Protected Sub Page_Load() Handles Me.Load
        storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings("StorageConnectionString").ConnectionString)
        blobClient = storageAccount.CreateCloudBlobClient
        blobContainer = blobClient.GetContainerReference("control")
        createSAS()

        'removeCorsRule()
        'setCorsRule()
        'addCorsRule()

        tbCONTRATO.Attributes.Add("readonly", "readonly")
        tbCTRLID.Attributes.Add("onkeyup", "change(this);")
        ddCTRLTYPE.Attributes.Add("onchange", "change(this);")
        tbDESCRIPCION.Attributes.Add("onkeyup", "change(this);")

    End Sub

    Protected Sub saveChg() Handles ASPsaveChg.Click
        Try
            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "UPDATE [GIS].[dbo].[CTRL_CONTROL] SET CONTRATO_CTRLID = @CONTRATO_CTRLID_NEW, CTRLID = @CTRLID, CTRLTYPE = @CTRLTYPE, DESCRIPCION = @DESCRIPCION, GEOMETRY = geometry::Point(@X, @Y, 0) WHERE CONTRATO_CTRLID = @CONTRATO_CTRLID;"
            cmd.Parameters.AddWithValue("@CTRLID", tbCTRLID.Text)
            cmd.Parameters.AddWithValue("@CTRLTYPE", ddCTRLTYPE.Text)
            cmd.Parameters.AddWithValue("@DESCRIPCION", tbDESCRIPCION.Text)
            cmd.Parameters.AddWithValue("@X", tbX.Text)
            cmd.Parameters.AddWithValue("@Y", tbY.Text)
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID", tbCONTRATO_CTRLID.Text)
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID_NEW", tbCONTRATO.Text & "_" & tbCTRLID.Text)

            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()

                Dim blockBlob As CloudBlockBlob
                Dim blockBlobTarget As CloudBlockBlob
                Try
                    blockBlob = blobContainer.GetBlockBlobReference(tbCONTRATO_CTRLID.Text + "_DETALLE.jpg")
                    blockBlobTarget = blobContainer.GetBlockBlobReference(tbCONTRATO.Text & "_" & tbCTRLID.Text + "_DETALLE.jpg")
                    blockBlobTarget.StartCopyFromBlob(blockBlob)
                Catch
                End Try
                Try
                    blockBlob = blobContainer.GetBlockBlobReference(tbCONTRATO_CTRLID.Text + "_PANORAMICO.jpg")
                    blockBlobTarget = blobContainer.GetBlockBlobReference(tbCONTRATO.Text & "_" & tbCTRLID.Text + "_PANORAMICO.jpg")
                    blockBlobTarget.StartCopyFromBlob(blockBlob)
                Catch
                End Try
                Try
                    blockBlob = blobContainer.GetBlockBlobReference(tbCONTRATO_CTRLID.Text + "_PLACA.jpg")
                    blockBlobTarget = blobContainer.GetBlockBlobReference(tbCONTRATO.Text & "_" & tbCTRLID.Text + "_PLACA.jpg")
                    blockBlobTarget.StartCopyFromBlob(blockBlob)
                Catch
                End Try
                Try
                    blockBlob = blobContainer.GetBlockBlobReference(tbCONTRATO_CTRLID.Text + "_MEDICION.jpg")
                    blockBlobTarget = blobContainer.GetBlockBlobReference(tbCONTRATO.Text & "_" & tbCTRLID.Text + "_MEDICION.jpg")
                    blockBlobTarget.StartCopyFromBlob(blockBlob)
                Catch
                End Try

                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedOK();", True)
            End If

        Catch ex As Exception
            conn.Close()
            If ex.ToString.Contains("UNIQUE KEY") Then
                tbEX.Text = "SQL save failed due to unique ID violation"
            Else
                tbEX.Text = ex.ToString
            End If
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedFail();", True)
        End Try
    End Sub

    Protected Sub saveNew() Handles ASPsaveNew.Click
        Try
            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "INSERT INTO [GIS].[dbo].[CTRL_CONTROL] (GEOMETRY,CONTRATO_CTRLID,CONTRATO,CTRLID,CTRLTYPE,DESCRIPCION,LAT,LON,COORD_GEO,X,Y,COORD_CARTO) VALUES (geometry::Point(@X, @Y, 0), @CONTRATO_CTRLID, @CONTRATO, @CTRLID, @CTRLTYPE, @DESCRIPCION, @LAT, @LON, @COORD_GEO, @X, @Y, @COORD_CARTO);"
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID", tbCONTRATO.Text & "_" & tbCTRLID.Text)
            cmd.Parameters.AddWithValue("@CONTRATO", tbCONTRATO.Text)
            cmd.Parameters.AddWithValue("@CTRLID", tbCTRLID.Text)
            cmd.Parameters.AddWithValue("@CTRLTYPE", ddCTRLTYPE.Text)
            cmd.Parameters.AddWithValue("@DESCRIPCION", tbDESCRIPCION.Text)
            cmd.Parameters.AddWithValue("@LAT", Convert.ToDouble(tbLAT.Text))
            cmd.Parameters.AddWithValue("@LON", Convert.ToDouble(tbLON.Text))
            cmd.Parameters.AddWithValue("@COORD_GEO", "WGS84")
            cmd.Parameters.AddWithValue("@X", Convert.ToDouble(tbX.Text))
            cmd.Parameters.AddWithValue("@Y", Convert.ToDouble(tbY.Text))
            cmd.Parameters.AddWithValue("@COORD_CARTO", "EPSG:3857")

            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedOK();", True)
            End If

        Catch ex As Exception
            conn.Close()
            If ex.ToString.Contains("UNIQUE KEY") Then
                tbEX.Text = "SQL save failed due to unique ID violation"
            Else
                tbEX.Text = ex.ToString
            End If
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedFail();", True)
        End Try
    End Sub

    Protected Sub delete() Handles ASPdelete.Click
        Try
            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "DELETE FROM [GIS].[dbo].[CTRL_CONTROL] WHERE CONTRATO_CTRLID = @CONTRATO_CTRLID;"
            cmd.Parameters.AddWithValue("@CONTRATO_CTRLID", tbCONTRATO_CTRLID.Text)

            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedOK();", True)
            End If

        Catch ex As Exception
            conn.Close()
            tbEX.Text = ex.ToString
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedFail();", True)
        End Try
    End Sub

    Protected Sub createSAS()
        Dim sas = blobContainer.GetSharedAccessSignature(New SharedAccessBlobPolicy() With { _
        .Permissions = SharedAccessBlobPermissions.Write, _
        .SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(360)})
        tbSAS.Text = String.Format(CultureInfo.InvariantCulture, "{0}{1}", blobContainer.Uri, sas)
    End Sub

    Protected Sub removeCorsRule()
        serviceProperties = blobClient.GetServiceProperties()
        Dim corsSettings = serviceProperties.Cors
        corsSettings.CorsRules.Clear()
        blobClient.SetServiceProperties(serviceProperties)
    End Sub

    Protected Sub setCorsRule()
        Try
            serviceProperties = blobClient.GetServiceProperties()
            Dim corsRule = New CorsRule() With { _
                .AllowedHeaders = New List(Of String)() From {"x-ms-*", "content-type", "accept"}, _
                .AllowedMethods = CorsHttpMethods.Put, _
                .AllowedOrigins = New List(Of String)() From {"http://localhost", "http://argeomatica.cloudapp.net"}, _
                .MaxAgeInSeconds = 60}
            Dim corsSettings = serviceProperties.Cors
            corsSettings.CorsRules.Add(corsRule)
            blobClient.SetServiceProperties(serviceProperties)
        Catch ex As Exception
        End Try
    End Sub

    Protected Sub addCorsRule()
        Try
            serviceProperties = blobClient.GetServiceProperties()
            Dim corsSettings = serviceProperties.Cors
            Dim corsRuleToBeUpdated = corsSettings.CorsRules.FirstOrDefault(Function(a) a.AllowedOrigins.Contains("http://localhost"))
            If corsRuleToBeUpdated IsNot Nothing Then
                corsRuleToBeUpdated.AllowedMethods = corsRuleToBeUpdated.AllowedMethods Or CorsHttpMethods.Post
                blobClient.SetServiceProperties(serviceProperties)
            End If
        Catch ex As Exception
        End Try
    End Sub

End Class