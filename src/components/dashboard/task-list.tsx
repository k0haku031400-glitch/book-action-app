"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  frequency: string;
  weekNumber: number;
  completed: boolean;
  reflection?: string | null;
}

interface TaskListProps {
  tasks: TaskItem[];
  onTaskUpdate?: () => void;
}

const frequencyLabels: Record<string, string> = {
  DAILY: "毎日",
  WEEKLY: "週次",
  ONCE: "一度",
};

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reflectingTask, setReflectingTask] = useState<TaskItem | null>(null);
  const [reflection, setReflection] = useState("");

  const grouped = tasks.reduce(
    (acc, task) => {
      const week = task.weekNumber;
      if (!acc[week]) acc[week] = [];
      acc[week].push(task);
      return acc;
    },
    {} as Record<number, TaskItem[]>
  );

  async function toggleTask(task: TaskItem, completed: boolean) {
    if (completed && !task.reflection) {
      setReflectingTask(task);
      setReflection("");
      return;
    }

    await updateTask(task.id, completed, task.reflection ?? undefined);
  }

  async function updateTask(
    taskId: string,
    completed: boolean,
    reflectionText?: string
  ) {
    setLoadingId(taskId);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed, reflection: reflectionText }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "更新に失敗しました");
        return;
      }

      if (completed) {
        toast.success("タスクを完了しました！ +ポイント獲得");
      }
      onTaskUpdate?.();
    } catch {
      toast.error("更新に失敗しました");
    } finally {
      setLoadingId(null);
      setReflectingTask(null);
    }
  }

  async function submitReflection() {
    if (!reflectingTask) return;
    await updateTask(reflectingTask.id, true, reflection);
  }

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        タスクがまだありません
      </p>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([week, weekTasks]) => (
            <div key={week}>
              <h3 className="text-lg font-semibold mb-4">
                第{week}週
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({weekTasks.filter((t) => t.completed).length}/
                  {weekTasks.length} 完了)
                </span>
              </h3>
              <div className="space-y-3">
                {weekTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex gap-3 rounded-lg border p-4 transition-colors",
                      task.completed && "bg-muted/50 opacity-75"
                    )}
                  >
                    <div className="pt-0.5">
                      {loadingId === task.id ? (
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                      ) : (
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) =>
                            toggleTask(task, checked === true)
                          }
                          aria-label={`${task.title}を完了`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h4
                          className={cn(
                            "font-medium",
                            task.completed && "line-through"
                          )}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {frequencyLabels[task.frequency] ?? task.frequency}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.deadline), "M/d", {
                              locale: ja,
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      {task.reflection && (
                        <p className="text-sm mt-2 p-2 bg-accent/50 rounded-md italic">
                          💭 {task.reflection}
                        </p>
                      )}
                    </div>
                    {task.completed ? (
                      <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground/30 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <Dialog
        open={!!reflectingTask}
        onOpenChange={(open) => !open && setReflectingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>振り返りを記録</DialogTitle>
            <DialogDescription>
              「{reflectingTask?.title}」を完了しました。実践の振り返りを記録しましょう。
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="何を学びましたか？どんな変化を感じましたか？"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (reflectingTask) {
                  updateTask(reflectingTask.id, true);
                }
              }}
            >
              スキップ
            </Button>
            <Button onClick={submitReflection} disabled={!reflection.trim()}>
              記録して完了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
