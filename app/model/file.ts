import { Schema, InferSchemaType, model } from 'mongoose';

const FileSchema = new Schema({
  filename: {
    type: String,
    required: [true, '文件名不能为空'],
    trim: true,
  },
  path: {
    type: String,
    required: [true, '文件路径不能为空'],
    trim: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  mimetype: {
    type: String,
    required: [true, '文件类型不能为空'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID不能为空'],
  },
  isDirectory: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: String,
    default: '/',
  },
}, {
  timestamps: true,
});

// 创建索引
FileSchema.index({ path: 1, userId: 1 }, { unique: true });
FileSchema.index({ parent: 1 });

type FileType = InferSchemaType<typeof FileSchema>;

export default () => {
  return model<FileType>('File', FileSchema);
};