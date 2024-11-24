import { Schema, model, Document, Types } from 'mongoose';

interface IColumn extends Document {
  name: string;
  boardId: Types.ObjectId;
  taskIds: Types.ObjectId[];
}

const columnSchema = new Schema<IColumn>({
  name: { type: String, required: true },
  boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
  taskIds: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

export const Column = model<IColumn>('Column', columnSchema);
export type { IColumn };
