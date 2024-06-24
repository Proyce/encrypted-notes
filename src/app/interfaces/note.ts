export interface NoteVersion {
  version: number;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  history: NoteVersion[];
}
