// src/components/ProjectManager.tsx

import * as React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

interface ProjectManagerProps {
  onCreateProject: (name: string, type: 'next' | 'react') => void;
  onAddComponent: (name: string, type: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onCreateProject, onAddComponent }) => {
  const [projectName, setProjectName] = React.useState('');
  const [projectType, setProjectType] = React.useState<'next' | 'react'>('next');
  const [componentName, setComponentName] = React.useState('');
  const [componentType, setComponentType] = React.useState('');

  const handleCreateProject = () => {
    onCreateProject(projectName, projectType);
    setProjectName('');
  };

  const handleAddComponent = () => {
    onAddComponent(componentName, componentType);
    setComponentName('');
    setComponentType('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create Project</h2>
        <div className="flex space-x-2">
          <Input
            value={projectName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />
          <Select value={projectType} onValueChange={(value: 'next' | 'react') => setProjectType(value)}>
            <SelectTrigger>
              <button>{projectType === 'next' ? 'Next.js' : 'React'}</button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="react">React</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Add Component</h2>
        <div className="flex space-x-2">
          <Input
            value={componentName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComponentName(e.target.value)}
            placeholder="Component Name"
          />
          <Input
            value={componentType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComponentType(e.target.value)}
            placeholder="Component Type"
          />
          <Button onClick={handleAddComponent}>Add Component</Button>
        </div>
      </div>
    </div>
  );
};