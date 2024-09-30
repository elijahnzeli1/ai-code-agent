import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OutputPanelProps {
  output: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <pre>{output}</pre>
    </ScrollArea>
  );
};