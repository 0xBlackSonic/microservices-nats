interface ITemplate {
  baseUrl: string;
  path: string;
  email: string;
  accessToken: string;
}

export const emailConfig = {
  from: "no-reply@resend.dev",
  subject: "Passwordless Email SignIn (Test)",
  baseUrl: "https://some-frontend-url.com",
  verificationPath: "/auth/verify",
  template: function (email: string, accessToken: string) {
    return htmlTemplate({
      baseUrl: this.baseUrl,
      path: this.verificationPath,
      email,
      accessToken,
    });
  },
};

const htmlTemplate = (data: ITemplate) => {
  return `
    <body style="background: #f9f9f9;">
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            Sign in to <strong>${data.baseUrl}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" >
                	<div style="border-radius: 5px; background-color: #346df1; width: 120px">
                  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #fff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">Sign in</a>
                  </div>
                </td>
              </tr>
              <tr >
              	<td align="center" style="padding: 15px 0px;font-size: 14px; font-family: Helvetica, Arial, sans-serif; color: #555;">
                  [ link: ${data.baseUrl}${data.path}/?email=${data.email}&accessToken=${data.accessToken} ]
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  `;
};
