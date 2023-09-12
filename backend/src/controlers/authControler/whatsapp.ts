import verifyemail from "../../models/verifyemail";
import { randVerifyNumber } from "./verifycode";

export const checkWapp = async (number:string) => {
  const captchaRpta = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //body: `secret=${secretKey}&response=${recaptchaToken}`,
  }).then(res =>  res.json())

}

export const generateWappVerifyCode = async (body:any) =>{
  const rand = randVerifyNumber();
  try {
    await verifyemail.findOneAndDelete({email: body.email});
    const verify = new verifyemail({email: body.email, verify: rand});
    await verify.save();
  } catch (error) {
    console.log(error)
  }  
  const data = JSON.stringify({
    bot: '5493624683656',
    to: body.wapp,
    msg: `
    ** Código de Verificación **

                  *${rand}*

    `
  })

  const ret = await fetch('https://wapi.vta.ar/sendto/',{
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: data,
  }).then(res =>  res.json());
  console.log('send WhatsApp',ret)
  if (ret) return true;
  return false;
}
