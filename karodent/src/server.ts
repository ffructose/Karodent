import 'dotenv/config';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import nodemailer from 'nodemailer';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({ limit: '20kb' }));

const smtpHost = process.env['SMTP_HOST'];
const smtpPort = Number(process.env['SMTP_PORT'] || 465);
const smtpUser = process.env['SMTP_USER'];
const smtpPassword = process.env['SMTP_PASSWORD'];
const contactEmail = process.env['CONTACT_EMAIL'];

if (!smtpHost || !smtpUser || !smtpPassword || !contactEmail) {
  throw new Error(
    'Missing SMTP configuration. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and CONTACT_EMAIL.',
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

function cleanSingleLine(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMessage(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Contact form endpoint.
 * It must be declared before static files and Angular SSR handlers.
 */
app.post('/api/contact', async (req, res) => {
  try {
    const name = cleanSingleLine(req.body?.name, 100);
    const phone = cleanSingleLine(req.body?.phone, 40);
    const email = cleanSingleLine(req.body?.email, 150);
    const question = cleanMessage(req.body?.question, 3000);
    const website = cleanSingleLine(req.body?.website, 200); // honeypot
    const source = cleanSingleLine(req.body?.source, 50);

    // Bots often fill hidden fields. Return success without sending an email.
    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required.',
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address.',
      });
    }

    const sourceText = source || 'website';

    const formName =
      source === 'contacts'
        ? 'Formularz na stronie Kontakt'
        : source === 'footer'
          ? 'Formularz w stopce strony'
          : sourceText;

    const sentAt = new Intl.DateTimeFormat('pl-PL', {
      timeZone: 'Europe/Warsaw',
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date());

    await transporter.sendMail({
      from: `"Karodent Warszawa" <${smtpUser}>`,
      to: contactEmail,
      replyTo: email || smtpUser,

      subject: `Nowe zapytanie ze strony Karodent Warszawa — ${name}`,

      text: [
        '',
        question || 'Nie podano treści wiadomości.',
        '',
        '____________________',
        '',
        `Imię i nazwisko: ${name}`,
        `Numer telefonu: ${phone}`,
        `Adres e-mail: ${email || 'Nie podano'}`,
        '',
        '____________________',
        '',
        `Formularz: ${formName}`,
        `Data wysłania: ${sentAt}`,
      ].join('\n'),
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      success: false,
      message: 'The message could not be sent.',
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);