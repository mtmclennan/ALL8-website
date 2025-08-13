'use server';

import { google } from 'googleapis';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

// 📌 Form Validation Schema
const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  workType: z.string().min(2, 'Must have a work type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  token: z.string(),
});

// 📌 Spam Filtering
const spamKeywords = [
  'viagra',
  'free money',
  'buy followers',
  'SEO services',
  'bitcoin',
  'casino',
  'earn money fast',
  'cheap loans',
  'adult content',
];

function isSpamMessage(message: string) {
  return spamKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
}

function isDisposableEmail(email: string) {
  const disposableDomains = [
    'tempmail.com',
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
  ];
  return disposableDomains.some((domain) => email.endsWith(`@${domain}`));
}

// 📌 Contact Form Submission Handler
export async function sendContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  workType: string;
  message: string;
  token: string;
}) {
  // 🔹 Validate Form Data
  const parsed = formSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  if (isSpamMessage(data.message) || isDisposableEmail(data.email)) {
    return {
      error: 'Suspicious activity detected. Your request was not sent.',
    };
  }

  // 🔹 Verify reCAPTCHA on the Server
  const recaptchaVerify = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${data.token}`,
    }
  );

  const recaptchaData = await recaptchaVerify.json();
  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return { error: 'Failed reCAPTCHA verification. Try again.' };
  }

  // 🔹 Configure Mailtrap SMTP Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT || '587'),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  // 🔹 Define Email Messages

  const businessMailOptions = {
    from: process.env.EMAIL_FROM,
    to: `${process.env.RECIPIENT_EMAIL}, ${process.env.BOSS_EMAIL}`,
    subject: `🔔 New ${data.workType} Estimate Request`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff; color: #202020;">
      
      <div style="background-color: #202020; padding: 15px; text-align: center;">
        <img src="https://bellhouseexcavating.ca/assets/BellhouseLogo-text-LS.png" alt="Bellhouse Excavating Logo" style="max-width: 200px; margin-bottom: 10px;">
        <h2 style="color: #ffc302;">New Estimate Request</h2>
      </div>
  
      <div style="padding: 20px;">
        <p><strong>📌 Submitted On:</strong> ${new Date().toLocaleString()}</p>
  
        <hr style="border: none; border-top: 2px solid #ffc302; margin: 15px 0;">
  
        <h3 style="color: #ffc302;">Customer Details</h3>
        <p><strong>👤 Name:</strong> ${data.name}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${
          data.email
        }" style="color: #202020; text-decoration: none;">${data.email}</a></p>
        <p><strong>📞 Phone:</strong> ${data.phone || 'Not provided'}</p>
  
        <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
  
        <h3 style="color: #ffc302;">Request Details</h3>
        <p><strong>🚧 Service Requested:</strong> ${data.workType}</p>
        <p><strong>📝 Message:</strong><br>${
          data.message || '<em>No additional details provided.</em>'
        }</p>
  
        <hr style="border: none; border-top: 2px solid #ffc302; margin: 15px 0;">
  
        <p><strong>⚠️ Action Required:</strong> Please follow up with the customer as soon as possible.</p>
      </div>
  
      <div style="text-align: center; background-color: #202020; padding: 10px; color: #ffffff;">
        <p><strong>Bellhouse Excavating</strong></p>
        <p>📞 <a href="tel:5197528500" style="color: #ffc302; text-decoration: none;">519-752-8500</a> | 
           📧 <a href="mailto:info@bellhouseexcavating.ca" style="color: #ffc302; text-decoration: none;">info@bellhouseexcavating.ca</a> | 
           🌐 <a href="https://bellhouseexcavating.ca" style="color: #ffc302; text-decoration: none;">bellhouseexcavating.ca</a>
        </p>
      </div>
  
    </div>
    `,
  };

  const customerMailOptions = {
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: `We Received Your Request for ${data.workType}!`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #ffffff; color: #202020;">
      
      <div style="background-color: #202020; padding: 20px; text-align: center;">
        <img src="https://bellhouseexcavating.ca/assets/BellhouseLogo-text.png" alt="Bellhouse Excavating Logo" style="max-width: 250px; margin-bottom: 10px;">
      </div>
  
      <div style="padding: 20px;">
        <h2 style="color: #ffc302; text-align: center;">Thank You for Contacting Bellhouse Excavating!</h2>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Thank you for reaching out to us regarding <strong>${data.workType}</strong>. We have received your message and will get back to you as soon as possible.</p>
        <p>Our team typically responds within <strong>24 hours</strong>, but if your request is urgent, please feel free to call us at <a href="tel:5197528500" style="color: #ffc302; text-decoration: none;"><strong>519-752-8500</strong></a>.</p>
        
        <p style="text-align: center;">
          <a href="https://bellhouseexcavating.ca" style="display: inline-block; background-color: #ffc302; color: #202020; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
        </p>
      </div>
  
      <hr style="border: none; border-top: 2px solid #ffc302; margin: 20px 0;">
  
      <div style="text-align: center; background-color: #202020; padding: 15px; color: #ffffff;">
        <p><strong>Best regards,</strong><br>The Bellhouse Excavating Team</p>
        <p>
          📞 <a href="tel:5197528500" style="color: #ffc302; text-decoration: none;">519-752-8500</a> |
          📧 <a href="mailto:info@bellhouseexcavating.ca" style="color: #ffc302; text-decoration: none;">info@bellhouseexcavating.ca</a> |
          🌐 <a href="https://bellhouseexcavating.ca" style="color: #ffc302; text-decoration: none;">bellhouseexcavating.ca</a>
        </p>
      </div>
  
    </div>
    `,
  };

  try {
    if (!isProduction) {
      console.log('📧 Sending emails with Mailtrap...');
    }

    // 🔹 Send Emails in Parallel
    const emailPromise = Promise.all([
      transporter.sendMail(businessMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    // 🔹 Save to Google Sheets **in the background** (doesn't block response)
    saveToGoogleSheets(data).catch((error) =>
      console.error('❌ Google Sheets error:', error)
    );

    // 🔹 Wait for emails to finish sending
    await emailPromise;

    if (!isProduction) {
      console.log('✅ Emails sent successfully!');
    }

    return { success: 'Estimate request sent successfully!' };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { error: 'Failed to send email. Please try again later.' };
  }
}

// 📊 Google Sheets Integration: Prevent Duplicate Submissions & Save Data
async function isDuplicateEntry(data: { email: string; workType: string }) {
  try {
    // 🔹 Load Google Service Account Key
    const keyFilePath = path.join(process.cwd(), 'google-service-account.json');
    const keyFile = await fs.readFile(keyFilePath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    // 🔹 Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = 'BellhouseMessages';
    const range = `${sheetName}!A:G`; // Fetch all data

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const existingEntries = sheetData.data.values || [];

    return existingEntries.some(
      (row) => row[1] === data.email && row[3] === data.workType
    );
  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
    return false; // Fail-safe: Allow saving if an error occurs
  }
}

export async function saveToGoogleSheets(data: {
  name: string;
  email: string;
  phone?: string;
  workType: string;
  message: string;
}) {
  try {
    if (await isDuplicateEntry(data)) {
      if (!isProduction) {
        console.log('⚠️ Duplicate submission detected. Skipping save.');
      }
      return;
    }

    // 🔹 Load Google Service Account Key
    const keyFilePath = path.join(process.cwd(), 'google-service-account.json');
    const keyFile = await fs.readFile(keyFilePath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    // 🔹 Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = 'BellhouseMessages';
    const range = `${sheetName}!A:G`; // Columns A to G

    // 🔹 Prepare Data for Google Sheets
    const formattedDateTime = new Date().toLocaleString();
    const values = [
      [
        data.name,
        data.email,
        data.phone || '',
        data.workType,
        data.message,
        formattedDateTime,
        'New', // Default status
      ],
    ];

    // 🔹 Append Data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    if (!isProduction) {
      console.log(isProduction || process.env.NODE_ENV);
      console.log('✅ Data successfully added to Google Sheets!');
    }
  } catch (error) {
    console.error('❌ Google Sheets error:', error);
  }
}
