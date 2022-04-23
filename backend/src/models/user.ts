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
  roles: [];                /*
                                Se debe setear automáticamente al crear la cuenta, 
                                "ADMIN" para la cuenta principal 
                                "USER" para las subcuentas 
                            */
  comparePassword: ( password: string ) => Promise<boolean>;
  encriptPassword: ( password: string ) => string;
};

const userSchema = new Schema({
  email:{ type: String, unique: true, required: true, lowercase: true, trim: true }
  , interna: {type: Boolean, default: false }
  , parentAccountId: {type: Schema.Types.ObjectId}
  , status: { type: Boolean, default: true }
  , password: { type: String, required: true }
  , apellido: { type: String, trim: true }
  , nombre: { type: String, trim: true }
  , fijo: { type: String, trim: true }
  , celular: { type: String, trim: true }
  , whatsapp: { type: Boolean, default: false}
  , direccion: { type: String, trim: true }
  , localidad: { type: String, trim: true }
  , provincia: { type: String, trim: true }
  , zipcode: { type: String, trim: true }
  , pais: { type: String, trim: true }
  , roles: [{
    ref: "roles",
    type: Schema.Types.ObjectId,
    default: []
  }]
},{
  timestamps: true,
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