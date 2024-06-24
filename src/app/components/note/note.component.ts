// import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { AsyncPipe, CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
// import { Observable } from 'rxjs';
// import { NotesService } from '../../services/notes.service';
// import { Note } from '../../interfaces/note';
// import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
// import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { CommonModule } from '@angular/common';
import { Note } from '../../interfaces/note';

@Component({
  selector: 'app-note',
  standalone: true,
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  imports: [CommonModule]
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
