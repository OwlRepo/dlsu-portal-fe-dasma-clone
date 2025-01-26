import { cache } from 'react';

export interface StudentEntry {
  id: string;
  name: string;
  timestamp: string;
  imageUrl: string;
}

export interface LogEntry extends StudentEntry {
  turnstile: number;
}

const generateStudentEntry = (index: number): StudentEntry => ({
  id: `S${1000 + index}`,
  name: `Student ${index}`,
  timestamp: new Date(Date.now() - index * 60000).toLocaleString(), // Consistent timestamps
  imageUrl: `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(
    `Student ${index}`,
  )}`,
});

export const getStudentEntries = cache((count: number): StudentEntry[] => {
  return Array.from({ length: count }, (_, i) => generateStudentEntry(i + 1));
});

export const getLogEntries = cache((count: number): LogEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...generateStudentEntry(i + 1),
    turnstile: (i % 10) + 1,
  }));
});
