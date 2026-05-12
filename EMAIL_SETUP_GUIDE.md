# Email Setup Guide - Gmail Configuration

## Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Gmail account mein login karein
2. Google Account settings mein jaayen: https://myaccount.google.com/
3. **Security** section mein jaayen
4. **2-Step Verification** enable karein

### Step 2: Generate App Password
1. Security settings mein **App passwords** option dhundein
2. **Select app** dropdown se **Mail** select karein
3. **Select device** dropdown se **Other** select karein
4. Name enter karein: "AI Health Assistant"
5. **Generate** button click karein
6. 16-digit password copy karein (spaces ke saath)

### Step 3: Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
CLIENT_URL=http://localhost:5173
```

**Important:** 
- `EMAIL_PASSWORD` mein 16-digit app password paste karein (spaces ke saath ya bina)
- Regular Gmail password use na karein, sirf App Password use karein

## Alternative Email Services

### SendGrid
```javascript
// server/services/emailService.js
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Testing Email Service

### Test Command (Optional)
Create a test file `server/test-email.js`:

```javascript
import { sendVerificationEmail } from './services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  const result = await sendVerificationEmail('test@example.com', '123456');
  console.log('Result:', result);
};

testEmail();
```

Run: `node server/test-email.js`

## Troubleshooting

### Error: "Invalid login"
- 2-Factor Authentication enable hai?
- App Password correctly copy kiya hai?
- Regular password use kar rahe ho? (App Password use karein)

### Error: "Connection timeout"
- Internet connection check karein
- Firewall settings check karein
- Port 587 blocked to nahi hai?

### Email not received
- Spam folder check karein
- Email address correct hai?
- Gmail daily sending limit (500 emails/day) exceed to nahi hui?

## Production Recommendations

1. **Environment Variables**: Production mein sensitive data environment variables mein store karein
2. **Rate Limiting**: Email sending ko rate limit karein (abuse prevent karne ke liye)
3. **Email Queue**: Heavy traffic ke liye Bull/Redis queue use karein
4. **Professional Service**: Production mein SendGrid, AWS SES, ya Mailgun use karein
5. **Email Templates**: HTML templates ko separate files mein rakhein
6. **Logging**: Email sending logs maintain karein
7. **Error Handling**: Proper error handling aur retry mechanism implement karein

## Current Features

✅ Verification code email (6-digit)
✅ Password reset email with link
✅ Beautiful HTML email templates
✅ 10-minute code expiry
✅ Development mode mein console fallback
✅ Error handling

## Email Templates

### Verification Email
- Professional design
- Large, clear verification code
- Expiry warning
- Security notice

### Password Reset Email
- Reset link button
- Expiry information
- Security warning
- Professional branding
