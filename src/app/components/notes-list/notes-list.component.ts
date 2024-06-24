import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../interfaces/note';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { AsyncPipe, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  imports: [CommonModule, AsyncPipe, NgFor]
})
export class NotesListComponent {
  notes$: Observable<Note[]> = this.notesService.notes$;
  isViewMode: boolean = false;

  constructor(private notesService: NotesService, private modalService: NgbModal) {}

  deleteNote(noteId: string): void {
    this.notesService.deleteNote(noteId);
  }

  openNoteModal(note: Note | null, mode: 'edit' | 'view'): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = note ? { ...note } : null;
    modalRef.componentInstance.mode = mode;
    this.isViewMode = mode === 'view';
    modalRef.componentInstance.isViewMode = this.isViewMode;
  }

  truncateContent(content: string): string {
    const maxLines = 3;
    const lines = content.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '...';
    }
    return content;
  }
}
