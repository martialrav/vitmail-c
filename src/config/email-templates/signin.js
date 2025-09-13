const html = ({ email, url }) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to Vitmail-C</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; color: #f97316; margin-bottom: 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🍊 Vitmail-C</div>
        <p>Boost Your Domain's Immunity System</p>
    </div>
    
    <h2>Welcome to Vitmail-C!</h2>
    <p>You're signing in with <strong>${email}</strong></p>
    
    <p>Just like Vitamin C strengthens your immune system, Vitmail-C fortifies your domain's email infrastructure!</p>
    
    <div style="text-align: center;">
        <a href="${url}" class="button" target="_blank">🔍 Sign In to Your Dashboard</a>
    </div>
    
    <p><strong>Alternative:</strong> Copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">${url}</p>
    
    <div class="footer">
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p>Need help? Just reply to this email!</p>
        <p>Cheers,<br />The Vitmail-C Team 🍊</p>
    </div>
</body>
</html>
`;
};

const text = ({ email, url }) => {
  return `
🍊 Vitmail-C - Boost Your Domain's Immunity System

Welcome to Vitmail-C!

You're signing in with: ${email}

Just like Vitamin C strengthens your immune system, Vitmail-C fortifies your domain's email infrastructure!

Sign in to your dashboard: ${url}

If you didn't request this email, you can safely ignore it.

Need help? Just reply to this email!

Cheers,
The Vitmail-C Team 🍊
`;
};

export { html, text };
