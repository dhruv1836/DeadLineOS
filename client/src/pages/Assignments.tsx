import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
const MOCK_ASSIGNMENTS = [
  { id: '1', title: 'Calculus Assignment 4', course: 'MATH 101', deadline: '2026-09-15T23:59:00Z', priority: 'High', status: 'In Progress', progress: 40 },
  { id: '2', title: 'History Essay Draft', course: 'HIST 202', deadline: '2026-09-20T17:00:00Z', priority: 'Medium', status: 'Not Started', progress: 0 },
  { id: '3', title: 'Physics Lab Report', course: 'PHYS 101', deadline: '2026-09-18T12:00:00Z', priority: 'High', status: 'Almost Done', progress: 90 },
];

export default function Assignments() {
  const [search, setSearch] = useState('');

  const filteredAssignments = MOCK_ASSIGNMENTS.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Button>Create New</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input 
          placeholder="Search assignments..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {/* Mock filters could go here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={assignment.priority === 'High' ? 'destructive' : 'secondary'}>
                  {assignment.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">{assignment.course}</span>
              </div>
              <CardTitle className="mt-2">{assignment.title}</CardTitle>
              <CardDescription>Due: {new Date(assignment.deadline).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{assignment.status}</span>
                  <span>{assignment.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
