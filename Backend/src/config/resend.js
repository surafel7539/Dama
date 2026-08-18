
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  console.log("Sending verification email...");
  console.log("To:", email);
  console.log("From:", process.env.EMAIL_FROM);
  console.log("Verification URL:", verificationUrl);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Verify your DAMA account",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 0;
          background: #041c14;
          font-family: Arial, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            padding: 40px;
            background: #0a291f;
            border-radius: 16px;
            color: white;
          ">

            <h1 style="
              color: #c29b57;
              margin-bottom: 20px;
            ">
              Welcome to DAMA
            </h1>

            <p>
              Thanks for creating your DAMA account.
            </p>

            <p>
              Please verify your email address by clicking
              the button below.
            </p>

            <div style="margin: 30px 0;">
              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #c29b57;
                  color: #041c14;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                "
              >
                Verify Email
              </a>
            </div>

            <p style="color: #aaa; font-size: 14px;">
              This verification link expires in 30 minutes.
            </p>

            <p style="color: #777; font-size: 12px;">
              If you didn't create a DAMA account, you can safely ignore
              this email.
            </p>

          </div>

        </body>
      </html>
    `,
  });

  if (error) {
    console.error("========== RESEND ERROR ==========");
    console.error(error);
    console.error("==================================");

    throw new Error(
      error.message || "Failed to send verification email"
    );
  }

  console.log("Verification email sent:", data);

  return data;
};

