/**
 * Guia de actualización
 * https://www.bezkoder.com/jwt-refresh-token-node-js-mongodb/?__cf_chl_tk=NoUAH8D4IAss7A9A4IhgrKKuSdr6cF4NQzJeFUeWsTY-1673961057-0-gaNycGzNCf0
 */

import { Request, Response, Router } from "express";
import User, { IUser } from "../../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../../config';
//import  RefreshToken  from '../models/refreshToken'
//import { requestPromise } from "../common/httpClient-promise";
import { options } from "../../routes/productoname.routes";
import { generateEmailVerifyCode } from "./email";
import verifyemail from "../../models/verifyemail";
import { errorHandle } from "../genericControlers";

export const createToken = (user: IUser | any ) => {
  //const menu:iMenuLink[] = await setMenu(user);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    apellido: user.apellido,
    nombre: user.nombre,
    emailvalidated: user.emailvalidated,
    site: [],
    menu: user.menu,
    accounts: [],
    roles: user.roles,
    phone: user.phone,
    group: user.group,
    nickname: user.nickname,
    showname: (user.nickname ? user.nickname : (user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : (user.nombre ? user.nombre : user.email))),
    image: '/assets/images/defuser.png',
  }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  const reqData = req.body;
  //console.log(reqData);
  try {
    if (!reqData.email || !reqData.password)
      return res.status(400).json({ message: 'Por favor. Envíe su e-Mail y contraseña' });

    if (reqData.password !== reqData.repassword)
      return res.status(400).json({ message: 'Las contraseñas no coinciden'})
  
    const chkUser = await User.findOne({ email: reqData.email });
    if (chkUser) return res.status(400).json({ message: 'eMail ya está registrado' });

    if(reqData.whatsapp){
      const userwapp = await User.findOne({ whatsapp: reqData.whatsapp });
      if (userwapp) return res.status(400).json({ title: 'WhatsAppBot', message: `${reqData.whatsapp} WhatsApp ya está registrado existe` });
    }
    
    delete reqData.repassword;

    /*
    const recaptchaToken = reqData.captcha;
    const secretKey = config.captchaKey;
    const captchaRpta = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${recaptchaToken}`,
    }).then(res =>  res.json())

    if ( captchaRpta.score < .7 )
      return res.status(401).json({ title: 'reCAPTCHA', message: 'Hmmm....Parece no ser humano...' })
    */
    const user = {
      email: reqData.email,
      roles: ['client_admin'],
      group: 'user',
      phone: reqData.phone,
      password: reqData.password
    }
    
    const newUser = new User(user);
    await newUser.save();
    delete newUser.password;
    const token = createToken(newUser);
    delete newUser.__v;
    delete newUser.password;
    newUser.__v = null;
    newUser.password = null;
    let info = await generateEmailVerifyCode(user.email);

    return res.status(200).json({ token });

  } catch (err) {
    console.log(JSON.parse(JSON.stringify(err)))
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,

      filter: Object.assign(req.query,req.params,req.body),
      ...JSON.parse(JSON.stringify(err)).error
    }
    res.status(500).json({ error });
  }
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(401).json({ title: 'Datos insuficientes', message: 'Usuario y contraseña son requeridos' });
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ title: 'No Autorizado', message: 'Usuario y/o contraseña ivalidos' });
  if (!user.status){
    return res.status(401).json({ title: 'Cuenta desabilitada', message: 'Comuniquese con el administrador' });
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(401).json({ title: 'No Autorizado', message: 'Contraseña y/o Usuario ivalidos' });
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let fromUrl = req.headers.origin; // req.headers.referer
  delete user.__v ;
  delete user.password;
  user.password = null;
  user.__v = null
  //user['menu'] = await setMenu(user);
  //console.log(user);
  const token = createToken(user);
  return res.status(200).json( token );
};

export const savePassword = async (req: Request, res: Response) => {
  const {email, password} = req.body
  try {
    await verifyemail.findOneAndDelete({ email });
  } catch (error) {
    res.status(500).json( errorHandle(req, verifyemail, error) )    
  }
  try {
    //const ret = await User.findOneAndUpdate({ email }, { password });
    const _user = await User.findOne({email});
    console.log(_user);
    _user.password = password;
    const ret = await _user.save()
    
    return res.status(200).json({token: createToken(_user)});
  } catch (error) {
    return res.status(500).json( errorHandle(req, User, error) )    
  }
}

/*
export const refreshtoken = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
*/

export const emailcheck = async (req: Request, res: Response) => {
  const { email } = req.params;
  //console.log(email);
  User.findOne( { email })
  .then( ( rpta: any ) => {
    //console.log(rpta);
    if(!rpta) return res.status(200).json( { exists: false } );
    else return res.status(200).json( { exists: true } );
  }).catch( (err: any) => {
    return res.status(404).json( ...JSON.parse(JSON.stringify(err)) );
  })
  
}


export const nicknamecheck = async (req: Request, res: Response) => {
  const { nickname } = req.params;
  console.log(nickname);
  User.findOne( { nickname })
  .then( ( rpta: any ) => {
    console.log(rpta);
    if(!rpta) return res.status(200).json( { exists: false } );
    else return res.status(200).json( { exists: true } );
  }).catch( (err: any) => {
    return res.status(500).json( err );
  })
}

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user['_id']);
    if (!user){
      return res.status(404).json({message: `No encontrado`, title:`Usuario`});
    }
    const isMatch = await user.comparePassword(req.body.oldpassword);
    if (!isMatch)
      return res.status(401).json({ title: 'No Autorizado', message: 'Datos inválidos' });
    if (req.body.password !== req.body.repassword)
      return res.status(400).json({ message: 'Las contraseñas no coinciden'})
    user.password = req.body.password;
    const nuser = await user.save();
    const token = createToken(nuser);
    console.log(nuser);
    console.log(token);
    return res.status(200).json({token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Cambiando Password', title: 'Api Error'})
  }
}
