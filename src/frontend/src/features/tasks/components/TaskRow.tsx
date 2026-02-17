import { useState } from 'react';
import type { Task } from '../../../backend';
import { useToggleTask } from '../../../hooks/useQueries';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TaskDetailsSheet from './TaskDetailsSheet';
import TaskEditSheet from './TaskEditSheet';
import DeleteTaskConfirmDialog from './DeleteTaskConfirmDialog';

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  const toggleTask = useToggleTask();
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleToggle = async (checked: boolean) => {
    await toggleTask.mutateAsync({ taskId: task.id, isDone: checked });
  };

  return (
    <>
      <div className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5">
        <Checkbox
          checked={task.isDone}
          onCheckedChange={handleToggle}
          disabled={toggleTask.isPending}
          className="mt-0.5"
        />
        
        <button
          onClick={() => setShowDetails(true)}
          className="flex-1 text-left"
        >
          <h3 className={`font-medium leading-tight ${task.isDone ? 'text-muted-foreground line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDelete(true)}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TaskDetailsSheet 
        task={task} 
        open={showDetails} 
        onOpenChange={setShowDetails}
        onEdit={() => {
          setShowDetails(false);
          setShowEdit(true);
        }}
        onDelete={() => {
          setShowDetails(false);
          setShowDelete(true);
        }}
      />

      <TaskEditSheet 
        task={task} 
        open={showEdit} 
        onOpenChange={setShowEdit}
      />

      <DeleteTaskConfirmDialog
        task={task}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
}
