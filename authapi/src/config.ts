import { config } from "dotenv";

config();

export default {
  jwtSecret: process.env.JWT_SECRET || 'mysupersecrettoken',
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION || '60'),
  jwtExpirationRefresh: parseInt(process.env.JWT_REFRESH_EXPIRATION || '120'),
  
  captchaKey:process.env.CAPTCHA_KEY,
  

  defUser:{
    email: process.env.DEFAULT_USER,
    password: process.env.DEFAULT_PASSWORD,
    roles: ['sys_admin'],
    status: true,
    group: 'admin'
  },
  mongoDB:{
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion',
  }
  ,mariaDB:{
    host: process.env.MARIADB_URI,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    port: process.env.MARIADB_PORT
  }
  ,public: process.env.PUBLIC_HTML
  ,app_port: process.env.APP_PORT
  ,mp:{
    mode: process.env.mode || 'prod',
    userID: process.env.MP_USER_ID,
    clientID: process.env.MP_CLIENTE_ID,
    clientSecret: process.env.MP_CLIENTE_SECRET,
    prod:{
      publicKey: process.env.MPP_PUBLIC_KEY,
      accessToken: process.env.MPP_ACCESS_TOKEN,
    },
    dev:{
      publicKey: process.env.MPD_PUBLIC_KEY,
      accessToken: process.env.MPD_ACCESS_TOKEN,
    }
  }
}