import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks, Task } from '@/hooks/useTasks';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Sparkles, 
  Flame, Volume2, VolumeX, Zap, Calendar, Target, Check
} from 'lucide-react';

const PRESETS = [
  { label: '25m Pomodoro', minutes: 25 },
  { label: '50m Deep Work', minutes: 50 },
  { label: '5m Quick Break', minutes: 5 },
  { label: '15m Long Break', minutes: 15 },
];

export function FocusEngineSection() {
  const { tasks, updateTask } = useTasks();
  const activeTasks = tasks.filter(t => t.status !== 'Completed');

  // Currently focused task (defaults to the first active task or null)
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeTasks[0]?.id || '');
  const activeTask = tasks.find(t => t.id === selectedTaskId) || activeTasks[0] || null;

  // Timer states
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Update selected task if list changes
  useEffect(() => {
    if (!selectedTaskId && activeTasks.length > 0) {
      setSelectedTaskId(activeTasks[0].id);
    }
  }, [activeTasks, selectedTaskId]);

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompletedSessions(prev => prev + 1);
      if (soundEnabled) {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {}
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, soundEnabled]);

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleSelectPreset = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const handleMarkTaskComplete = () => {
    if (activeTask) {
      updateTask({
        ...activeTask,
        progress: 100,
        status: 'Completed'
      });
      setIsActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Radial progress calculations
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-md bg-gradient-to-br from-white via-white to-indigo-50/30 overflow-hidden">
      <CardHeader className="border-b border-slate-100/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Autonomous Focus Station</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                  Real-time Task Link
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Target any deliverable, lock in with Pomodoro blocks, and log focus hours.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge variant="outline" className="text-xs font-bold text-slate-700 bg-white shadow-2xs gap-1 py-1 px-3 rounded-xl">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{completedSessions} Sessions Finished</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Selectable Deliverables List */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select Target Deliverable ({activeTasks.length} Active)</span>
              </span>
              <span className="text-[11px] text-slate-400">Click to activate focus</span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {activeTasks.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700">All coursework completed!</p>
                  <p className="text-[11px] text-slate-400">Add new assignments to start a new focus session.</p>
                </div>
              ) : (
                activeTasks.map((t) => {
                  const isSelected = activeTask?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTask(t)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-400 shadow-sm ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.course || 'General'}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            t.priority === 'High' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {t.priority} Priority
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate leading-tight">
                          {t.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Due: {new Date(t.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <span>{t.progress}% done</span>
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'outline'}
                        className={`text-xs font-bold rounded-xl shrink-0 h-8 px-3 ${
                          isSelected ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Targeted' : 'Focus'}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Interactive Radial Timer Station */}
          <div className="lg:col-span-6 flex flex-col items-center bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            {/* Active Target Banner */}
            <div className="text-center space-y-1 w-full">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Targeting: {activeTask?.course || 'Academic Task'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate max-w-sm mx-auto">
                {activeTask?.title || 'General Deep Work Session'}
              </h3>
            </div>

            {/* Duration Presets */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSelectPreset(p.minutes)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMinutes === p.minutes
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Radial Clock Circle */}
            <div className="relative flex items-center justify-center">
              <svg className="w-56 h-56 -rotate-90 transform">
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="112"
                  cy="112"
                  r={radius}
                  stroke={isActive ? '#6366f1' : '#94a3b8'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                  {isActive ? (
                    <span className="text-indigo-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" /> Focus Active
                    </span>
                  ) : (
                    'Ready'
                  )}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full justify-center">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={`h-11 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-1.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1.5" /> Start Focus
                  </>
                )}
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={resetTimer}
                className="h-11 w-11 rounded-2xl border-slate-200 hover:bg-slate-50"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`h-11 w-11 rounded-2xl border-slate-200 ${
                  soundEnabled ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400'
                }`}
                title={soundEnabled ? 'Sound Enabled' : 'Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {activeTask && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkTaskComplete}
                  className="h-11 px-3.5 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 ml-1"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>Mark Done</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}