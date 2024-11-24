import { Schema, model, Document, Types } from 'mongoose';

interface IBoard extends Document {
  name: string;
  mainProjectId: Types.ObjectId;
  columnIds: Types.ObjectId[]; // Altere para Types.ObjectId
}

const boardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  mainProjectId: { type: Schema.Types.ObjectId, required: true, ref: 'MainProject' },
  columnIds: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
});

export const Board = model<IBoard>('Board', boardSchema);
export type { IBoard };
