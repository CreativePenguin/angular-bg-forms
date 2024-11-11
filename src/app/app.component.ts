import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { SkillCheckComponent } from "./skill-check/skill-check.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { OverlayComponent } from './overlay/overlay.component';
import { AttackRollsComponent } from './attack-rolls/attack-rolls.component';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/**
 * Home page component -- holds side navbar with links to components of other pages, and organizes router-outlet where the other components are shown
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, NavbarComponent, CommonModule, RouterLink, RouterLinkActive,
    SkillCheckComponent, RouterModule, OverlayComponent, MatSidenavModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-bg3-cheats';
}
