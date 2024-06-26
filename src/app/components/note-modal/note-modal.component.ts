import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotesService } from '../../services/notes.service';
import { Note, NoteVersion } from '../../interfaces/note';
import { CommonModule } from '@angular/common';
import { SharedMarkdownModule } from '../../shared/markdown.module';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedMarkdownModule,
    FormsModule,
  ],
  templateUrl: './note-modal.component.html',
  styleUrl: './note-modal.component.css',
})
export class NoteModalComponent {
  @Input() note!: Note;
  @Input() mode: 'edit' | 'view' = 'view';
  @Input() isViewMode = true;
  noteForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  versions: NoteVersion[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private notesService: NotesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isViewMode = this.mode === 'view';
    this.noteForm = this.fb.group({
      title: [
        { value: this.note?.title, disabled: this.isViewMode },
        Validators.required,
      ],
      content: [
        { value: this.note?.content, disabled: this.isViewMode },
        Validators.required,
      ],
    });

    if (this.note && this.note.id) {
      this.versions = this.notesService.getNoteVersions(this.note.id);
    }

    if (this.note?.imageUrl) {
      this.imagePreview = this.note.imageUrl;
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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        if (this.note) {
          this.note.imageUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  exportNotes(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.notesService.exportNotes());
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'notes.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  importNotes(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const json = reader.result as string;
        this.notesService.importNotes(json);
        this.activeModal.close();
      };
      reader.readAsText(file);
    }
  }
}
