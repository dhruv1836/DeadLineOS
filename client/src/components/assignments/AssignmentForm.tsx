import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { FileUp, Sparkles, AlertCircle, CheckCircle2, Calendar, BookOpen } from 'lucide-react';

interface AssignmentFormProps {
  onCancel?: () => void;
  onSubmit?: (data: { title: string; course: string; deadline: string; priority: 'Low' | 'Medium' | 'High'; description: string; source_file_path?: string }) => void;
  initialData?: any;
}

export default function AssignmentForm({ onCancel, onSubmit, initialData }: AssignmentFormProps) {
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisSuccess, setAnalysisSuccess] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    title: '',
    course: '',
    deadline: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    description: '',
    source_file_path: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.deadline && onSubmit) {
      onSubmit(formData);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalysisError('');
    setAnalysisSuccess(false);
    setAnalysisLoading(true);

    try {
      const result: any = await api.analyzePdf(file);
      setFormData((current: any) => ({
        ...current,
        source_file_path: result.source_file_path || '',
        title: result.title || current.title,
        course: result.subject || current.course,
        deadline: result.deadline ? toDateTimeLocal(result.deadline) : current.deadline,
        description: result.description || current.description,
        priority: result.difficulty === 'hard' ? 'High' : result.difficulty === 'easy' ? 'Low' : 'Medium'
      }));
      setAnalysisSuccess(true);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'PDF analysis failed. Please check your backend connection.');
    } finally {
      setAnalysisLoading(false);
      e.target.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">
          {initialData ? 'Edit Deliverable' : 'Add New Academic Deliverable'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* AI Syllabus / PDF Upload Dropzone */}
          <div className="space-y-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 transition-all hover:bg-indigo-50/70">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 cursor-pointer" htmlFor="assignment-pdf">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Syllabus & PDF Decomposition</span>
              </label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                Auto-Extracts Milestones
              </span>
            </div>
            
            <Input 
              id="assignment-pdf" 
              type="file" 
              accept="application/pdf,.pdf" 
              onChange={handlePdfUpload} 
              disabled={analysisLoading}
              className="bg-white text-xs cursor-pointer rounded-xl border-indigo-200" 
            />
            
            <p className="text-[11px] text-slate-500">
              Upload any PDF rubric or syllabus prompt. GPT-4o will automatically extract the Title, Subject, Deadline, and Description.
            </p>

            {analysisLoading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 py-1">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Parsing PDF & decomposing syllabus requirements...</span>
              </div>
            )}

            {analysisSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Extracted requirements & pre-filled fields below!</span>
              </div>
            )}

            {analysisError && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Deliverable Title</label>
            <Input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. CS 161 Final Exam Problem Set" 
              className="rounded-xl bg-slate-50/50"
            />
          </div>
          
          {/* Course & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Course / Subject</label>
              <Input 
                value={formData.course}
                onChange={e => setFormData({...formData, course: e.target.value})}
                placeholder="e.g. Computer Science" 
                className="rounded-xl bg-slate-50/50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Deadline</label>
              <Input 
                type="datetime-local" 
                required
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="rounded-xl bg-slate-50/50"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Priority Level</label>
            <select 
              className="flex h-10 w-full rounded-xl border border-input bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
              value={formData.priority}
              onChange={e => setFormData({...formData, priority: e.target.value as any})}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Description & Rubric Notes</label>
            <textarea 
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-slate-50/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Add key instructions, chapters, or rubric details..."
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl text-xs font-bold">
            Cancel
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20">
            Save Deliverable
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}