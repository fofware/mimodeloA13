import { Schema, model, Document } from "mongoose";

export interface AccUser extends Document {
  account: string;
  user: string;
  name: string;
  roles: [];
};

const accuserSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: Schema.Types.String, trim: true, default: '', index: true, unique: true },
  roles: [{
    type: Schema.Types.ObjectId, ref: "Role"
  }],
},
{ 
  strict: false,
  versionKey: false
});


accuserSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<AccUser>('AccUser', accuserSchema);