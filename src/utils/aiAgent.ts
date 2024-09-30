// src/utils/aiAgent.ts

import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentationLearner } from './documentationLearner';
import { VSCodeUtils } from './vscodeUtils';

export class AIAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private documentationLearner: DocumentationLearner;
  private vscodeUtils: VSCodeUtils;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.documentationLearner = new DocumentationLearner();
    this.vscodeUtils = new VSCodeUtils();
  }

  async generateCode(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  async createProject(projectName: string, projectType: 'next' | 'react'): Promise<void> {
    const projectPath = await this.vscodeUtils.createProjectDirectory(projectName);
    await this.vscodeUtils.initializeProject(projectPath, projectType);
    await this.generateDefaultComponents(projectPath);
    await this.vscodeUtils.installDependencies(projectPath);
  }

  async generateDefaultComponents(projectPath: string): Promise<void> {
    const components = [
      { name: 'Button', type: 'ui' },
      { name: 'Card', type: 'ui' },
      { name: 'Input', type: 'form' },
      { name: 'Navbar', type: 'layout' },
    ];

    for (const component of components) {
      const componentCode = await this.generateComponentCode(component.name, component.type);
      await this.vscodeUtils.createFile(
        path.join(projectPath, 'src', 'components', `${component.name}.tsx`),
        componentCode
      );
    }
  }

  async generateComponentCode(name: string, type: string): Promise<string> {
    const prompt = `
      Generate a React component named ${name} of type ${type} using TypeScript.
      Use Tailwind CSS for styling and incorporate relevant Radix UI primitives if applicable.
      The component should be accessible and follow best practices.
    `;
    return this.generateCode(prompt);
  }

  async addComponent(componentName: string, componentType: string): Promise<string> {
    const code = await this.generateComponentCode(componentName, componentType);
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      const componentPath = path.join(workspaceFolders[0].uri.fsPath, 'src', 'components', `${componentName}.tsx`);
      await this.vscodeUtils.createFile(componentPath, code);
    }
    return code;
  }

  async optimizeCode(code: string): Promise<string> {
    const prompt = `
      Optimize the following code for performance and readability.
      Ensure it follows React and TypeScript best practices:

      ${code}
    `;
    return this.generateCode(prompt);
  }

  async learnFromDocumentation(urls: string[]): Promise<void> {
    await this.documentationLearner.learnFromMultipleUrls(urls);
    const knowledge = this.documentationLearner.getKnowledge();
    await this.model.generateContent(`Learn and incorporate this information into your knowledge base: ${knowledge}`);
  }
}