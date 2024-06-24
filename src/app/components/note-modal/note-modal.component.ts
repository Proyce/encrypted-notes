import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Note, NoteVersion } from '../../interfaces/note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-modal.component.html',
  styleUrl: './note-modal.component.css'
})
export class NoteModalComponent {
  // @Input() note!: Note[];
  // @Input() mode: 'edit' | 'view' = 'edit';
  // @Input() isViewMode: boolean = false;
  // noteForm: FormGroup;

  // constructor(
  //   public activeModal: NgbActiveModal,
  //   private fb: FormBuilder,
  //   private notesService: NotesService
  // ) {
  //   this.noteForm = this.fb.group({
  //     title: ['', Validators.required],
  //     content: ['', Validators.required]
  //   });
  // }

  // ngOnInit(): void {
  //   if (this.note) {
  //     this.noteForm.patchValue(this.note);
  //   }
  //   if (this.isViewMode) {
  //     this.noteForm.disable();
  //   }
  // }

  // saveNote(): void {
  //   if (this.noteForm.valid) {
  //     const noteData = this.noteForm.value;
  //     if (this.note) {
  //       this.notesService.updateNote({ ...this.note, ...noteData });
  //     } else {
  //       this.notesService.addNote(noteData);
  //     }
  //     this.activeModal.close();
  //   }
  // }

  // close(): void {
  //   this.activeModal.dismiss();
  // }

  @Input() note: Note | null = null;
  @Input() mode: 'edit' | 'view' = 'view';
  noteForm!: FormGroup;
  isViewMode: boolean = true;
  versions: NoteVersion[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notesService: NotesService
  ) {}

  ngOnInit(): void {
    this.isViewMode = this.mode === 'view';
    this.noteForm = this.formBuilder.group({
      title: [{ value: this.note?.title || '', disabled: this.isViewMode }, Validators.required],
      content: [{ value: this.note?.content || '', disabled: this.isViewMode }, Validators.required],
    });

    if (this.note) {
      this.versions = this.notesService.getNoteVersions(this.note.id);
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }

  saveNote(): void {
    if (this.noteForm.valid) {
      const noteData = this.noteForm.value;
      if (this.note) {
        this.notesService.updateNote({ ...this.note, ...noteData });
      } else {
        this.notesService.addNote(noteData);
      }
      this.activeModal.close();
    }
  }
}
