import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface ITask extends Document {
  name: string;
  description: string;
  status: 'pendente' | 'em execução' | 'finalizado';
  columnId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['pendente', 'em execução', 'finalizado'], // Defina os valores permitidos
    default: 'pendente', // Valor padrão
  },
  columnId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Column' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Task = model<ITask>('Task', taskSchema);
export type { ITask };
