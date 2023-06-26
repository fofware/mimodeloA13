import * as qr from 'qr-image'
//import * as qrcode from 'qrcode-terminal';
import { Client, LegacySessionAuth, LocalAuth } from 'whatsapp-web.js'
import whatsapp from '../models/whatsapp';

const phones = [
  { cuenta: 'necocio1', number: '5493624683656', name: 'firulais', client: null },
  { cuenta: 'necocio1', number: '5493624380337', name: 'fabian', client: null }
]

const generateImage = (number,base64, cb = () => {}) => {
  let qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
  qr_svg.pipe(require('fs').createWriteStream(`./mediaSend/${number}.svg`));
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  cb()
}

for (let i = 0; i < phones.length; i++) {
  const p = phones[i];
  p.client = new Client({
    authStrategy: new LocalAuth(
      {
        dataPath: './sessions/',
        clientId: p.name
      }
    ),
    puppeteer: {
      args: ['--no-sandbox'],
    }
  });

  p.client.initialize();

  /*
  p.client.on('qr', qr => generateImage(p.number,qr, () => {
    qrcode.generate(qr, { small: true });
  }))
  */
  p.client.on('ready', async () => {
    console.log(`${p.name} conected & ready`);
  })
  
  p.client.on('authenticated', (session) => {
    console.log(`${p.name} Authenticated`);
  });
  
  p.client.on('auth_failure', err =>  {
    console.log(`${p.name} Authentication Error`);
    console.error(err);
  });

  p.client.on('message', async message => {
    const ret = await whatsapp.insertMany([message])
    console.log(`${p.name} recibió un mensaje`)
    if(message.body === '!ping') {
      message.reply('pong');
    }
  });
}
export class WAppClient {
  client;
  constructor(gateway:any){

  }

}