import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Mock events
const events = [
  { id: 1, title: 'Math Study Session', day: 2, startHour: 10, duration: 2, color: 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-100' },
  { id: 2, title: 'Physics Lab', day: 4, startHour: 14, duration: 3, color: 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-100' },
  { id: 3, title: 'Write Essay Draft', day: 1, startHour: 16, duration: 1.5, color: 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-100' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export default function CalendarView() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 overflow-auto max-h-[700px]">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
            <div className="p-4 border-r font-semibold text-center text-muted-foreground">Time</div>
            {days.map((day, i) => (
              <div key={day} className={`p-4 border-r font-semibold text-center ${i === 2 ? 'bg-primary/10 text-primary' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b h-16">
                <div className="p-2 border-r text-sm text-muted-foreground text-right">
                  {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                {days.map((day) => (
                  <div key={`${day}-${hour}`} className="border-r border-dashed border-gray-200 dark:border-gray-800" />
                ))}
              </div>
            ))}

            {/* Events Overlay */}
            {events.map((event) => {
              const top = (event.startHour - 8) * 4; // 4rem per hour (h-16)
              const height = event.duration * 4;
              const left = ((event.day + 1) / 8) * 100;
              const width = 100 / 8;

              return (
                <div
                  key={event.id}
                  className={`absolute rounded-md p-2 text-xs font-medium shadow-sm overflow-hidden ${event.color}`}
                  style={{
                    top: `${top}rem`,
                    height: `${height}rem`,
                    left: `calc(${left}% + 4px)`,
                    width: `calc(${width}% - 8px)`,
                  }}
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
