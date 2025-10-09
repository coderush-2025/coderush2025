const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  try {
    console.log('📧 Testing email configuration...\n');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('SMTP User:', process.env.SMTP_USER);
    console.log('Password configured:', !!process.env.SMTP_PASSWORD);
    console.log('');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send test email
    console.log('📨 Sending test email to adithaf7@gmail.com...');
    const info = await transporter.sendMail({
      from: `"CodeRush 2025 Test" <${process.env.SMTP_USER}>`,
      to: 'adithaf7@gmail.com',
      subject: '🧪 Test Email - CodeRush 2025 Email Service',
      text: `This is a test email from CodeRush 2025 registration system.

The email service is working correctly!

Configuration:
- SMTP Host: ${process.env.SMTP_HOST}
- From Email: ${process.env.SMTP_USER}
- Timestamp: ${new Date().toLocaleString()}

If you received this email, the email service is fully operational.`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #37c2cc 0%, #2ba8b3 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .info-box {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #37c2cc;
      border-radius: 5px;
    }
    .success-badge {
      background: #4CAF50;
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      display: inline-block;
      margin: 15px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 Test Email</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">CodeRush 2025 Email Service</p>
  </div>

  <div class="content">
    <div class="success-badge">✅ Email Service Working!</div>

    <p>This is a test email from the CodeRush 2025 registration system.</p>

    <div class="info-box">
      <h3 style="margin-top: 0; color: #37c2cc;">Email Configuration</h3>
      <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
      <p><strong>From Email:</strong> ${process.env.SMTP_USER}</p>
      <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
    </div>

    <p>If you received this email, the email service is <strong>fully operational</strong> and ready to send registration confirmation emails.</p>

    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>CodeRush 2025 Team</strong>
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #777; font-size: 14px;">
    <p>This is an automated test email.</p>
  </div>
</body>
</html>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Sent to: adithaf7@gmail.com');
    console.log('\n✨ Email service is working correctly!');

  } catch (error) {
    console.error('❌ Email test failed:', error);
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Please check:');
      console.error('   - SMTP_USER is correct');
      console.error('   - SMTP_PASSWORD (app password) is correct');
      console.error('   - 2-Step Verification is enabled on the Gmail account');
    }
  }
}

testEmail();
