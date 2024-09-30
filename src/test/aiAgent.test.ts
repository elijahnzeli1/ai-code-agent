// src/test/aiAgent.test.ts

import { AIAgent } from '../utils/aiAgent';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as fs from 'fs';

// describe('AIAgent', () => {
//   let aiAgent: AIAgent;

//   beforeEach(() => {
//     aiAgent = new AIAgent('fake-api-key');
//   });

//   it('should generate code', async () => {
//     const generateContentStub = sinon.stub(aiAgent['model'], 'generateContent').resolves({
//       response: { text: () => 'Generated code' }
//     });

//     const result = await aiAgent.generateCode('Test prompt');

//     expect(result).to.equal('Generated code');
//     expect(generateContentStub.calledOnce).to.be.true;
//     expect(generateContentStub.calledWith('Test prompt')).to.be.true;
//   });

// src/test/aiAgent.test.ts


describe('AIAgent', () => {
    let aiAgent: AIAgent;

    beforeEach(() => {
        aiAgent = new AIAgent('fake-api-key');
    });

    it('should generate code', async () => {
        const generateContentStub = sinon.stub(aiAgent['model'], 'generateContent').resolves({
            response: { text: () => 'Generated code' }
        });

        const result = await aiAgent.generateCode('Test prompt');

        expect(result).to.equal('Generated code');
        expect(generateContentStub.calledOnce).to.be.true;
        expect(generateContentStub.calledWith('Test prompt')).to.be.true;
    });

    it('should learn from documentation', async () => {
        const learnFromMultipleUrlsStub = sinon.stub(aiAgent['documentationLearner'], 'learnFromMultipleUrls').resolves();
        const getKnowledgeStub = sinon.stub(aiAgent['documentationLearner'], 'getKnowledge').returns('Learned knowledge');
        const generateContentStub = sinon.stub(aiAgent['model'], 'generateContent').resolves({
            response: { text: () => 'Knowledge incorporated' }
        });

        await aiAgent.learnFromDocumentation(["https://nextjs.org/docs",
              "https://ui.shadcn.com/docs",
              "https://www.radix-ui.com/docs/primitives"]);

        expect(learnFromMultipleUrlsStub.calledOnce).to.be.true;
        expect(getKnowledgeStub.calledOnce).to.be.true;
        expect(generateContentStub.calledOnce).to.be.true;
        expect(generateContentStub.calledWith('Learn and incorporate this information into your knowledge base: Learned knowledge')).to.be.true;
    });

    it('should create a project', async () => {
        const workspaceFoldersStub = sinon.stub(vscode.workspace, 'workspaceFolders').value([{ uri: { fsPath: '/fake/path' } }]);
        const existsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
        const mkdirSyncStub = sinon.stub(fs, 'mkdirSync').returns(undefined);
        const createTerminalStub = sinon.stub(vscode.window, 'createTerminal').returns({
            sendText: sinon.spy(),
            show: sinon.spy()
        } as any);

        await aiAgent.createProject('test-project', 'next');

        expect(existsSyncStub.calledOnce).to.be.true;
        expect(mkdirSyncStub.calledOnce).to.be.true;
        expect(createTerminalStub.calledOnce).to.be.true;
    });

    it('should add a component', async () => {
        const generateContentStub = sinon.stub(aiAgent['model'], 'generateContent').resolves({
            response: { text: () => 'Generated component code' }
        });

        const result = await aiAgent.addComponent('TestComponent', 'functional');

        expect(result).to.equal('Generated component code');
        expect(generateContentStub.calledOnce).to.be.true;
        expect(generateContentStub.calledWith('Create a functional component named TestComponent using React and TypeScript. Use Tailwind CSS for styling.')).to.be.true;
    });

    it('should optimize code', async () => {
        const generateContentStub = sinon.stub(aiAgent['model'], 'generateContent').resolves({
            response: { text: () => 'Optimized code' }
        });

        const result = await aiAgent.optimizeCode('const a = 1;');

        expect(result).to.equal('Optimized code');
        expect(generateContentStub.calledOnce).to.be.true;
        expect(generateContentStub.calledWith('Optimize the following code for performance and readability:\n\nconst a = 1;')).to.be.true;
    });
});
// });