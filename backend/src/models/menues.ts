import { Schema, model, Document } from "mongoose";


/*
export interface ivMenu {
  icon?:string;
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  outlet?: string
  state?:any
}
*/
export interface IMenu extends Document {
  _id?: string;
  parent?: string;
  name?: string;
  clase?: string;
  usrroles?:[];
  title: string;
  icon?: string;
  link: string;
  fragment?: string;
  target?: string;
  outlet?: string;
  roles?: [];
}

const menuSchema = new Schema({
  _id: { type: Schema.Types.ObjectId }
  , parent: { type: Schema.Types.ObjectId, ref: "Producto", default: null }
  , name: { type: Schema.Types.String, default: '' }
  , clase: { type: Schema.Types.String, default: '' }
  , usrroles: { type: Schema.Types.Array, default: [], index: true }
  , title: { type: Schema.Types.String, index: null }
  , icon: { type: Schema.Types.String, default: null }
  , link: { type: Schema.Types.String, default: null }
  , fragment: { tyme: Schema.Types.String }
  , target: { type: Schema.Types.String, default: null }
  , outlet: { type: Schema.Types.String, default: null }
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