import { Schema, model, Document, SchemaTypes } from "mongoose";

export interface Account extends Document {
  name: string;
  description: string;
};

const accountSchema = new Schema({
  name: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  owner: { type: Schema.Types.ObjectId, ref: "User"},
  accusers: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User"
  }]
},
{ 
  strict: false,
  versionKey: false
});


accountSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<Account>('Account', accountSchema);
