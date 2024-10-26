import { Routes } from '@angular/router';
import { SkillCheckComponent } from './skill-check/skill-check.component';
import { AttackRollsComponent } from './attack-rolls/attack-rolls.component';

export const routes: Routes = [
    {path: '', component: SkillCheckComponent, title: 'Skill Check'},
    {path: 'attack-roll', component: AttackRollsComponent, title: 'Attack Rolls'}
];
