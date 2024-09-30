// src/utils/vscodeUtils.ts

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

export class VSCodeUtils {
  getProjectPath(projectName: string): string {
      throw new Error('Method not implemented.');
  }
  async createProjectDirectory(projectName: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error('No workspace folder open');
    }

    const projectPath = path.join(workspaceFolders[0].uri.fsPath, projectName);

    if (await fs.pathExists(projectPath)) {
      throw new Error('Project already exists');
    }

    await fs.mkdir(projectPath);
    return projectPath;
  }

  async initializeProject(projectPath: string, projectType: 'next' | 'react'): Promise<void> {
    const terminal = vscode.window.createTerminal({
      name: 'Project Initialization',
      cwd: projectPath
    });

    if (projectType === 'next') {
      terminal.sendText('npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"');
    } else {
      terminal.sendText('npx create-react-app . --template typescript');
      terminal.sendText('npm install tailwindcss postcss autoprefixer');
      terminal.sendText('npx tailwindcss init -p');
    }

    terminal.show();
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the command to complete
  }

  async installDependencies(projectPath: string): Promise<void> {
    const dependencies = [
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ];

    const devDependencies = [
      'shadcn-ui'
    ];

    const terminal = vscode.window.createTerminal({
      name: 'Dependency Installation',
      cwd: projectPath
    });

    terminal.sendText(`npm install ${dependencies.join(' ')}`);
    terminal.sendText(`npm install -D ${devDependencies.join(' ')}`);
    terminal.sendText('npx shadcn-ui@latest init');

    terminal.show();
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the command to complete
  }

  async createFile(filePath: string, content: string): Promise<void> {
    await fs.outputFile(filePath, content);
  }

  async updateTailwindConfig(projectPath: string): Promise<void> {
    const configPath = path.join(projectPath, 'tailwind.config.js');
    const config = `
      module.exports = {
        darkMode: ["class"],
        content: [
          './pages/**/*.{ts,tsx}',
          './components/**/*.{ts,tsx}',
          './app/**/*.{ts,tsx}',
          './src/**/*.{ts,tsx}',
        ],
        theme: {
          container: {
            center: true,
            padding: "2rem",
            screens: {
              "2xl": "1400px",
            },
          },
          extend: {
            colors: {
              border: "hsl(var(--border))",
              input: "hsl(var(--input))",
              ring: "hsl(var(--ring))",
              background: "hsl(var(--background))",
              foreground: "hsl(var(--foreground))",
              primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
              },
              secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
              },
              destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
              },
              muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
              },
              accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
              },
              popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
              },
              card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
              },
            },
            borderRadius: {
              lg: "var(--radius)",
              md: "calc(var(--radius) - 2px)",
              sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
              "accordion-down": {
                from: { height: 0 },
                to: { height: "var(--radix-accordion-content-height)" },
              },
              "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: 0 },
              },
            },
            animation: {
              "accordion-down": "accordion-down 0.2s ease-out",
              "accordion-up": "accordion-up 0.2s ease-out",
            },
          },
        },
        plugins: [require("tailwindcss-animate")],
      }
    `;

    await this.createFile(configPath, config);
  }
}