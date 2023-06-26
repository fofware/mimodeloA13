import * as qr from 'qr-image';

const generateImage = (base64, cb = () => {}) => {
  const number = new Date().getTime();
  let qr_svg = qr.image(base64, { type: 'svg', margin: 4 });
  qr_svg.pipe(require('fs').createWriteStream(`./mediaSend/${number}.svg`));
  /*
  router.get(`/qr/${number}`, (req, res) =>{
    res.set({'Content-type': 'image/svg+xml'})
    fs.createReadStream(`${__dirname}/../mediaSend/${number}.svg`).pipe(res);
  })
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  */
  //cb()
}
