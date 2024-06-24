import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoteComponent } from './components/note/note.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NoteComponent, NotesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'notes-app';
}
