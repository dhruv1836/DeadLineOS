import { StatCard } from '@/components/dashboard/StatCard';
import { TodaysMission } from '@/components/dashboard/TodaysMission';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { FocusEngineSection } from '@/components/dashboard/FocusEngineSection';
import { AssignmentMatrixSection } from '@/components/dashboard/AssignmentMatrixSection';
import { BookOpen, CheckCircle, Target, Zap, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { tasks } = useTasks();

  const activeCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const avgProgress = tasks.length 
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) 
    : 0;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Academic Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500">Live telemetry, prioritized study blocks, and deep work engine.</p>
        </div>
        <Link to="/assignments">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>New Deliverable</span>
          </Button>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Assignments"
          value={activeCount}
          icon={BookOpen}
        />
        <StatCard
          title="Tasks Completed"
          value={completedCount}
          icon={CheckCircle}
        />
        <StatCard
          title="Average Progress"
          value={`${avgProgress}%`}
          icon={Target}
        />
        <StatCard
          title="Critical Deadlines"
          value={highPriorityCount}
          icon={Zap}
        />
      </div>

      {/* 📍 DEDICATED TASK-LINKED FOCUS & STUDY STATION */}
      <FocusEngineSection />

      {/* Autonomous Scoring Matrix & Subtask Decomposition Section */}
      <AssignmentMatrixSection />

      {/* Secondary Overview & Dynamic Insights */}
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