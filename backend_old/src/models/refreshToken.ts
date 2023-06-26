import config from "../config";
import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';



export interface IRefreshToken extends Document {
  token: string;
  user: any;
  expiryDate: Date;
  createToken: ( user: any) => Promise<string>;
  verifyExpiration: ( user: any) => any;
};

const RefreshTokenSchema = new Schema(
{
  token: { type: Schema.Types.String},
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  expiryDate: {type: Schema.Types.Date}
},
{
  strict: true
});

RefreshTokenSchema.statics.createToken = async function(user) {
  let expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.jwtExpirationRefresh
  );
  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = ( token ) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

RefreshTokenSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IRefreshToken>('refreshtoken', RefreshTokenSchema);