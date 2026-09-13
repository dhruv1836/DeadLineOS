import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock schedule items
const scheduleItems = [
  { id: 1, title: 'Calculus Assignment 4 - Section 1', time: '10:00 AM - 12:00 PM', date: 'Today', type: 'Study Session' },
  { id: 2, title: 'Physics Lab Report', time: '2:00 PM - 5:00 PM', date: 'Today', type: 'Assignment Work' },
  { id: 3, title: 'History Reading', time: '9:00 AM - 10:30 AM', date: 'Tomorrow', type: 'Reading' },
  { id: 4, title: 'Calculus Assignment 4 - Finalize', time: '11:00 AM - 12:00 PM', date: 'Tomorrow', type: 'Study Session' },
];

export default function ListView() {
  const groupedItems = scheduleItems.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof scheduleItems>);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-background/95 py-2 backdrop-blur z-10 border-b">
            {date}
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="text-sm font-medium w-32 text-muted-foreground">
                      {item.time}
                    </div>
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
