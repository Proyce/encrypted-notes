import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note, NoteVersion } from '../interfaces/note';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  notes$: Observable<Note[]> = this.notesSubject.asObservable();
  private selectedNoteSubject: BehaviorSubject<Note | null> = new BehaviorSubject<Note | null>(null);
  selectedNote$: Observable<Note | null> = this.selectedNoteSubject.asObservable();
  private notesKey = 'notes';

  constructor(private encryptionService: EncryptionService) {
    this.loadNotes();
  }

  private loadNotes(): void {
    const encryptedNotes = localStorage.getItem(this.notesKey);
    if (encryptedNotes) {
      const decryptedNotes = this.encryptionService.decrypt(encryptedNotes);
      this.notesSubject.next(JSON.parse(decryptedNotes));
    }
  }

  private saveNotes(notes: Note[]): void {
    const notesString = JSON.stringify(notes);
    const encryptedNotes = this.encryptionService.encrypt(notesString);
    localStorage.setItem(this.notesKey, encryptedNotes);
    this.notesSubject.next(notes);
  }

  addNote(noteData: Partial<Note>): void {
    const newNote: Note = {
      id: new Date().getTime().toString(),
      title: noteData?.title || 'New Note',
      content: noteData?.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      history: [],
      imageUrl: noteData?.imageUrl || '',
    };

    const notes = [newNote, ...this.notesSubject.getValue()];
    this.saveNotes(notes);
    this.selectedNoteSubject.next(newNote);
  }

  updateNote(updatedNote: Note): void {
    const notes = this.notesSubject.getValue().map(n => {
      if (n?.id === updatedNote?.id) {
        const newVersion: NoteVersion = {
          version: n?.version,
          title: n?.title,
          content: n?.content,
          createdAt: n?.updatedAt
        };
        return {
          ...updatedNote,
          version: n?.version + 1,
          history: [...n?.history, newVersion],
          updatedAt: new Date()
        };
      }
      return n;
    });
    this.saveNotes(notes);
    this.selectedNoteSubject.next(updatedNote);
  }

  deleteNote(noteId: string): void {
    const notes = this.notesSubject.getValue().filter(note => note.id !== noteId);
    this.saveNotes(notes);
    this.selectedNoteSubject.next(null);
  }

  selectNote(note: Note): void {
    this.selectedNoteSubject.next(note);
  }

  getNoteVersions(noteId: string): NoteVersion[] {
    const note = this.notesSubject.getValue().find(n => n.id === noteId);
    return note ? note.history : [];
  }
}
