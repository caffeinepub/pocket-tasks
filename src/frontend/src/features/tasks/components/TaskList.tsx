import { useGetAllTasks, useGetActiveTasks, useGetCompletedTasks } from '../../../hooks/useQueries';
import type { FilterType, SortType } from '../../../pages/TasksPage';
import TaskRow from './TaskRow';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task } from '../../../backend';

interface TaskListProps {
  filter: FilterType;
  sort: SortType;
}

export default function TaskList({ filter, sort }: TaskListProps) {
  const allTasksQuery = useGetAllTasks();
  const activeTasksQuery = useGetActiveTasks();
  const completedTasksQuery = useGetCompletedTasks();

  // Select the appropriate query based on filter
  const query = filter === 'all' ? allTasksQuery : filter === 'active' ? activeTasksQuery : completedTasksQuery;
  const { data: tasks = [], isLoading, error } = query;

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sort === 'newest') {
      return Number(b.id - a.id);
    } else {
      return Number(a.id - b.id);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load tasks</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <img 
          src="/assets/generated/empty-state-tasks.dim_1200x800.png" 
          alt="No tasks" 
          className="mb-6 w-full max-w-sm rounded-lg opacity-90"
        />
        <h3 className="mb-2 text-xl font-semibold">
          {filter === 'all' && 'No tasks yet'}
          {filter === 'active' && 'No active tasks'}
          {filter === 'completed' && 'No completed tasks'}
        </h3>
        <p className="mb-6 text-muted-foreground">
          {filter === 'all' && 'Create your first task to get started'}
          {filter === 'active' && 'All your tasks are completed!'}
          {filter === 'completed' && 'Complete some tasks to see them here'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {sortedTasks.map((task) => (
        <TaskRow key={task.id.toString()} task={task} />
      ))}
    </div>
  );
}
