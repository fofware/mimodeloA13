import { Request, Response, Router } from "express";
import verifyemail from "../../models/verifyemail";
import { transporter } from "../../common/mailer";
import config from '../../config';
import { createToken } from "./auth";
import User, { IUser } from "../../models/user";
import { randVerifyNumber, verifyCode } from "./verifycode";

/**
 * e-Mails Controlers & Functions
 */

export const generateEmailVerifyCode = async (emailTo:string) =>{
  const rand = randVerifyNumber();
  let retVerify;
  try {
    await verifyemail.findOneAndDelete({email: emailTo});
    const verify = new verifyemail({email: emailTo, verify: rand});
    retVerify = await verify.save();
  } catch (error) {
    console.log(error)
    return false;
  }
    
  const mail =  await transporter.sendMail({
    from: '"mailer Firulais" <firulais.net.ar@gmail.com>',
    to: `${emailTo}`,
    subject: "Verificación de correo",
    html: `
    <h1><strong>Hola</strong></h1>
    <h1><strong>Código: ${rand}</strong></h1>
    <hr>
    <p>Se envia este e-Mail para verificar que pertenece a quien está tratando de crear una cuenta en nuestro sitio web.</p>
    <p>Si no es Ud. simplemente ignórelo.
    `
  });
  if ( retVerify && mail ) return true;
  return false;
}

/*
export const verifyCode = async (email:string,verify:number) => {
  const filter = {
    email,
    verify
  }
  console.log('filter',filter);
  return await verifyemail.findOne(filter);
}
*/

export const verifyEmailCode = async (req: Request, res: Response): Promise<Response> => {
  console.log(req.body);
  //const recaptchaToken = req.body['captcha'];
  //const secretKey = config.captchaKey;
  /*
  const captchaRpta = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${recaptchaToken}`,
  }).then(res =>  res.json())
  */
  const filter = {
    email: req['user']['email'] ,
    verify: req.body['verify']
  }
  console.log('filter',filter);
  const info = await verifyCode(req['user']['email'], req.body.verify)
  let token = createToken(req['user']);
  let verify = false;
  let status = 404;
  if(info){
    const updateUser = await User.findByIdAndUpdate(req.user['_id'],{emailvalidated: true}, {new: true});
    await verifyemail.findOneAndDelete(filter);

    console.log('updateUser',updateUser)
    token = createToken(updateUser);
    verify = true;
    status = 200;
  }
  return res.status(status).json({message:'No se ha autenticado el correo',title:'Código inválido',verify,token});
}

export const newEmailCode = async (req: Request, res: Response): Promise<Response> => {
  try {
    const emailTo = req.user['email'];
    const info = await generateEmailVerifyCode(emailTo);
    //console.log(info);
    return res.status(200).json({emailTo, send:true});
  } catch (error) {
    console.log(error);
    return res.status(500).json(false)    
  }
}
