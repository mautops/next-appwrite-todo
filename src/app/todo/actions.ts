"use server";

import { getSessionClient } from "@/appwrite/config";
import auth from "@/auth";
import { TodoSchema } from "@/schemas/todo";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

export const CreateTodo = async (data: z.infer<typeof TodoSchema>) => {
  const validatedFields = TodoSchema.safeParse(data);
  if (!validatedFields.success) {
    return { message: "Todo creation failed" };
  }

  const { title, content, completed, tags } = validatedFields.data;

  // Get Session Client
  const { databases } = await getSessionClient();

  const user = await auth.getUser();

  // Create todo
  await databases.createDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
    ID.unique(),
    {
      userid: user?.$id,
      title,
      content,
      completed,
      tags,
    }
  );

  return { message: "Todo created successfully" };
};

export const DeleteTodo = async (id: string) => {
  // Get Session Client
  const sessionClient = await getSessionClient();

  const { databases } = sessionClient;

  await databases.deleteDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
    id
  );

  return { message: "Todo deleted successfully" };
};

export const UpdateTodo = async (
  id: string,
  data: z.infer<typeof TodoSchema>
) => {
  const validatedFields = TodoSchema.safeParse(data);
  if (!validatedFields.success) {
    return { message: "Todo update failed" };
  }

  const { title, content, completed, tags } = validatedFields.data;

  // Get Session Client
  const sessionClient = await getSessionClient();

  const user = await auth.getUser();

  const { databases } = sessionClient;

  await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
    id,
    {
      userid: user?.$id,
      title,
      content,
      completed,
      tags,
    }
  );

  return { message: "Todo updated successfully" };
};

export const GetTodo = async (id: string) => {
  // Get Session Client
  const sessionClient = await getSessionClient();

  const { databases } = sessionClient;

  const todo = await databases.getDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
    id
  );

  return todo;
};

export const GetTodos = async (
  limit: number = 2,
  offset: number = 0,
  search: { title?: string; content?: string; tags?: string[] } = {}
) => {
  // Get Session Client
  const sessionClient = await getSessionClient();

  const user = await auth.getUser();

  const { databases } = sessionClient;

  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    Query.equal("userid", user?.$id),
  ];

  if (search.title) {
    queries.push(Query.search("title", search.title));
  }
  if (search.content) {
    queries.push(Query.search("content", search.content));
  }
  if (search.tags && search.tags.length > 0) {
    queries.push(Query.equal("tags", search.tags));
  }

  const todos = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
    queries
  );

  return todos;
};
