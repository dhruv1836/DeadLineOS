import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TodaysMission } from '@/components/dashboard/TodaysMission';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { BookOpen, CheckCircle, Target, Zap } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here's your academic overview.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Assignments"
          value={12}
          icon={BookOpen}
          trend={{ value: '+2', isPositive: false }}
        />
        <StatCard
          title="Tasks Completed"
          value={34}
          icon={CheckCircle}
          trend={{ value: '+14%', isPositive: true }}
        />
        <StatCard
          title="Avg. Focus Score"
          value="85%"
          icon={Target}
          trend={{ value: '+5%', isPositive: true }}
        />
        <StatCard
          title="Productivity Streak"
          value="7 days"
          icon={Zap}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TodaysMission />
            <PriorityList />
          </div>
          <UpcomingDeadlines />
        </div>
        
        <div className="lg:col-span-1">
          <AIInsightsPanel />
        </div>
      </div>
    </div>
  );
}
