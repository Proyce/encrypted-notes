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
import { SharedMarkdownModule } from './shared/markdown.module';

type SortableKeys = 'title' | 'createdAt' | 'updatedAt';

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
    SharedMarkdownModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  searchControl = new FormControl('');
  sortControl = new FormControl('title-asc');
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
      this.sortControl.valueChanges.pipe(startWith('title-asc')),
    ]).pipe(
      map(([notes, searchTerm, sortCriteria]) =>
        this.filterAndSortNotes(notes || [], searchTerm!, sortCriteria!)
      )
    );
  }

  filterAndSortNotes(
    notes: Note[],
    searchTerm: string,
    sortCriteria: string
  ): Note[] {
    let filteredNotes = notes;
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerCaseTerm) ||
          note.content.toLowerCase().includes(lowerCaseTerm)
      );
    }
    return this.sortNotes(filteredNotes, sortCriteria);
  }

  sortNotes(notes: Note[], criteria: string): Note[] {
    const [key, order] = criteria.split('-') as [SortableKeys, 'asc' | 'desc'];
    return notes.sort((a, b) => {
      let comparison: number;

      if (key === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        comparison = dateA.getTime() - dateB.getTime();
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  openAddNoteModal(): void {
    const modalRef = this.modalService.open(NoteModalComponent);
    modalRef.componentInstance.note = null;
    modalRef.componentInstance.mode = 'edit';
  }
}
