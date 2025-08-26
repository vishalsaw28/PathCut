import { Schema, model, Document } from "mongoose";

// Define interface for TypeScript type safety
export interface IUrl extends Document {
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
}

// Define schema
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

// Export model
const Url = model<IUrl>("Url", UrlSchema);
export default Url;
