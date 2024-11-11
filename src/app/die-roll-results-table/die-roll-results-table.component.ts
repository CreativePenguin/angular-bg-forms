import { Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DiceResults } from '../diceset';
import { CommonModule } from '@angular/common';
import { DiceCalculationsService } from '../dice-calculations.service';

/**
 * This creates a table using Material UI that organizes information from dice-calculations.service.ts.
 * Each row of the table has the possible roll value from rolling the diceset,
 * the number of possible rolls that result in said roll value,
 * the percentage chance of rolling higher than that specific roll,
 * the percentage chance of rolling that specific roll,
 * and a bar that represents how rolling that specific roll visually looks.
 * This component appears on both skill-check and attack-rolls forms.
 */
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
