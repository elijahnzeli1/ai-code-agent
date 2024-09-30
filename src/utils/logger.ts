// src/utils/logger.ts

import * as vscode from 'vscode';

export class Logger {
  private static outputChannel: vscode.OutputChannel;

  static initialize() {
    this.outputChannel = vscode.window.createOutputChannel('AI Next.js Agent');
  }

  static log(message: string) {
    this.outputChannel.appendLine(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  static error(message: string, error?: any) {
    this.outputChannel.appendLine(`[ERROR] ${new Date().toISOString()}: ${message}`);
    if (error) {
      this.outputChannel.appendLine(JSON.stringify(error, null, 2));
    }
    vscode.window.showErrorMessage(`AI Next.js Agent Error: ${message}`);
  }

  static show() {
    this.outputChannel.show();
  }
}