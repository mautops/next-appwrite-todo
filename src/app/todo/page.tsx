"use client";
import { Models } from "node-appwrite";
import TodoForm from "./components/form";
import TodoList from "./components/list";
import { useEffect, useState } from "react";
import { GetTodos } from "./actions";
import { Button } from "@/components/ui/button";

export default function Todo() {
  const pageSize = 2;
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<
    Models.DocumentList<Models.Document> | undefined
  >(undefined);
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(() => {
    GetTodos(pageSize, 0).then((res) => {
      setTodos(res);
    });
  }, [reload]);

  return (
    <main className="flex justify-center items-center h-full w-full">
      <section className="w-1/2 bg-sky-500">
        <div className="mb-10 p-5">
          <TodoForm reload={reload} setReload={setReload} />
        </div>
        <div className="p-5">
          {todos && (
            <TodoList todos={todos} reload={reload} setReload={setReload} />
          )}
        </div>
        <div className="flex justify-center p-5">
          <Button
            disabled={!canLoadMore}
            onClick={() => {
              GetTodos(pageSize, page * pageSize).then((res) => {
                setTodos((prevTodos) => {
                  if (prevTodos) {
                    return {
                      ...res,
                      documents: [...prevTodos.documents, ...res.documents],
                    };
                  } else {
                    return res;
                  }
                });
                if (res.total >= page * pageSize) {
                  setCanLoadMore(true);
                  setPage(page + 1);
                } else {
                  setCanLoadMore(false);
                }
              });
            }}
          >
            Load More
          </Button>
        </div>
      </section>
    </main>
  );
}
