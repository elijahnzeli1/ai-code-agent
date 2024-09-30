// src/components/CodeEditor.tsx

import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  initialValue: string;
  language: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, language, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor | null = null;

  useEffect(() => {
    if (editorRef.current) {
      editor = monaco.editor.create(editorRef.current, {
        value: initialValue,
        language: language,
        theme: 'vs-dark',
        minimap: { enabled: false },
        automaticLayout: true,
      });

      editor.onDidChangeModelContent(() => {
        onChange(editor!.getValue());
      });
    }

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [initialValue, language, onChange]);

  return <div ref={editorRef} style={{ width: '100%', height: '400px' }} />;
};