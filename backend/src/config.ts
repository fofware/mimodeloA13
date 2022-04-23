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
}
