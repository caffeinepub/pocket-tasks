import { useState } from 'react';
import { useCreateTask } from '../../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface TaskComposerProps {
  onSuccess?: () => void;
}

export default function TaskComposer({ onSuccess }: TaskComposerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask.mutateAsync({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle('');
    setDescription('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          autoFocus
          required
        />
        <p className="text-xs text-muted-foreground">
          {title.length}/80 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add more details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="resize-none"
        />
      </div>

      <Button 
        type="submit" 
        disabled={!title.trim() || createTask.isPending}
        className="w-full"
        size="lg"
      >
        {createTask.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Task'
        )}
      </Button>
    </form>
  );
}
