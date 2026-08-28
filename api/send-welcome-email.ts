import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, fullName, memberId, tier = 'Standard', points = 500 } = req.body;

  if (!email || !fullName || !memberId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const firstName = fullName.split(' ')[0];

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
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f5f6f8;
          color: #050505;
          margin: 0;
          padding: 40px 20px;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .header {
          padding: 30px 40px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #111;
          text-decoration: none;
        }
        .header-link {
          font-size: 14px;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }
        .content {
          padding: 20px 40px 40px;
        }
        h1 {
          font-size: 40px;
          line-height: 1.1;
          font-weight: 800;
          margin: 0 0 30px;
          color: #000;
          letter-spacing: -1px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          color: #111;
          margin: 0 0 24px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5; /* Match Miro blue/indigo style */
          color: #ffffff;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 100px; /* Pill shape */
          font-weight: 500;
          font-size: 16px;
          margin: 10px 0 30px;
          transition: background-color 0.2s;
        }
        .perks-box {
          background-color: #f4f5f9;
          border-radius: 12px;
          padding: 30px;
          margin: 10px 0;
        }
        .perks-box h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 15px;
          color: #000;
        }
        .perks-box p {
          font-size: 15px;
          margin-bottom: 10px;
        }
        .perks-box p:last-child {
          margin-bottom: 0;
        }
        .card-container {
          background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
          border-radius: 12px;
          padding: 24px;
          color: #ffffff;
          margin-top: 20px;
          border: 1px solid #374151;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .card-tier {
          font-size: 12px;
          font-weight: 600;
          color: #d1d5db;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .card-member-name {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .card-member-id {
          font-size: 13px;
          font-family: monospace;
          color: #9ca3af;
        }
        .footer {
          padding: 0 40px 40px;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 0;
          }
          .container {
            border-radius: 0;
            box-shadow: none;
          }
          .header {
            padding: 20px 20px 10px;
          }
          .content {
            padding: 10px 20px 30px;
          }
          h1 {
            font-size: 30px;
            margin-bottom: 20px;
          }
          .footer {
            padding: 0 20px 30px;
          }
          .perks-box, .card-container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <span style="display:inline-block; width: 100%;">
            <a href="https://boltonwhitegroup.com" class="logo" style="float:left;">Bolton Luxe</a>
            <a href="https://loyalty.boltonwhitegroup.com/login" class="header-link" style="float:right; margin-top: 6px;">Sign in &rarr;</a>
          </span>
          <div style="clear:both;"></div>
        </div>

        <div class="content">
          <!-- Big Bold Heading -->
          <h1>Welcome to Bolton Luxe</h1>
          
          <p>
            Hi ${firstName},
          </p>
          <p>
            Welcome to the Bolton Luxe loyalty program. We are delighted to have you as a member, and we're committed to making your future stays with us more rewarding.
          </p>
          <p>
            As a member, you'll unlock curated experiences, priority services, and exclusive rates across all our properties. We look forward to hosting you soon.
          </p>

          <!-- Primary Button -->
          <a href="https://loyalty.boltonwhitegroup.com/login" class="button" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 100px; font-weight: 500; font-size: 16px; margin: 10px 0 30px;">Access your account &rarr;</a>

          <!-- Info Box (like the Miro "As a thank you" box) -->
          <div class="perks-box">
            <h2>Your Membership Details</h2>
            <p>
              You've officially joined as a <strong>${tier}</strong> member. Start earning points on every stay, unlock complimentary room upgrades, and enjoy late check-outs.
            </p>
            
            <!-- Sleek Digital Card inside the box -->
            <div class="card-container">
              <div class="card-header">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Digital Card</div>
                <div class="card-tier">${tier}</div>
              </div>
              <div class="card-member-name">${fullName}</div>
              <div class="card-member-id">${memberId}</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          Thank you, and happy travels!<br>
          The Bolton Luxe Concierge Team
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
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
}
