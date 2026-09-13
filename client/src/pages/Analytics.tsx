import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area
} from 'recharts';

const workloadData = [
  { subject: 'Math', hours: 12 },
  { subject: 'Physics', hours: 8 },
  { subject: 'Comp Sci', hours: 15 },
  { subject: 'History', hours: 5 },
  { subject: 'Literature', hours: 6 },
];

const completionRateData = [
  { week: 'W1', rate: 85 },
  { week: 'W2', rate: 88 },
  { week: 'W3', rate: 82 },
  { week: 'W4', rate: 95 },
  { week: 'W5', rate: 90 },
];

const funnelData = [
  { stage: 'Assigned', count: 40 },
  { stage: 'Started', count: 35 },
  { stage: 'Drafted', count: 28 },
  { stage: 'Completed', count: 25 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your academic performance and habits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workload by Subject</CardTitle>
            <CardDescription>Estimated hours required per subject</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-time Completion Rate</CardTitle>
            <CardDescription>Percentage of tasks completed before deadline</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assignment Completion Funnel</CardTitle>
            <CardDescription>Track where assignments get stuck</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
