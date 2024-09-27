import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkillCheckComponent } from "./skill-check/skill-check.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { OverlayComponent } from './overlay/overlay.component';
import { AttackRollsComponent } from './attack-rolls/attack-rolls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SkillCheckComponent, NavbarComponent, OverlayComponent, AttackRollsComponent],
  // template: ``,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-bg3-cheats';
}
