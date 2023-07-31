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
import { requestPromise } from "../common/httpClient-promise";

export interface iMenuData {
  name:string;
  title?: string;
  icon?: string;
  comment?: string;
  links: iMenuLink[];
}
export interface iMenuLink {
  icon?:string;
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  outlet?: string,
  state?:any,
  target?:string,
  href?:string,
  rel?:string,
}

const menuData:iMenuData[] = [
  { 
    name: 'topMenu',
    title: 'Top Menu',
    icon: 'fas fa-cogs fa-4x',
    comment: '',
    links: [
      { 
        title: 'Home', 
        icon: '<i class="fas fa-home-lg"></i>', 
        link: 'home'
      },
      //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
      { 
        title: 'Articulos', 
        link: ['articulos'] 
      },
      //{ title: 'Productos', link: ['productos'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user'] },
    
      { 
        title: 'Aplicaciones', 
        link: ['users'], 
        roles: ['sys_admin', 'sys_user'] 
      },
      { 
        title: 'Aplicaciones', 
        link: ['users'], 
        roles: ['client_admin', 'client_user'] 
      },
      { 
        title: 'Sistema', 
        link: ['system'], 
        roles: ['sys_admin'] 
      },
      { 
        title: 'WhatsApp', 
        link: ['whatsapp'], 
        roles: ['sys_admin', 'sys_user'] 
      },
      { 
        title: 'WhatsApp', 
        link: ['whatsapp'], 
        roles: ['client_admin', 'client_user'] 
      },
      //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
      //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},
    ]
  },
  {
    name: 'usersHome',
    title: 'Usuario',
    icon: 'fas fa-cogs fa-4x',
    comment: 'Puesta a punto el sistema',
    links: [
      { 
        title: 'Home',
        icon: '<i class="fas fa-home-lg"></i>',
        link: ['home']
      },
      { 
        title: 'Menues',
        icon:'<i class="fa-solid fa-bars"></i>',
        link: ['menues'],
        roles: ['sys_admin']
      },
      { 
        title: 'Contactos',
        icon:'<i class="fa-regular fa-address-book fa-lg"></i>',
        link: ['contactos'],
        roles: ['sys_admin','client_admin','cliente_editor']
      },
      { 
        title: 'Proveedores',
        icon:'<i class="fa-solid fa-store"></i>',
        link: ['proveedores'],
        roles: ['sys_admin']
      },
      { 
        title: 'Clientes',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['clientes'],
        roles: ['sys_admin']
      },
      { 
        title: 'Mascotas',
        icon:'<i class="fa-solid fa-paw"></i>',
        link: ['mascotas'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Vehículos',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['vehiculos'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Configuraciones',
        icon:'<i class="fa-solid fa-sliders"></i>',
        link: ['settings'],
        //roles: ['sys_admin','client_admin']
      }
    ]
  },
  {
    name: 'system',
    title: 'Sistemas',
    icon: 'fas fa-cogs fa-4x',
    comment: 'Habilitación e Integración de Sistemas',
    links: [
      { 
        title: 'Home',
        icon: '<i class="fas fa-home-lg"></i>',
        link: ['home']
      },
      { 
        title: 'Menues',
        icon:'<i class="fa-solid fa-bars"></i>',
        link: ['menues'],
        roles: ['sys_admin']
      },
      { 
        title: 'Contactos',
        icon:'<i class="fa-regular fa-address-book fa-lg"></i>',
        link: ['..','contactos'],
        roles: ['sys_admin','client_admin','cliente_editor']
      },
      { 
        title: 'Proveedores',
        icon:'<i class="fa-solid fa-store"></i>',
        link: ['proveedores'],
        roles: ['sys_admin']
      },
      { 
        title: 'Clientes',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['clientes'],
        roles: ['sys_admin']
      },
      { 
        title: 'Mascotas',
        icon:'<i class="fa-solid fa-paw"></i>',
        link: ['mascotas'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Vehículos',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['vehiculos'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Configuraciones',
        icon:'<i class="fa-solid fa-sliders"></i>',
        link: ['settings'],
        //roles: ['sys_admin','client_admin']
      }
    ]
  }

]

const setMenu = async (user, defmenu:iMenuLink[]): Promise<iMenuLink[]> => {
  return new Promise( (resolve, reject) => {
    try {
      //console.log('SetMenu for ',user);
      const usrMenu:iMenuLink[] = defmenu.filter( (item:iMenuLink) => {
        if (item.roles?.length){
          for (let ir:number = 0; ir < item.roles.length; ir++) {
            const rol = item.roles[ir];
            const roles:string[] | undefined = user?.roles;
            if (rol && roles) {
              //console.log(item.title, roles,rol,roles.indexOf(rol))
              if(roles.indexOf(rol) > -1) return true;
            }
          }
          return false;
        }
        console.log(item.title, item.roles)
        return true;
      })
      //usrMenu.map( it => delete(it.roles))
      //console.log(usrMenu);
      resolve(usrMenu);
    } catch (error) {
      const retvalue: iMenuLink[] = []
      reject( retvalue );
    }
  })
}

function createToken(user: IUser | any ) {
  //const menu:iMenuLink[] = await setMenu(user);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    apellido: user.apellido,
    nombre: user.nombre,
    site: [],
    menu: user.menu,
    accounts: [],
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
  

  /*
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
  */
  const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    method: 'GET'
  }
  const captchaRpta = JSON.parse( await requestPromise(options));
  /*
  const captchaRpta = JSON.parse(await request.get(
    {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    }));

    //.then((response) => {
    //  console.log(response)
    //// If response false return error message
    //if (response.success === false) {
    //    return res.status(200).json({success: false, error: 'Recaptcha token validation failed'});
    //}
    //// otherwise continue handling/saving form data
    //    return response
    //})
  */
  console.log('-------------------')
  console.log(captchaRpta);
  console.log('-------------------')
  if ( captchaRpta.score < .7 )
    return res.status(401).json({ title: 'Hmmm....', text: 'Parece no ser humano...' })
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

export const getmenu = async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  //console.log("GetMenu",id,req.user)
  const menuIdx = menuData.findIndex(m => m.name === id);
  const menu = await setMenu(req.user, menuData[menuIdx].links);
  return res.status(200).json(menu);
}
export const fullmenu = async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  //console.log("GetMenu",id,req.user)
  const menuIdx = menuData.findIndex(m => m.name === id);
  const menu = menuData[menuIdx]
  menu.links = await setMenu(req.user, menuData[menuIdx].links);
  return res.status(200).json(menu);
}

/*
export const getvmenu = async ( req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  console.log("GetVMenu",id,req.user)
  const menu = await setMenu(req.user, menuData[id].options);
  return res.status(200).json(menu);
}
*/
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