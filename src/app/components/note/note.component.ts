import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { CommonModule } from '@angular/common';
import { Note } from '../../interfaces/note';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-note',
  standalone: true,
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  imports: [CommonModule, MarkdownModule]
})
export class NoteComponent {
  constructor(private modalService: NgbModal) {}

  openAddNoteModal(): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = null;
  }

  openEditNoteModal(note: Note): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = note;
  }
}
