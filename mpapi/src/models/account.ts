import { Schema, model, Document } from "mongoose";

export interface Iaccount extends Document {
  user_id: string;
  client_id: string;
  client_secret: string;
  prod: {
    key: string;
    token: string;
  },
  test: {
    key: string;
    token: string;
  }
};

const accountSchema = new Schema({
  user_id: { type: Schema.Types.String, trim: true},
  client_id: { type: Schema.Types.String, trim: true},
  client_secret: { type: Schema.Types.String, trim: true},
  prod: {
    key: { type: String }, 
    token: { type: String }
  },
  test: {
    key: { type: String }, 
    token: { type: String }
  },
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


accountSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Iaccount>('account', accountSchema);