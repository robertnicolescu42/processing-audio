import { Component } from '@angular/core';
import { VisualComponent } from './visual/visual.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [VisualComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
