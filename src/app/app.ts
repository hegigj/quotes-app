import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  standalone: true
})
export class App {}
