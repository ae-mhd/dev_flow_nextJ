import { Schema, models, model, Document } from "mongoose";
interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdOn: Date;
}
const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Replace 'Question' with the actual model reference
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Replace 'User' with the actual model reference
  createdOn: { type: Date, default: Date.now },
});

const TagModel = models.Tag || model<ITag>("Tag", TagSchema);

export default TagModel;
