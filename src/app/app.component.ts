import { Component } from '@angular/core';
import { RouterLink,RouterModule, RouterOutlet } from '@angular/router';
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
    RouterOutlet, RouterLink,
    RouterModule, MatSidenavModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrl: '../styles.scss'
})
export class AppComponent {
  title = 'angular-bg3-cheats';
}
