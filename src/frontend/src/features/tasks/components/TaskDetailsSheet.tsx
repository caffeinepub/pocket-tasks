import type { Task } from '../../../backend';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface TaskDetailsSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskDetailsSheet({ task, open, onOpenChange, onEdit, onDelete }: TaskDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
              <SheetDescription className="mt-2">
                <Badge variant={task.isDone ? 'default' : 'secondary'} className="gap-1">
                  {task.isDone ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="h-3 w-3" />
                      Active
                    </>
                  )}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <div className="space-y-6">
          {task.description ? (
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Description</h4>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{task.description}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided</p>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-6">
          <div className="flex gap-3">
            <Button onClick={onEdit} variant="outline" className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
