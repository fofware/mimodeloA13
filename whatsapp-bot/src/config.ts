import { config } from "dotenv";

config();
export default {
  jwtSecret: process.env.JWT_SECRET || 'mysupersecrettoken',
  mongoDB:{
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27084/gestion',
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
