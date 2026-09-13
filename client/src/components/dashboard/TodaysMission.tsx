import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'focus' | 'break' | 'class';
}

const mockMission: ScheduleBlock[] = [
  { id: '1', title: 'Deep Work: Physics Assignment', startTime: '09:00', endTime: '11:00', type: 'focus' },
  { id: '2', title: 'Coffee Break', startTime: '11:00', endTime: '11:15', type: 'break' },
  { id: '3', title: 'Data Structures Lecture', startTime: '11:30', endTime: '13:00', type: 'class' },
];

export function TodaysMission() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Today's Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMission.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center">No tasks scheduled for today.</p>
          ) : (
            mockMission.map((block) => (
              <div key={block.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{block.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {block.startTime} - {block.endTime}
                  </span>
                </div>
                <Badge variant={block.type === 'focus' ? 'default' : block.type === 'break' ? 'secondary' : 'outline'}>
                  {block.type}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
