import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../interfaces/note';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { AsyncPipe, NgFor, CommonModule } from '@angular/common';
import { SharedMarkdownModule } from '../../shared/markdown.module';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  imports: [CommonModule, AsyncPipe, NgFor, SharedMarkdownModule]
})
export class NotesListComponent {
  @Input() filteredNotes: Note[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private notesService: NotesService, private modalService: NgbModal) {}

  deleteNote(noteId: string): void {
    this.notesService.deleteNote(noteId);
  }

  openNoteModal(note: Note | null, mode: 'edit' | 'view'): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = note ? { ...note } : null;
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.isViewMode = mode === 'view';
  }

  truncateContent(content: string): string {
    const maxLines = 3;
    const lines = content.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '...';
    }
    return content;
  }

  importNotes(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.notesService.importNotes(file);
    }
  }

  exportNotes(): void {
    this.notesService.exportNotes();
  }
}
