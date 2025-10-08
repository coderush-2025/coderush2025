import nodemailer from 'nodemailer';

interface TeamRegistrationData {
  teamName: string;
  hackerrankUsername: string;
  teamBatch: string;
  leaderName: string;
  leaderEmail: string;
  leaderIndex: string;
  members: {
    fullName: string;
    indexNumber: string;
    email: string;
  }[];
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send registration confirmation email to team leader
 */
export async function sendRegistrationEmail(data: TeamRegistrationData) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('⚠️ Email not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();

    // Email HTML template
    const htmlContent = `
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
    .header h1 {
      margin: 0;
      font-size: 28px;
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
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: bold;
      width: 180px;
      color: #555;
    }
    .info-value {
      color: #333;
    }
    .members-section {
      margin-top: 20px;
    }
    .member-card {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    .member-name {
      font-weight: bold;
      color: #37c2cc;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding: 20px;
      color: #777;
      font-size: 14px;
    }
    .success-badge {
      background: #4CAF50;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      display: inline-block;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Registration Successful!</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">CodeRush 2025</p>
  </div>

  <div class="content">
    <p>Dear <strong>${data.leaderName}</strong>,</p>

    <p>Congratulations! Your team has been successfully registered for <strong>CodeRush 2025</strong>.</p>

    <div class="info-box">
      <h3 style="margin-top: 0; color: #37c2cc;">Team Details</h3>
      <div class="info-row">
        <span class="info-label">Team Name:</span>
        <span class="info-value">${data.teamName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">HackerRank Username:</span>
        <span class="info-value">${data.hackerrankUsername}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Batch:</span>
        <span class="info-value">Batch ${data.teamBatch}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Team Size:</span>
        <span class="info-value">4 Members</span>
      </div>
    </div>

    <div class="members-section">
      <h3 style="color: #37c2cc;">Team Members</h3>

      <div class="member-card">
        <div class="member-name">👑 ${data.leaderName} (Team Leader)</div>
        <div style="color: #666; margin-top: 5px;">
          📧 ${data.leaderEmail}<br>
          🆔 ${data.leaderIndex}
        </div>
      </div>

      ${data.members.map((member, index) => `
        <div class="member-card">
          <div class="member-name">👤 ${member.fullName} (Member ${index + 2})</div>
          <div style="color: #666; margin-top: 5px;">
            📧 ${member.email}<br>
            🆔 ${member.indexNumber}
          </div>
        </div>
      `).join('')}
    </div>

    <div style="background: #e8f5f7; padding: 20px; margin-top: 30px; border-radius: 8px; border-left: 4px solid #37c2cc;">
      <h3 style="margin-top: 0; color: #37c2cc;">📌 What's Next?</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Check your email regularly for updates</li>
        <li>Join our official communication channels (details will be shared soon)</li>
        <li>Start preparing with your team!</li>
        <li>Competition details and schedule will be announced shortly</li>
      </ul>
    </div>

    <p style="margin-top: 30px;">If you have any questions or need assistance, feel free to reach out to us.</p>

    <p>Good luck, and may the best team win! 🏆</p>

    <p style="margin-top: 30px;">
      Best regards,<br>
      <strong>CodeRush 2025 Organizing Team</strong>
    </p>
  </div>

  <div class="footer">
    <p>This is an automated confirmation email. Please do not reply to this message.</p>
    <p style="color: #999; font-size: 12px;">© 2025 CodeRush. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Registration Successful - CodeRush 2025

Dear ${data.leaderName},

Congratulations! Your team has been successfully registered for CodeRush 2025.

Team Details:
- Team Name: ${data.teamName}
- HackerRank Username: ${data.hackerrankUsername}
- Batch: Batch ${data.teamBatch}
- Team Size: 4 Members

Team Members:
1. ${data.leaderName} (Team Leader)
   Email: ${data.leaderEmail}
   Index: ${data.leaderIndex}

${data.members.map((member, index) => `${index + 2}. ${member.fullName}
   Email: ${member.email}
   Index: ${member.indexNumber}`).join('\n\n')}

What's Next?
- Check your email regularly for updates
- Join our official communication channels (details will be shared soon)
- Start preparing with your team!
- Competition details and schedule will be announced shortly

If you have any questions or need assistance, feel free to reach out to us.

Good luck, and may the best team win!

Best regards,
CodeRush 2025 Organizing Team

---
This is an automated confirmation email. Please do not reply to this message.
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"CodeRush 2025" <${process.env.SMTP_USER}>`,
      to: data.leaderEmail,
      subject: `🎉 Registration Confirmed - Team ${data.teamName} | CodeRush 2025`,
      text: textContent,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
