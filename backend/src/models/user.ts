import { Schema, model, Document, Model} from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Document {
  _id?
  email: string;            // e-Mail del Usuario
  emailvalidated: boolean;
  phone: string;
  isWapp: boolean;
  status: boolean;          // 0 - Disabled, 1 - Enabled
  password: string;
  lastlogin: Date;
  apellido: string;
  nombre: string;
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
  , emailvalidated: { type: Schema.Types.Boolean, default: false}
  , phone: { type: Schema.Types.String, trim: true }
  , isWapp: { type: Schema.Types.Boolean, default: false }
  , status: { type: Schema.Types.Boolean, default: true }
  , password: { type: Schema.Types.String, required: true }
  , lastlogin: { type: Schema.Types.Date, }
  , apellido: { type: Schema.Types.String, trim: true }
  , nombre: { type: Schema.Types.String, trim: true }
  , group: { type: Schema.Types.String, trim: true }
  , roles: []
},{
  timestamps: false,
  versionKey: false
})

userSchema.pre<IUser>('save', async function(next) {
  const user = this;
  console.log('-------- Pre Save --------');
  console.log(user);
  console.log('--------------------------');
  console.log(user.isModified('name'));
  console.log(user.isDirectModified('password'));
  console.log('--------------------------');

  //if(!user.isModified('password')) return next();
  if(user.isModified('password')){
    const password = user.password;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  /*
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  */
  //user.password = await this.encriptPassword(user.password);
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