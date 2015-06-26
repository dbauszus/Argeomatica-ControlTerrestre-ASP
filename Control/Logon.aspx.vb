Public Class Logon
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub

    Protected Sub LoginButton_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles Password.TextChanged
        Dim users() As String = {"dennis", "argeomatica"}
        Dim passwords() As String = {"dragon", "16septiembre"}
        For i As Integer = 0 To users.Length - 1
            Dim validUsername As Boolean = (String.Compare(UserName.Text, users(i), True) = 0)
            Dim validPassword As Boolean = (String.Compare(Password.Text, passwords(i), False) = 0)
            If validUsername AndAlso validPassword Then

                FormsAuthentication.RedirectFromLoginPage(UserName.Text, False)

            End If
        Next
        ' If we reach here, the user's credentials were invalid
        InvalidCredentialsMessage.Visible = True
    End Sub

End Class