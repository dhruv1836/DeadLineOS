import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarView from '../components/timeline/CalendarView';
import ListView from '../components/timeline/ListView';

export default function Timeline() {
  return (
    <div className="container mx-auto p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Timeline & Schedule</h1>
      </div>

      <Tabs defaultValue="list" className="flex-1 flex flex-col">
        <TabsList className="mb-4 self-start">
          <TabsTrigger value="3d">3D View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="3d" className="flex-1 min-h-[500px] border rounded-lg flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground">3D View Implementation Pending (Three.js/R3F)</p>
        </TabsContent>
        
        <TabsContent value="calendar" className="flex-1">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="list" className="flex-1">
          <ListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
