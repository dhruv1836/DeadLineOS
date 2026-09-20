import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { 
  ArrowLeft, Calendar, Clock, CheckCircle2, 
  Trash2, Play, FileText, CheckSquare
} from 'lucide-react';

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasks();

  const assignment = tasks.find((t) => t.id === id) || {
    id: id || '1',
    title: 'Calculus Final Preparation',
    course: 'MATH 101',
    description: 'Complete problem sets on integration by parts, Taylor series, and parametric curves.',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    priority: 'High' as const,
    status: 'In Progress' as const,
    progress: 40,
  };

  const [subtasks, setSubtasks] = useState([
    { id: '1', title: 'Review chapters 4 & 5 core definitions', completed: true },
    { id: '2', title: 'Solve odd-numbered practice problems', completed: false },
    { id: '3', title: 'Draft mock exam practice simulation', completed: false },
    { id: '4', title: 'Final proofing and formula sheet preparation', completed: false },
  ]);

  const toggleSubtask = (taskId: string) => {
    const updated = subtasks.map((st) => st.id === taskId ? { ...st, completed: !st.completed } : st);
    setSubtasks(updated);
    const completedCount = updated.filter((st) => st.completed).length;
    const progress = Math.round((completedCount / updated.length) * 100);
    const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
    updateTask({ ...assignment, progress, status });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/assignments')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assignments</span>
        </Button>

        <div className="flex items-center gap-2">
          <Link to="/demo">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              <span>Launch Focus Session</span>
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              deleteTask(assignment.id);
              navigate('/assignments');
            }}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Assignment Banner */}
      <Card className="rounded-2xl border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              {assignment.course || 'General'}
            </span>
            <Badge
              className={`text-xs font-bold rounded-lg ${
                assignment.priority === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {assignment.priority} Priority
            </Badge>
            <Badge variant="outline" className="text-xs font-bold rounded-lg capitalize">
              {assignment.status}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {assignment.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Due: {new Date(assignment.deadline).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Estimated: ~3.5 Hours</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Description & Interactive Subtasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-2xl border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Instructions & Rubric Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {assignment.description || 'No detailed instructions recorded. Uploading a syllabus PDF automatically pulls rubric guidelines into this section.'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Subtasks & Progress</span>
            </CardTitle>
            <CardDescription className="text-xs font-bold text-slate-900">
              {assignment.progress}% Completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  assignment.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${assignment.progress}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {subtasks.map((st) => (
                <label 
                  key={st.id}
                  onClick={() => toggleSubtask(st.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    st.completed 
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-xs font-medium leading-tight ${st.completed ? 'line-through text-slate-400' : ''}`}>
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}