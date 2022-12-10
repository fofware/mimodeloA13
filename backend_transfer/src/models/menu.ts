import { Schema, model, Document } from "mongoose";

export interface IMenu extends Document {
  _id?: string;
  menuGroup: string;
  name: string;
  path: string;
  link: string;
  icon: string;
  target: string;
  roles: [];
}

const menuSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , menuGroup: { type: Schema.Types.String, index: true }
  , name: { type: Schema.Types.String, index: true }
  , roles: {  type: Schema.Types.Array, default: [], index: true }
  , parent: { type: Schema.Types.String, default: null, index: true }
  
  , link: { type: Schema.Types.String, default: '' }
  , icon: { type: Schema.Types.String, default: '' }
  , target: { type: Schema.Types.String, default: '' }
},{
  strict: false,
  timestamps: false,
  versionKey: false,
})

menuSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<IMenu>('Menu', menuSchema);