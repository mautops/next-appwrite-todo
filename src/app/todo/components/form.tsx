"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TodoSchema } from "@/schemas/todo";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTodo } from "../actions";
import { toast } from "@/hooks/use-toast";

interface TodoFormProps {
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export default function TodoForm({ reload, setReload }: TodoFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: "title - 1",
      content: "content - 1",
      tags: ["tagsA", "tagsB", "tagsC"],
    },
  });
  const onSubmit = (data: z.infer<typeof TodoSchema>) => {
    startTransition(() => {
      CreateTodo(data).then((res) => {
        if (res.message) {
          toast({
            title: "Todo Info",
            description: res.message,
          });
          setReload(!reload);
        }
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="title"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="content"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="tags" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              Submit
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
