import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  daysLeft: number;
}

const mockDeadlines: Deadline[] = [
  { id: '1', title: 'Lab Report 3', subject: 'Physics', dueDate: 'Oct 15', daysLeft: 2 },
  { id: '2', title: 'Midterm Essay', subject: 'History', dueDate: 'Oct 17', daysLeft: 4 },
  { id: '3', title: 'Problem Set 5', subject: 'Calculus', dueDate: 'Oct 19', daysLeft: 6 },
];

export function UpcomingDeadlines() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-destructive" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDeadlines.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center">No upcoming deadlines in next 7 days.</p>
          ) : (
            mockDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0 last:pb-0 gap-2">
                <div>
                  <h4 className="font-semibold text-sm">{deadline.title}</h4>
                  <p className="text-xs text-muted-foreground">{deadline.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{deadline.dueDate}</span>
                  <Badge variant={deadline.daysLeft <= 3 ? 'destructive' : 'secondary'}>
                    {deadline.daysLeft} days
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
