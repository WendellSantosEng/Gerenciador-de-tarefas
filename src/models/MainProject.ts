import { Schema, model, Document, Types } from 'mongoose';

interface IMainProject extends Document {
  name: string;
  description: string;
  ownerId: Schema.Types.ObjectId;
  boardIds: Types.ObjectId[],
  createdAt: Date;
  updatedAt: Date;
}

const MainProjectSchema = new Schema<IMainProject>({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  boardIds: [{ type: Schema.Types.ObjectId }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const MainProject = model<IMainProject>('MainProject', MainProjectSchema);
