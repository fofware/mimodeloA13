import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';

function createToken(user: IUser | any ) {
  return jwt.sign({ _id: user._id, 
    email: user.email,
    apellido: user.apellido,
    nombre: user.nombre,
    roles: user.roles,
    nickname: user.nickname || `${user.nombre} ${user.apellido}`,
    image: '/assets/images/defuser.png',
  }, config.jwtSecret, {
    expiresIn: 43200
  });
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ msg: 'eMail ya está registrado' });
  const userwapp = await User.findOne({ whatsapp: req.body.whatsapp });
  if (userwapp) return res.status(400).json({ msg: 'WhatsApp ya está registrado existe' });
  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.confirmPassword;
  const newUser = new User(req.body);

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
    return res.status(401).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ msg: 'Usuario y/o contraseña ivalidos' });
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(401).json({ msg: 'Contraseña y/o Usuario ivalidos' });
  const token = createToken(user);
  console.log(user);
  delete user.__v ;
  delete user.password;
  user.password = null;
  user.__v = null
  return res.status(200).json( token );
};

export const renew = async (req: Request, res: Response): Promise<Response> => {
	const user = req.user;
  const newToken = createToken(user);
  console.log("Renovó token");
  console.log(user);
  return res.status(200).json({ newToken });
};

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

