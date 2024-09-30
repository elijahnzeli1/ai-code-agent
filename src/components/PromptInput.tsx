import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="flex-grow"
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};