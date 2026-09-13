import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PriorityItem {
  id: string;
  title: string;
  course: string;
  priorityScore: number; // 0-100
  progress: number;
}

const mockPriorities: PriorityItem[] = [
  { id: '1', title: 'Final Project Prototype', course: 'Computer Science', priorityScore: 95, progress: 40 },
  { id: '2', title: 'Term Paper Draft', course: 'Literature', priorityScore: 88, progress: 15 },
  { id: '3', title: 'Weekly Quiz Prep', course: 'Chemistry', priorityScore: 75, progress: 0 },
];

export function PriorityList() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Top Priorities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {mockPriorities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center">No high priority tasks right now.</p>
          ) : (
            mockPriorities.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  </div>
                  <div className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Score: {item.priorityScore}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={item.progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[3ch]">{item.progress}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
