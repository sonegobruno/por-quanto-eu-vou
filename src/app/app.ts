import { Component, signal } from '@angular/core';

@Component({
  selector: 'pqev-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('por-quanto-eu-vou');
}
