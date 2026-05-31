import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Session, Answer, Progress } from '../types';

interface DoomsdayDB extends DBSchema {
  sessions: {
    key: number;
    value: Session;
    indexes: { 'by-date': string };
  };
  answers: {
    key: number;
    value: Answer;
    indexes: {
      'by-session': number;
      'by-correct': number; // 1 for true, 0 for false to allow filtering if needed
    };
  };
  progress: {
    key: string;
    value: Progress;
  };
}

let dbPromise: Promise<IDBPDatabase<DoomsdayDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<DoomsdayDB>('doomsday_db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('by-date', 'date');
          const answerStore = db.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
          answerStore.createIndex('by-session', 'sessionId');
        }
        if (oldVersion < 2) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
      },
      blocking(currentVersion, blockedVersion, event) {
        // If another tab tries to upgrade, close this connection
        dbPromise?.then(db => db.close());
        dbPromise = null;
      },
      terminated() {
        dbPromise = null;
      }
    });

    // Handle unexpected closures (e.g., from dev tools or browser)
    dbPromise.then(db => {
      db.addEventListener('close', () => {
        dbPromise = null;
      });
      db.addEventListener('versionchange', () => {
        db.close();
        dbPromise = null;
      });
    }).catch(err => {
      dbPromise = null;
      console.error("Failed to open DB", err);
    });
  }
  return dbPromise;
}

export async function saveProgress(completedLessons: number[]): Promise<void> {
  const db = await getDB();
  const existing = await db.get('progress', 'user');
  await db.put('progress', { 
    id: 'user', 
    completedLessons,
    streak: existing?.streak,
    lastDailyDate: existing?.lastDailyDate
  });
}

export async function getProgress(): Promise<number[]> {
  const db = await getDB();
  const data = await db.get('progress', 'user');
  return data?.completedLessons || [];
}

export async function getFullProgress() {
  const db = await getDB();
  return db.get('progress', 'user');
}

export async function saveDailyStreak(dateStr: string): Promise<void> {
  const db = await getDB();
  const existing = await db.get('progress', 'user');
  let streak = existing?.streak || 0;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${(yesterday.getMonth()+1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
  
  if (existing?.lastDailyDate === yesterdayStr) {
    streak += 1;
  } else if (existing?.lastDailyDate === dateStr) {
    // Already completed today do nothing to streak
  } else {
    // Missed a day or first time
    streak = 1;
  }

  await db.put('progress', { 
    id: 'user', 
    completedLessons: existing?.completedLessons || [],
    streak,
    lastDailyDate: dateStr
  });
}

export async function addSession(session: Omit<Session, 'id'>): Promise<number> {
  const db = await getDB();
  return db.add('sessions', session);
}

export async function addAnswer(answer: Omit<Answer, 'id'>): Promise<number> {
  const db = await getDB();
  return db.add('answers', answer);
}

export async function getAllSessions(): Promise<Session[]> {
  const db = await getDB();
  return db.getAll('sessions');
}

export async function getAnswersForSession(sessionId: number): Promise<Answer[]> {
  const db = await getDB();
  return db.getAllFromIndex('answers', 'by-session', sessionId);
}

export async function getAllAnswers(): Promise<Answer[]> {
  const db = await getDB();
  return db.getAll('answers');
}
