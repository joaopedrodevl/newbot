import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_TOKEN);

export const sendEmail = async (to: string, code: string) => {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: [to],
    subject: 'Código de verificação - Discord IFPB',
    html: `
      <h1>Código de verificação</h1>
      <p>Seu código de verificação é: <strong>${code}</strong></p>
      `,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}