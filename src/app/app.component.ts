import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkillCheckComponent } from "./skill-check/skill-check.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SkillCheckComponent],
  // template: ``,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-bg3-cheats';
}
