import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExampleService } from './core/services/example.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ec_frontend');

  constructor(private exampleService: ExampleService) {
    // Example usage of the ExampleService
    this.exampleService.getAll().subscribe(examples => {
      console.log('Fetched examples:', examples);
    });
  }
}
