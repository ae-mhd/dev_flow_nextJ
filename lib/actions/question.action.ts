"use server";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectionToDatabase } from "../mongoose";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectionToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getQuestionByID(params: GetQuestionByIdParams) {
  const { questionId } = params;

  try {
    connectionToDatabase();

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" }) // auth property tags info
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      }); // add author property from User Model info
    if (!question) throw Error("Question not found");

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectionToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {}
}

// "use server";

// import Question from "@/database/question.model";
// import { connectionToDatabase } from "../mongoose";
// import Tag from "@/database/tag.model";
// import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
// import User from "@/database/user.model";
// import { revalidatePath } from "next/cache";

// export async function getQuestions(params: GetQuestionsParams) {
//   try {
//     await connectionToDatabase();
//     const questions = await Question.find({})
//       .populate({ path: "tags", model: Tag })
//       .populate({ path: "author", model: User })
//       .sort({ createdAt: -1 });
//     return { questions };
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
// export async function createQuestion(props: CreateQuestionParams) {
//   try {
//     connectionToDatabase();
//     const { title, content, tags, author, path } = props;
//     const question = await Question.create({
//       title,
//       content,
//       author,
//     });
//     const tagDocuments = [];
//     for (const tag of tags) {
//       const existingTag = await Tag.findOneAndUpdate(
//         { name: { $regex: new RegExp(`^${tag}$`, "i") } },
//         {
//           $setOnInsert: { name: tag },
//           $push: { questions: question._id },
//         },
//         { upsert: true, new: true }
//       );
//       tagDocuments.push(existingTag._id);
//     }
//     await Question.findByIdAndUpdate(question._id, {
//       $push: { tags: { $each: tagDocuments } },
//     });

//     revalidatePath(path);
//   } catch (error) {
//     console.error("Create Question on DB error", error);
//   }
// }
