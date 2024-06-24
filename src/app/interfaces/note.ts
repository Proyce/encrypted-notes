export interface NoteHistory {
  version: number;
  content: string;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  history: NoteHistory[];
}
