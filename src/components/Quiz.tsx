"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/utils";

type Quiz = {
  question: string;
  answerList: QuizAnswer[];
};

type QuizAnswer = {
  isCorrect: boolean;
  answerText: string;
  description: string;
};

const quizData: Quiz = {
  question: "What is your favorite color?",
  answerList: [
    {
      isCorrect: true,
      answerText: "Blue",
      description: "Blue is the best color",
    },
    {
      isCorrect: false,
      answerText: "Red",
      description: "Red is the worst color",
    },
    {
      isCorrect: false,
      answerText: "Green",
      description: "Green is the worst color",
    },
    {
      isCorrect: false,
      answerText: "Yellow",
      description: "Yellow is the worst color",
    },
  ],
};

export const quizFormSchema = z.object({
  answer: z.string().refine((answer) => answerList.includes(answer)),
});
type AppearanceFormValues = z.infer<typeof quizFormSchema>;

export function Quiz({
  onSubmit,
  onCancel,
  previousValues,
}: {
  onSubmit: (values: z.infer<typeof quizFormSchema>) => void;
  onCancel: () => void;
  previousValues: z.infer<typeof quizFormSchema>;
}) {
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: previousValues,
  });
  const [quiz, setQuiz] = useState(quizData);
  const { question, answerList } = quiz;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"answer"}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormDescription>{question}</FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 pt-2"
              >
                {answerList.map((answer) => (
                  <AnswerItem answer={answer} selected={false} />
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant={"secondary"} type="button" onClick={onCancel}>
            Previous
          </Button>
          <Button type="submit" variant={"default"}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AnswerItem({
  answer,
  selected,
}: {
  answer: QuizAnswer;
  selected: boolean;
}) {
  const { answerText, description, isCorrect } = answer;

  const borderColor = isCorrect ? "border-green-500" : "border-red-500";

  return (
    <FormItem key={answerText}>
      <FormLabel className="[&:has([data-state=checked])>div]:border-default-pink b-5">
        <FormControl>
          <RadioGroupItem value={answerText} className="sr-only" />
        </FormControl>
        <div
          className={cn(
            borderColor,
            "w-full cursor-pointer rounded-full border-2 border-muted p-1 px-5 text-lg text-gray-300 transition-colors hover:bg-slate-400/50",
          )}
        >
          {answerText}
        </div>
      </FormLabel>
      {selected && (
        <FormDescription className="text-sm text-gray-400">
          {description}
        </FormDescription>
      )}
    </FormItem>
  );
}
