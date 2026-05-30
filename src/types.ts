import React from 'react';

export interface Session {
  id?: number;
  date: string; // ISO string
  duration: number; // in ms
  score: number;
  total: number;
}

export type AnswerStatus = 'correct' | 'incorrect' | 'correct_with_help' | 'incorrect_with_help';

export interface Answer {
  id?: number;
  sessionId: number;
  dateGiven: string; // YYYY-MM-DD
  userAnswer: number; // 0-6
  correctAnswer: number; // 0-6
  timeMs: number; // Response time in ms
  status?: AnswerStatus; // New property
  isCorrect?: boolean; // Legacy
  century: number;
  month: number;
}

export interface Progress {
  id: string;
  completedLessons: number[];
}

export type ViewState = 'home' | 'learn' | 'train' | 'analytics';

export interface LearnStep {
  title: string;
  content: React.ReactNode;
}
