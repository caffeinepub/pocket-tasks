import { useState } from 'react';
import TaskList from '../features/tasks/components/TaskList';
import TaskComposer from '../features/tasks/components/TaskComposer';
import TaskListControls from '../features/tasks/components/TaskListControls';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'newest' | 'oldest';

export default function TasksPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Controls */}
      <div className="sticky top-16 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TaskListControls 
          filter={filter} 
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Task List */}
      <div className="pb-24">
        <TaskList filter={filter} sort={sort} />
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setShowComposer(true)}
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Task Composer Sheet */}
      <Sheet open={showComposer} onOpenChange={setShowComposer}>
        <SheetContent side="bottom" className="h-[90vh] p-0">
          <SheetHeader className="border-b p-6">
            <SheetTitle>New Task</SheetTitle>
            <SheetDescription>
              Create a new task to keep track of your work
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto p-6" style={{ height: 'calc(90vh - 100px)' }}>
            <TaskComposer onSuccess={() => setShowComposer(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
