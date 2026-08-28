import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, fullName, memberId, tier = 'Standard' } = req.body;

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
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { padding: 20px; }
        .detail { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Bolton Luxe Member Registration</h2>
        <p>A new member has just joined the Bolton Luxe loyalty program. Here are their details:</p>
        <ul>
          <li><span class="detail">Name:</span> ${fullName}</li>
          <li><span class="detail">Email:</span> ${email}</li>
          <li><span class="detail">Member ID:</span> ${memberId}</li>
          <li><span class="detail">Tier:</span> ${tier}</li>
        </ul>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Bolton Luxe System" <loyalty@boltonwhitegroup.com>',
      to: ['keys.peculiar@boltonwhitegroup.com', 'info@boltonwhitegroup.com'],
      subject: 'New Member Joined - Bolton Luxe Loyalty Program',
      html: htmlContent,
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
}
