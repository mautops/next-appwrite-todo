import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteTodo } from "../actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Models } from "node-appwrite";

interface TodoListProps {
  todos: Models.DocumentList<Models.Document>;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export default function TodoList({ todos, reload, setReload }: TodoListProps) {
  return (
    <div className="flex flex-col gap-4">
      {todos.documents.map((todo) => (
        <Card key={todo.$id}>
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
          </CardHeader>
          <CardContent>{todo.content}</CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {todo.tags.map((tag: string) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  console.log("Edit todo", todo.$id);
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  DeleteTodo(todo.$id).then(() => {
                    setReload(!reload);
                  });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
