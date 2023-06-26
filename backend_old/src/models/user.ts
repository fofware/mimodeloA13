import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Document {
  email: string;            // e-Mail del Usuario
  interna: boolean;
  parentAccountId: object;  // es el _id del usuario que generó la cuenta
  status: boolean;          // 0 - Disabled, 1 - Enabled
  password: string;
  apellido: string;
  nombre: string;
  fijo: string;
  celular: string;
  whatsapp: boolean;
  direccion: string;
  localidad: string;
  provincia: string;
  zipcode: string;
  pais: string;
  group: string;
  roles: [];                /*
                                Se debe setear automáticamente al crear la cuenta, 
                                "SYSADMIN" para la cuenta principal  se debe crear al inicializar el sistema obteniendo el usuario y contraseña de enviroment
                                "SYSUSER" para la subcuenta principal
                                // 
                                "CLIENTEADMIN"
                                "CLIENTEUSER" para las subcuentas 
                                //
                                "REVENTAADMIN"
                                "REVENTAUSER" para las subcuentas 
                                //
                                "PROVEEDORADMIN"
                                "PROVEEDORUSER" para las subcuentas 
                            */
  comparePassword: ( password: string ) => Promise<boolean>;
  encriptPassword: ( password: string ) => string;
};

const userSchema = new Schema({
  email:{ type: String, unique: true, required: true, lowercase: true, trim: true }
  , interna: {type: Schema.Types.Boolean, default: false }
  , parentAccountId: {ref: 'user',type: Schema.Types.ObjectId, default: null}
  , status: { type: Schema.Types.Boolean, default: true }
  , password: { type: Schema.Types.String, required: true }
  , apellido: { type: Schema.Types.String, trim: true }
  , nombre: { type: Schema.Types.String, trim: true }
  , fijo: { type: Schema.Types.String, trim: true }
  , celular: { type: Schema.Types.String, trim: true }
  , whatsapp: { type: Schema.Types.Boolean, default: false}
  , direccion: { type: Schema.Types.String, trim: true }
  , localidad: { type: Schema.Types.String, trim: true }
  , provincia: { type: Schema.Types.String, trim: true }
  , zipcode: { type: Schema.Types.String, trim: true }
  , pais: { type: Schema.Types.String, trim: true }
  , roles: []
  , group: { type: Schema.Types.String, trim: true }
},{
  timestamps: false,
  versionKey: false
})

userSchema.pre<IUser>('save', async function(next) {
  const user = this;
  if(!user.isModified('password')) return next();

  /*
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  */
  user.password = await this.encriptPassword(user.password);
  next();
});

userSchema.methods.encriptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

userSchema.methods.comparePassword = async function( password: string ): Promise<boolean>  {
  const user:any = this;
  return await bcrypt.compare(password, user.password );
};

export default model<IUser>( 'User', userSchema);