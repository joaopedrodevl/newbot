import { Resend } from 'resend';
import LogService from '../services/LogService';
import path from 'path';

const dotenv = require('dotenv');
dotenv.config();

const RESEND_TOKEN = process.env.RESEND_TOKEN;
const RESEND_FROM = process.env.RESEND_FROM;

if (!RESEND_TOKEN) {
  throw new Error('Missing RESEND_TOKEN');
}

if (!RESEND_FROM) {
  throw new Error('Missing RESEND_FROM');
}

const logService = new LogService();

const resend = new Resend(RESEND_TOKEN);

/**
 * Sends an email with a verification code.
 * @param to - The recipient's email address.
 * @param code - The verification code to be sent.
 * @returns A Promise that resolves to the result of sending the email.
 */
export const sendEmail = async (to: string, code: string) => {
  const { data, error } = await resend.emails.send({
    from: RESEND_FROM as string,
    to: [to],
    subject: 'Código de verificação - Discord IFPB',
    html: `
    <div style="text-align: center; font-family: Arial, sans-serif; color: #004400; background-color: #ffffff; padding: 20px;">
      <h1 style="color: #006600;">Código de verificação Discord</h1>
      <div style="display: flex; justify-content: center; align-items: center;">
          <div style="width: 100%; text-align: center;">
              <p style="font-size: 18px;">Seu código de verificação é:</p>
              <p style="font-size: 18px; font-weight: bold;">${code}</p>
              <img src="https://www.ifpb.edu.br/imagens/logotipos/ifpb-1" alt="IFPB Logo" style="width: 100px; margin-top: 20px;">
          </div>
      </div>
  </div>
      `,
  });

  if (error) {
    await logService.create(error.message)
    return console.error({ error });
  }

  console.log({ data });
}