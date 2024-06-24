import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoteComponent } from './components/note/note.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Note } from './interfaces/note';
import { NotesService } from './services/notes.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NoteModalComponent } from './components/note-modal/note-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NoteComponent,
    NotesListComponent,
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    NoteModalComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  searchControl = new FormControl('');
  filteredNotes$!: Observable<Note[]>;

  constructor(
    private notesService: NotesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const notes$ = this.notesService.notes$;

    this.filteredNotes$ = combineLatest([
      notes$,
      this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([notes, searchTerm]) => this.filterNotes(notes || [], searchTerm!))
    );
  }

  filterNotes(notes: Note[], searchTerm: string): Note[] {
    if (!searchTerm) {
      return notes;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerCaseTerm) ||
        note.content.toLowerCase().includes(lowerCaseTerm)
    );
  }

  openAddNoteModal(): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = null;
    modalRef.componentInstance.mode = 'edit';
  }
}
