Imports System.Configuration
Imports System.Diagnostics
Imports System.IO
Imports System.Net
Imports System.Text
Imports System.Web

''' <summary>
''' adapted from: http://code.google.com/p/iisproxy
''' </summary>
Public Class proxy

    Implements IHttpHandler

    Public Sub ProcessRequest(context As HttpContext) Implements IHttpHandler.ProcessRequest

        Dim watch As New Stopwatch()
        watch.Start()

        Try

            Dim uri As String = context.Request.QueryString("url")
            If [String].IsNullOrEmpty(uri) Then
                Throw New ArgumentException("url parameter null")
            End If

            Dim sb As New StringBuilder()
            For Each s As String In context.Request.QueryString
                If Not [String].Equals(s, "url") Then
                    sb.AppendFormat("&{0}={1}", s, context.Request.QueryString(s))
                End If
            Next
            If sb.Length > 0 Then
                uri += [String].Format("?{0}", sb.Remove(0, 1))
            End If

            Dim req As HttpWebRequest = DirectCast(WebRequest.Create(uri), HttpWebRequest)
            req.AllowAutoRedirect = False
            req.Method = context.Request.HttpMethod
            req.ContentType = context.Request.ContentType
            req.UserAgent = context.Request.UserAgent

            Dim basicPwd As String = ConfigurationManager.AppSettings.[Get]("basicPwd")
            req.Credentials = If(basicPwd Is Nothing, CredentialCache.DefaultCredentials, New NetworkCredential(context.User.Identity.Name, basicPwd))
            req.PreAuthenticate = True
            req.Headers("Remote-User") = context.User.Identity.Name

            For Each s As String In context.Request.Headers
                If Not WebHeaderCollection.IsRestricted(s) AndAlso Not [String].Equals(s, "Remote-User") Then
                    req.Headers.Add(s, context.Request.Headers(s))
                End If
            Next

            If context.Request.HttpMethod = "POST" Then
                Dim outputStream As Stream = req.GetRequestStream()
                CopyStream(context.Request.InputStream, outputStream)
                outputStream.Close()
            End If

            Dim response As HttpWebResponse
            Try
                response = DirectCast(req.GetResponse(), HttpWebResponse)
            Catch we As WebException
                response = DirectCast(we.Response, HttpWebResponse)
                If response Is Nothing Then
                    context.Response.StatusCode = 13
                    context.Response.Write("Could not contact back-end site")
                    context.Response.[End]()
                    Return
                End If
            End Try

            context.Response.StatusCode = CInt(response.StatusCode)
            context.Response.StatusDescription = response.StatusDescription
            context.Response.ContentType = response.ContentType
            If response.Headers.[Get]("Location") IsNot Nothing Then
                Dim urlSuffix As String = response.Headers.[Get]("Location")
                If urlSuffix.ToLower().StartsWith(ConfigurationManager.AppSettings("ProxyUrl").ToLower()) Then
                    urlSuffix = urlSuffix.Substring(ConfigurationManager.AppSettings("ProxyUrl").Length)
                End If
                context.Response.AddHeader("Location", context.Request.Url.GetLeftPart(UriPartial.Authority) & urlSuffix)
            End If

            For Each s As String In response.Headers
                If Not WebHeaderCollection.IsRestricted(s) AndAlso Not [String].Equals(s, "Location") Then
                    context.Response.AddHeader(s, response.Headers(s))
                End If
            Next

            CopyStream(response.GetResponseStream(), context.Response.OutputStream)
            response.Close()
            context.Response.[End]()

        Catch ex As Exception
            Trace.WriteLine("proxy error: " & Convert.ToString(ex))
            Throw

        Finally
            watch.[Stop]()
            Dim message As String = [String].Format("request sent in {0} milliseconds", watch.ElapsedMilliseconds)
            Debug.WriteLine(message)
        End Try

    End Sub

    Private Shared Sub CopyStream(input As Stream, output As Stream)

        Dim buffer As Byte() = New Byte(1023) {}
        Dim bytes As Integer
        While (InlineAssignHelper(bytes, input.Read(buffer, 0, 1024))) > 0
            output.Write(buffer, 0, bytes)
        End While

    End Sub

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable

        Get
            Return False
        End Get

    End Property

    Private Shared Function InlineAssignHelper(Of T)(ByRef target As T, value As T) As T

        target = value
        Return value

    End Function

End Class