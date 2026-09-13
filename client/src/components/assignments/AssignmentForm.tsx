import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AssignmentFormProps {
  onCancel?: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
}

export default function AssignmentForm({ onCancel, onSubmit, initialData }: AssignmentFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    course: '',
    deadline: '',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Assignment' : 'Create New Assignment'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Final Essay" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Input 
                value={formData.course}
                onChange={e => setFormData({...formData, course: e.target.value})}
                placeholder="e.g., CS 101" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input 
                type="datetime-local" 
                required
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value})}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Add details about the assignment..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Assignment</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
