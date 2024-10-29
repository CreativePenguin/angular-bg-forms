import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DiceResults } from '../../diceset';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-die-roll-results-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './die-roll-results-table.component.html',
  styleUrl: './die-roll-results-table.component.scss'
})
export class DieRollResultsTableComponent {
  @Input() rollResults!: DiceResults[];
  displayedColumns = ['roll-result', 'num-result', 'percentage-result'];
}
