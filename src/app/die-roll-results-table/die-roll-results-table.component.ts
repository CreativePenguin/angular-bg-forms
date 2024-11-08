import { Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DiceResults } from '../diceset';
import { CommonModule } from '@angular/common';
import { DiceCalculationsService } from '../dice-calculations.service';

@Component({
  selector: 'app-die-roll-results-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './die-roll-results-table.component.html',
  styleUrl: './die-roll-results-table.component.scss'
})
export class DieRollResultsTableComponent {
  diceCalculations = inject(DiceCalculationsService);
  @Input() diceResults: DiceResults[] = this.diceCalculations.defaultD20RollResults();
  // displayedColumns = [
  //   'roll-result', 'num-result', 'percentage-result', 'percentage-block'
  // ];
  displayedColumns = [
    'roll-result', 'num-result', 'percentage-cum-result', 'percentage-result'
  ];
}
