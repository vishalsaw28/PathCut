import { Schema, model, Document } from "mongoose";
export interface IUrl extends Document {
  _id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
}

const UrlSchema = new Schema<IUrl>({
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Url = model<IUrl>("Url", UrlSchema);
export default Url;
