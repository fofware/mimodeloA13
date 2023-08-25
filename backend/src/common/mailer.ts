import nodemailer from 'nodemailer'
import {config} from 'dotenv';
config()

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'firulais.net.ar@gmail.com',
    pass: process.env.GMAIL_KEY
  }
})

transporter.verify().then(() => {
  console.log('Ready to send e-Mail');
})