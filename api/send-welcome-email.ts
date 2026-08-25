import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, fullName, memberId } = req.body;

  if (!email || !fullName || !memberId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Use provided SMTP credentials
  const transporter = nodemailer.createTransport({
    host: 'mail.boltonwhitegroup.com',
    port: 465,
    secure: true,
    auth: {
      user: 'loyalty@boltonwhitegroup.com',
      pass: 'LOYALTYART2021///BWGBRAND',
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bolton Luxe</title>
      <style>
        body {
          font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background-color: #111827;
          padding: 40px 30px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 20px;
          color: #111827;
        }
        .message {
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .card-container {
          background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
          border-radius: 16px;
          padding: 30px;
          color: #ffffff;
          margin: 30px 0;
          position: relative;
          overflow: hidden;
          border: 1px solid #374151;
        }
        .card-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
          transform: rotate(30deg);
          pointer-events: none;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .card-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
        }
        .card-tier {
          font-size: 14px;
          font-weight: 600;
          color: #d1d5db;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .card-member-name {
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .card-member-id {
          font-size: 14px;
          font-family: monospace;
          color: #9ca3af;
          letter-spacing: 0.1em;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 30px;
          text-align: center;
          font-size: 13px;
          color: #6b7280;
        }
        .button {
          display: inline-block;
          background-color: #111827;
          color: #ffffff;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 15px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bolton Luxe</h1>
        </div>
        <div class="content">
          <div class="greeting">Welcome to Bolton Luxe, ${fullName}.</div>
          <div class="message">
            We are thrilled to welcome you to our exclusive loyalty program. As a member, you'll enjoy unparalleled service, exclusive rates, and curated experiences designed just for you. Below is your digital loyalty card which you can use for your upcoming stays.
          </div>
          
          <div class="card-container">
            <div class="card-header">
              <div class="card-title">Membership Card</div>
              <div class="card-tier">Bronze</div>
            </div>
            <div class="card-member-name">${fullName}</div>
            <div class="card-member-id">${memberId}</div>
          </div>

          <div class="message" style="text-align: center;">
            <a href="https://loyalty.boltonwhitegroup.com/login" class="button">Access Your Account</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Bolton White Group. All rights reserved.<br>
          If you have any questions, please reply to this email.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Bolton White Group" <loyalty@boltonwhitegroup.com>',
      to: email,
      subject: 'Welcome to Bolton Luxe Loyalty Program',
      html: htmlContent,
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
