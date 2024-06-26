import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note, NoteVersion } from '../interfaces/note';
import { EncryptionService } from './encryption.service';
import jsPDF from 'jspdf';

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

  importNotes(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const notes: Note[] = JSON.parse(e.target.result as string);
        const existingNotes = this.notesSubject.getValue();
        const combinedNotes = [...notes, ...existingNotes];
        this.saveNotes(combinedNotes);
      } else {
        console.error('Failed to read file or file is empty');
      }
    };
    reader.readAsText(file);
  }

  exportNotes(): void {
    const notes = this.notesSubject.getValue();
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  saveNoteAsPDF(note: Note): void {
    const doc = new jsPDF();
    doc.text(note.title, 10, 10);
    doc.text(note.content, 10, 20);
    if (note.imageUrl) {
      doc.addImage(note.imageUrl, 'JPEG', 10, 30, 180, 160);
    }
    doc.save(`${note.title}.pdf`);
  }

  printNote(note: Note): void {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + note.title + '</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>' + note.title + '</h1>');
      printWindow.document.write('<pre>' + note.content + '</pre>');
      if (note.imageUrl) {
        printWindow.document.write('<img src="' + note.imageUrl + '" style="width:100%;height:auto;"/>');
      }
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }
}
