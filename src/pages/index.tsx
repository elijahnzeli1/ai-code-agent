// src/pages/index.tsx

import * as React from 'react';
import { PromptInput } from '@/components/PromptInput';
import { OutputPanel } from '@/components/OutputPanel';
import { ProjectManager } from '@/components/ProjectManager';
import { CodeEditor } from '../components/CodeEditor';
import { type } from 'os';

export default function Home() {
  const [output, setOutput] = React.useState('');
  const [code, setCode] = React.useState('');

  const handlePromptSubmit = async (prompt: string) => {
    // This would be replaced with actual API call to the AI agent
    setOutput(`Generated code for: ${prompt}\n// TODO: Implement actual code generation`);
  };
React.useEffect(() => {
    // This effect could be used to initialize or fetch data when the component mounts
    console.log('Home component mounted');
}, []);

  const handleCreateProject = (name: string, type: 'next' | 'react') => {
    setOutput(`Creating ${type} project: ${name}`);
    // TODO: Implement actual project creation
// Simulate project creation delay
setTimeout(() => {
  setOutput(`Project ${name} of type ${type} created successfully.`);
}, 1000);
  };

  const handleAddComponent = (name: string, type: string) => {
    setOutput(`Adding ${type} component: ${name}`);
    // TODO: Implement actual component addition
  };
setTimeout(() => {
    setOutput(`Component ${name} of type ${type} added successfully.`);
}, 1000);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Next.js Agent</h1>
      <CodeEditor
        initialValue={code}
        language="typescript"
        onChange={(value) => setCode(value)}
      />
      <ProjectManager onCreateProject={handleCreateProject} onAddComponent={handleAddComponent} />
      <div className="mt-4">
        <PromptInput onSubmit={handlePromptSubmit} />
      </div>
      <div className="mt-4">
        <OutputPanel output={output} />
      </div>
    </div>
  );
}