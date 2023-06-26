import { Schema, model, Document, SchemaTypes } from "mongoose";

export interface WappMediaData extends Document {
  //data?: string;          // downloadMedia.data
  filename?: string;      // downloadMedia.filename
  mimetype?: string;      // downloadMedia.mimetype
  msgid?: string;         // msg.id.id
  serialized?: string;    // msg.id._serialized
  from?: string;          // msg.from
  author?: string;        // msg.author
  to?: string;            // msg.to
  type?: string;          // msg.type
  mediaKey?: string;      // msg.mediaKey
  width?: number;         // msg._data.width
  height?: number;        // msg._data.height
  mediaTimestamp?: number;// msg._data.mediaTimestamp
  filehash?: string;      // msg._data.filehash
};

const WappMediaDataSchema = new Schema({
  //data: { type: Schema.Types.String, trim: true},
  filename: { type: Schema.Types.String, trim: true},
  mimetype: { type: Schema.Types.String, trim: true},
  msgid: { type: Schema.Types.String, trim: true, index: true},
  serialized: { type: Schema.Types.String, trim: true, index: true},
  from: { type: Schema.Types.String, trim: true, index: true},
  author: { type: Schema.Types.String, trim: true, index: true},
  to: { type: Schema.Types.String, trim: true, index: true},
  type: { type: Schema.Types.String, trim: true, index: true},
  mediaKey: { type: Schema.Types.String, trim: true, index: true},
  width: { type: Schema.Types.Number, trim: true},
  height: { type: Schema.Types.Number, trim: true},
  mediaTimestamp: { type: Schema.Types.Number, trim: true},
  filehash: { type: Schema.Types.String, trim: true, index: true},
},
{ 
  strict: false,
  timestamps: true,
  versionKey: false
});


WappMediaDataSchema.on('index', error => {
  // "_id index cannot be sparse"
  console.log(error);
});

export default model<WappMediaData>('mediadata', WappMediaDataSchema);