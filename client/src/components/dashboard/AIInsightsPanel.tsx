import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface Insight {
  id: string;
  type: 'recommendation' | 'warning' | 'insight';
  message: string;
}

const mockInsights: Insight[] = [
  { id: '1', type: 'recommendation', message: 'You work best on Math assignments in the morning. Schedule your Calculus prep before noon.' },
  { id: '2', type: 'warning', message: 'You have 3 major deadlines bunching up next week. Start the History essay today to spread the load.' },
  { id: '3', type: 'insight', message: 'Your focus score has improved by 15% this week. Keep taking regular breaks!' },
];

export function AIInsightsPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="w-5 h-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.map((insight) => (
            <div key={insight.id} className="flex gap-3 items-start bg-background/50 p-3 rounded-lg">
              <div className="mt-0.5 bg-background p-1.5 rounded-full shadow-sm">
                {getIcon(insight.type)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
