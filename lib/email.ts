import nodemailer from 'nodemailer';

export default async function sendEmail(payload: Record<string, any>) {
  // Safety: ensure required envs exist
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error('SMTP is not configured (SMTP_HOST/PORT/USER/PASS).');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const submitted = new Date().toLocaleString('en-CA');
  const logo =
    process.env.ALL8_LOGO_URL || 'https://placehold.co/220x48?text=ALL8';

  const businessHTML = `
  <div style="font-family: Inter, Arial, sans-serif; max-width:640px; margin:auto; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden">
    <div style="background:#0B0F1A; padding:20px; text-align:center; color:#fff">
      <img src="${logo}" alt="ALL8 Webworks" style="height:44px; display:block; margin:0 auto 6px"/>
      <h2 style="margin:0; font-weight:800; letter-spacing:.2px">New Website Intake</h2>
      <p style="margin:8px 0 0; opacity:.8; font-size:14px">${submitted}</p>
    </div>
    <div style="padding:22px">
      <h3 style="margin:0 0 10px; color:#0076FF">Lead Details</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px">
        <tr><td style="padding:6px 0; width:140px; color:#111827"><strong>Name</strong></td><td>${payload.name}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Email</strong></td><td><a href="mailto:${payload.email}" style="color:#0076FF; text-decoration:none">${payload.email}</a></td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Company</strong></td><td>${payload.company || '—'}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Website</strong></td><td>${payload.website || '—'}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Project Type</strong></td><td>${payload.projectType}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Goal</strong></td><td>${payload.goal}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Timeline</strong></td><td>${payload.timeline}</td></tr>
        <tr><td style="padding:6px 0; color:#111827"><strong>Budget</strong></td><td>${payload.budget}</td></tr>
      </table>
      <div style="margin-top:12px">
        <p style="margin:0; color:#111827"><strong>Notes</strong></p>
        <p style="margin:6px 0 0">${String(payload.notes || '').replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    <div style="background:#0B0F1A; color:#fff; padding:16px; text-align:center">
      <p style="margin:0; font-size:14px">ALL8 Webworks • Ontario, Canada</p>
      <p style="margin:4px 0 0; font-size:14px"><a href="https://all8webworks.ca" style="color:#0076FF; text-decoration:none">all8webworks.ca</a></p>
    </div>
  </div>`;

  const customerHTML = `
  <div style="font-family: Inter, Arial, sans-serif; max-width:640px; margin:auto; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden">
    <div style="background:#0B0F1A; padding:26px; text-align:center; color:#fff">
      <img src="${logo}" alt="ALL8 Webworks" style="height:44px; display:block; margin:0 auto 10px"/>
      <h1 style="margin:0; font-weight:800">Thanks, ${payload.name}!</h1>
      <p style="margin:8px 0 0; opacity:.9">We received your request for <strong>${payload.projectType}</strong>.</p>
    </div>
    <div style="padding:22px; color:#111827">
      <p>We typically respond within <strong>1 business day</strong>. If it’s urgent, reply to this email.</p>
      <p style="text-align:center; margin:24px 0">
        <a href="https://all8webworks.ca" style="display:inline-block; padding:12px 18px; background:#0076FF; color:#fff; border-radius:10px; text-decoration:none; font-weight:700">Visit ALL8 Webworks</a>
      </p>
      <div style="border-top:1px solid #e5e7eb; padding-top:12px; font-size:13px; color:#6b7280">
        <p style="margin:0">If you didn’t submit this request, you can ignore this message.</p>
      </div>
    </div>
    <div style="background:#0B0F1A; color:#fff; padding:14px; text-align:center">
      <p style="margin:0; font-size:14px">ALL8 Webworks • Ontario, Canada</p>
    </div>
  </div>`;

  const from =
    process.env.SMTP_FROM || 'ALL8 Webworks <no-reply@all8webworks.ca>';

  // send both (business + client)
  await Promise.all([
    transporter.sendMail({
      from,
      to: [process.env.CONTACT_TO, process.env.CONTACT_CC] // set these in .env
        .filter(Boolean)
        .join(', '),
      subject: `🔔 New ${payload.projectType} intake — ${payload.name}`,
      html: businessHTML,
    }),
    transporter.sendMail({
      from,
      to: payload.email,
      subject: `We received your request for ${payload.projectType}`,
      html: customerHTML,
    }),
  ]);
}
