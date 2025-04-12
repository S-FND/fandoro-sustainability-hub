
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data (will be replaced with Supabase data)
const mockSDGProgress = [
  {
    id: '1',
    sdg_number: 7,
    target_description: 'Affordable and Clean Energy',
    progress_percentage: 65,
    initiatives: 'Solar panel installation, LED lighting conversion'
  },
  {
    id: '2',
    sdg_number: 12,
    target_description: 'Responsible Consumption and Production',
    progress_percentage: 42,
    initiatives: 'Waste reduction program, Sustainable procurement policy'
  },
  {
    id: '3',
    sdg_number: 13,
    target_description: 'Climate Action',
    progress_percentage: 58,
    initiatives: 'Carbon offset program, Emissions reduction targets'
  },
  {
    id: '4',
    sdg_number: 6,
    target_description: 'Clean Water and Sanitation',
    progress_percentage: 75,
    initiatives: 'Water recycling system, Reduced water consumption'
  }
];

const getSDGColor = (sdgNumber: number) => {
  const colors: Record<number, string> = {
    1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D',
    5: '#FF3A21', 6: '#26BDE2', 7: '#FCC30B', 8: '#A21942',
    9: '#FD6925', 10: '#DD1367', 11: '#FD9D24', 12: '#BF8B2E',
    13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D',
    17: '#19486A'
  };
  return colors[sdgNumber] || '#777777';
};

export const SDGProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SDG Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockSDGProgress.map((sdg) => (
            <div key={sdg.id} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getSDGColor(sdg.sdg_number) }}
                  >
                    {sdg.sdg_number}
                  </div>
                  <h4 className="font-medium">{sdg.target_description}</h4>
                </div>
                <span className="text-sm font-medium">{sdg.progress_percentage}%</span>
              </div>
              
              <Progress value={sdg.progress_percentage} 
                className="h-2"
                style={{ 
                  '--progress-background': getSDGColor(sdg.sdg_number) 
                } as React.CSSProperties} 
              />
              
              <p className="text-sm text-muted-foreground">
                {sdg.initiatives}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
