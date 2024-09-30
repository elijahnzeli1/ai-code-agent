import * as vscode from 'vscode';
import { AIAgent } from '../utils/aiAgent';
import { VSCodeUtils } from '../utils/vscodeUtils';
import { Logger } from '../utils/logger';

let aiAgent: AIAgent | null = null;
let vscodeUtils: VSCodeUtils | null = null;

export async function activate(context: vscode.ExtensionContext) {
    Logger.initialize();
    Logger.log('AI Next.js Agent is now active!');

    vscodeUtils = new VSCodeUtils();

    context.subscriptions.push(
        vscode.commands.registerCommand('aiNextjsAgent.start', startAgent),
        vscode.commands.registerCommand('aiNextjsAgent.createProject', createProject),
        vscode.commands.registerCommand('aiNextjsAgent.addComponent', addComponent),
        vscode.commands.registerCommand('aiNextjsAgent.optimizeCode', optimizeCode)
    );

    Logger.log('AI Next.js Agent commands registered');
}

async function startAgent() {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Gemini API key',
        ignoreFocusOut: true
    });

    if (!apiKey) {
        vscode.window.showErrorMessage('Gemini API key is required to use the AI Next.js Agent');
        return;
    }

    aiAgent = new AIAgent(apiKey);

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Initializing AI Agent",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Learning from documentation..." });
            if (aiAgent) {
                await aiAgent.learnFromDocumentation([
                'https://nextjs.org/docs',
                'https://tailwindcss.com/docs',
                'https://ui.shadcn.com/docs',
                'https://www.radix-ui.com/docs/primitives'
            ]);
        } else {
            vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
            return;
        }
        });

        vscode.window.showInformationMessage('AI Next.js Agent is ready!');
        Logger.log('AI Next.js Agent initialized successfully');
    } catch (error) {
        Logger.error('Failed to initialize AI Agent', error);
        vscode.window.showErrorMessage('Failed to initialize AI Agent. Please try again.');
    }
}

async function createProject() {
    if (!aiAgent || !vscodeUtils) {
        vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
        return;
    }

    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter project name',
        ignoreFocusOut: true
    });

    if (!projectName) return;

    const projectType = await vscode.window.showQuickPick(['next', 'react'], {
        placeHolder: 'Select project type'
    }) as 'next' | 'react';

    if (!projectType) return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating ${projectType} project: ${projectName}`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Initializing project..." });
            if (aiAgent) {
                await aiAgent.createProject(projectName, projectType);
            } else {
                vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
                return;
            }

            progress.report({ message: "Generating default components..." });
            if (vscodeUtils) {
                await aiAgent.generateDefaultComponents(vscodeUtils.getProjectPath(projectName));
            } else {
                vscode.window.showErrorMessage('VSCodeUtils is not initialized.');
                return;
            }

            progress.report({ message: "Installing dependencies..." });
            await vscodeUtils.installDependencies(vscodeUtils.getProjectPath(projectName));

            progress.report({ message: "Updating configuration..." });
            await vscodeUtils.updateTailwindConfig(vscodeUtils.getProjectPath(projectName));
        });

        vscode.window.showInformationMessage(`${projectType} project "${projectName}" created successfully!`);
        Logger.log(`Project "${projectName}" created successfully`);
    } catch (error) {
        Logger.error(`Failed to create project "${projectName}"`, error);
        vscode.window.showErrorMessage(`Failed to create project "${projectName}". ${(error as Error).message}`);
    }
}

async function addComponent() {
    if (!aiAgent) {
        vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
        return;
    }

    const componentName = await vscode.window.showInputBox({
        prompt: 'Enter component name',
        ignoreFocusOut: true
    });

    if (!componentName) return;

    const componentType = await vscode.window.showQuickPick([
        'Button', 'Card', 'Form', 'Layout', 'Navigation', 'Modal', 'Table', 'Custom'
    ], {
        placeHolder: 'Select component type'
    });

    if (!componentType) return;

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Generating ${componentType} component: ${componentName}`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Generating component code..." });
            if (!aiAgent) {
                vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
                return;
            }
            const componentCode = await aiAgent.addComponent(componentName, componentType);

            progress.report({ message: "Creating component file..." });
            const document = await vscode.workspace.openTextDocument({
                content: componentCode,
                language: 'typescript'
            });
            await vscode.window.showTextDocument(document);
        });

        vscode.window.showInformationMessage(`Component "${componentName}" generated successfully!`);
        Logger.log(`Component "${componentName}" generated successfully`);
    } catch (error) {
        Logger.error(`Failed to generate component "${componentName}"`, error);
        vscode.window.showErrorMessage(`Failed to generate component "${componentName}". ${(error as Error).message}`);
    }
}

async function optimizeCode() {
    if (!aiAgent) {
        vscode.window.showErrorMessage('AI Next.js Agent is not initialized. Run the start command first.');
        return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selectedCode = editor.document.getText(editor.selection);
    if (!selectedCode) {
        vscode.window.showErrorMessage('No code selected');
        return;
    }

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Optimizing code",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Analyzing and optimizing..." });
            const optimizedCode = await aiAgent!.optimizeCode(selectedCode);

            progress.report({ message: "Applying optimizations..." });
            await editor.edit(editBuilder => {
                editBuilder.replace(editor.selection, optimizedCode);
            });
        });

        vscode.window.showInformationMessage('Code optimized successfully!');
        Logger.log('Code optimized successfully');
    } catch (error) {
        Logger.error('Failed to optimize code', error);
        vscode.window.showErrorMessage(`Failed to optimize code. ${(error as Error).message}`);
    }
}

export function deactivate() {
    Logger.log('AI Next.js Agent deactivated');
}