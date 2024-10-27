import { Routes } from '@angular/router';
import { SkillCheckComponent } from './skill-check/skill-check.component';
import { AttackRollsComponent } from './attack-rolls/attack-rolls.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {path: 'skill-check', component: SkillCheckComponent, title: 'Skill Check'},
    {path: 'attack-roll', component: AttackRollsComponent, title: 'Attack Rolls'},
    {path: '', redirectTo: '/skill-check', pathMatch: 'full'},
    {path: '**', component: NotFoundComponent},
];
