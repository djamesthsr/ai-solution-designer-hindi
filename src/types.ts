/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MCQQuestion {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ScenarioChoice {
  text: string;
  feedback: string;
  isCorrect: boolean;
  scoreImpact: number;
}

export interface ScenarioStep {
  id: string; // 'problem' | 'data' | 'model' | 'output'
  title: string;
  question: string;
  choices: ScenarioChoice[];
}

export interface BranchingScenario {
  id: string;
  name: string;
  icon: string;
  shortDesc: string;
  problemDesc: string;
  steps: Record<string, ScenarioStep>;
}

export interface CanvasCard {
  id: string;
  text: string;
  stage: "problem" | "data" | "model" | "output";
}

export interface ProjectCanvas {
  problem: string;
  data: string;
  model: string;
  output: string;
  reflection: string;
}

export interface CanvasReviewResult {
  strengths: string[];
  missingData: string[];
  improvements: string[];
  risks: string[];
  isFallback?: boolean;
}

export interface PeerProject {
  id: string;
  name: string;
  desc: string;
  collects: string[];
  output: string;
  reason: string;
}

export interface StudentProgress {
  currentStep: number; // 1 to 8 matching the Mission Flow
  xp: number;
  badgeUnlocked: boolean;
  
  // Activity 1: Inside the AI Innovation Studio
  activity1Sequence: string[]; // Problem, Data, Model, Output
  activity1MCQAnswers: Record<number, number>; // index of answer
  
  // Activity 2: AI Consultant Challenge
  activeScenarioId: string;
  scenarioAnswers: Record<string, Record<string, number>>; // scenarioId -> { stepId -> choiceIndex }
  scenarioScores: Record<string, number>; // scenarioId -> score out of 100
  
  // Activity 3: Build Your AI Project
  canvas: ProjectCanvas;
  canvasReview: CanvasReviewResult | null;
  canvasLoading: boolean;
  workflowSequence: string[]; // workflow items
  workflowCorrect: boolean | null;
  reflectionAnswer: string;
  
  // Activity 4: Present Your AI Solution
  essayProblem: string;
  essayData: string;
  essayHelp: string;
  essayRisks: string;
  peerReviewChoice: "A" | "B" | null;
  peerReviewChecked: boolean;
  ratings: {
    problem: number;
    data: number;
    model: number;
    output: number;
  };
}
