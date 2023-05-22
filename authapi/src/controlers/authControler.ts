/**
 * Guia de actualización
 * https://www.bezkoder.com/jwt-refresh-token-node-js-mongodb/?__cf_chl_tk=NoUAH8D4IAss7A9A4IhgrKKuSdr6cF4NQzJeFUeWsTY-1673961057-0-gaNycGzNCf0
 */

import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import  RefreshToken  from '../models/refreshToken'
//const request = require('request-promise');

function createToken(user: IUser | any ) {
  return jwt.sign({ _id: user._id, 
    email: user.email,
    apellido: user.apellido,
    nombre: user.nombre,
    roles: user.roles,
    phone: user.phone,
    group: user.group,
    nickname: user.nickname || `${user.nombre} ${user.apellido}`,
    image: '/assets/images/defuser.png',
  }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  /*
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ msg: 'eMail ya está registrado' });
  const userwapp = await User.findOne({ whatsapp: req.body.whatsapp });
  if (userwapp) return res.status(400).json({ msg: 'WhatsApp ya está registrado existe' });
  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.confirmPassword;
  */
  const userIp = req.socket.remoteAddress;
  const recaptchaToken = req.body.captcha;
  const secretKey = config.captchaKey;
  

  const options = {
    host: 'firulais.net.ar',
    path: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    method: 'GET',
    port: 443,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }

  //const captchaRpta = JSON.parse(await request.get(
  //  {
  //      url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
  //  }));
    //.then((response) => {
    //  console.log(response)
    //// If response false return error message
    //if (response.success === false) {
    //    return res.status(200).json({success: false, error: 'Recaptcha token validation failed'});
    //}
    //// otherwise continue handling/saving form data
    //    return response
    //})
  console.log('-------------------')
  //console.log(captchaRpta);
  //if ( captchaRpta.score < .7 )
  //  return res.status(401).json({ title: 'Hmmm....', text: 'Parece no ser humano...' })
  console.log(req.body);
  const user = {
    email: req.body.email,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    roles: ['client_admin'],
    group: 'user',
    phone: req.body.phone,
    password: req.body.password
  }
  const newUser = new User(user);
  await newUser.save();
  delete newUser.password;
  const token = createToken(newUser);
  console.log(newUser);
  delete newUser.__v;
  delete newUser.password;
  newUser.__v = null;
  newUser.password = null;
  return res.status(200).json({ token, newUser });
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(401).json({ title: 'Datos insuficientes', text: 'Usuario y contraseña son requeridos' });
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ title: 'No Autorizado', text: 'Usuario y/o contraseña ivalidos' });
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(401).json({ title: 'No Autorizado', text: 'Contraseña y/o Usuario ivalidos' });
  const token = createToken(user);
  console.log(user);
  delete user.__v ;
  delete user.password;
  user.password = null;
  user.__v = null
  return res.status(200).json( token );
};

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
  console.log(email);
  User.findOne( { email })
  .then( ( rpta: any ) => {
    console.log(rpta);
    if(!rpta) return res.status(200).json( { exists: false } );
    else return res.status(200).json( { exists: true } );
  }).catch( (err: any) => {
    return res.status(404).json( err );
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