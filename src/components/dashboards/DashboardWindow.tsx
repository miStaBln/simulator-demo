
import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DashboardWindowProps = {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
};

const DashboardWindow = ({ title, onRemove, children }: DashboardWindowProps) => {
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 h-[calc(100%-40px)] overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWindow;
