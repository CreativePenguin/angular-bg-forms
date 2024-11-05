import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpellsService } from '../spells.service';
import { filter, forkJoin, map, merge, Observable, of, startWith, switchMap, toArray } from 'rxjs';
import { Spell, SpellGroup, SpellGroupIResponse, SpellResponse, SpellResponseResults } from '../spell';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DropdownSearchComponent } from "../dropdown-search/dropdown-search.component";
import { DropdownGroup, DropdownItem } from '../dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-attack-rolls',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, ReactiveFormsModule,
    MatSelectModule, MatAutocompleteModule,
    DropdownSearchComponent
],
  templateUrl: './attack-rolls.component.html',
  styleUrl: './attack-rolls.component.scss'
})
export class AttackRollsComponent implements OnInit{
  spellsService: SpellsService = inject(SpellsService);
  rawSpellList$!: Observable<SpellResponse>;
  attackRollsForm = new FormGroup({
    spell: new FormControl<string | Spell>(''),
    spellLevel: new FormControl(1),
    testAutocomplete: new FormControl<string | Spell>(''),
    hardCodedAutocomplete: new FormControl('')
  });
  currentSpellRange: number[] = new Array(6);
  spellsOfEachLevel$: {[ spellLevel: string]: Observable<SpellResponse>} = {};
  filteredSpellsOfEachLevel!: Observable<{[ spellLevel: string]: Observable<SpellResponse>}>;
  // filteredGroupedSpellList!: Observable<SpellGroupIResponse[]>;
  filteredGroupSpellList!: Observable<SpellResponseResults[][]>;
  groupedSpellList!: Observable<SpellGroupIResponse[]>;
  // spellsOfEachLevel$!: Map<string,Observable<SpellResponse>>;
  fakeSpellsOfEachLevel: SpellResponseResults[][] = [
    [
      {
        "index": "alarm",
        "name": "Alarm",
        "level": 1,
        "url": "/api/spells/alarm"
      },
      {
        "index": "animal-friendship",
        "name": "Animal Friendship",
        "level": 1,
        "url": "/api/spells/animal-friendship"
      }
    ],
    [
      {
        "index": "bane",
        "name": "Bane",
        "level": 1,
        "url": "/api/spells/bane"
      },
    ],
    [
      {
        "index": "bless",
        "name": "Bless",
        "level": 1,
        "url": "/api/spells/bless"
      },
      {
        "index": "burning-hands",
        "name": "Burning Hands",
        "level": 1,
        "url": "/api/spells/burning-hands"
      }
    ]
  ];
  // fakeSpellsOfEachLevel: {[spellLevel: string]: SpellResponse} = {
  //   'level 0': {
  //     count: 2,
  //     results: [
  //       {
  //         "index": "alarm",
  //         "name": "Alarm",
  //         "level": 1,
  //         "url": "/api/spells/alarm"
  //       },
  //       {
  //         "index": "animal-friendship",
  //         "name": "Animal Friendship",
  //         "level": 1,
  //         "url": "/api/spells/animal-friendship"
  //       }
  //     ]
  //   },
  //   'level 1': {
  //     count: 1,
  //     results: [
  //       {
  //         "index": "bane",
  //         "name": "Bane",
  //         "level": 1,
  //         "url": "/api/spells/bane"
  //       },
  //     ]
  //   },
  //   'level 2': {
  //     count: 2,
  //     results: [
  //       {
  //         "index": "bless",
  //         "name": "Bless",
  //         "level": 1,
  //         "url": "/api/spells/bless"
  //       },
  //       {
  //         "index": "burning-hands",
  //         "name": "Burning Hands",
  //         "level": 1,
  //         "url": "/api/spells/burning-hands"
  //       }
  //     ]
  //   },
  // }
  demoDropdownList: DropdownGroup[] = [
    {
      groupName: 'Grass',
      group: [
        {label: 'Bulbasaur', value: 'bulbasaur'},
        {label: 'Ivysaur', value: 'ivysaur'},
        {label: 'Venusaur', value: 'venusaur'}
      ]
    },
    {
      groupName: 'Fire',
      group: [
        {label: 'Bulbasaur', value: 'bulbasaur'},
        {label: 'Ivysaur', value: 'ivysaur'},
        {label: 'Venusaur', value: 'venusaur'}
      ]
    },
    {
      groupName: 'Water',
      group: [
        {label: 'Squirtle', value: 'squirtle'},
        {label: 'Wartortle', value: 'wartortle'},
        {label: 'Blastoise', value: 'blastoise'},
      ]
    }
  ];
  // demoOptions!: Observable<DropdownGroup[]>;
  // demoOptions!: Observable<{[spellLevel: string]: SpellResponse}>;
  demoOptions!: Observable<SpellResponseResults[][]>;

  /**
   * initialize spellsOfEachLevel variable
   */
  getSpellList() {
    for(let i = 0; i <= 6; i++) {
      this.spellsOfEachLevel$[`level ${i}`] = this.spellsService.getAllSpellsOfLevel(i);
    }
  }

  /**
   * initialize obvervable for value of level dropdown -- set based on the
   * spell chosen from dropdown
   */
  addObservableToLevelDropdown() {
    this.attackRollsForm.get('spell')!.valueChanges.subscribe(
      (selectedValue) => {
        console.log('found change to spell', selectedValue);
        const selectedValueAsString = typeof selectedValue === 'string' ? '' : selectedValue?.url;
        this.spellsService.getSpell(selectedValueAsString || '').subscribe(
          (spell) => {
            if(spell.level == 0) this.currentSpellRange = [0];
            else this.currentSpellRange = [...Array(7).keys()].slice(spell.level);
          }
        )
      }
    )
  }

  /**
   * Maps the form spell control to the filtering function
   * @returns Observable that sends changes whenever there is a change on the frontend
   */
  filterSpellAutocomplete(): Observable<{[level: string]: Observable<SpellResponse>}> {
    return this.attackRollsForm.get('spell')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const valueAsString = typeof value === 'string' ? value : value?.name;
        return this._filterSpellAutocomplete(valueAsString || '')
      })
    )
  }

  /**
   * This function gets the frontend input of the current spell that they're
   * searching, and uses that to filter the spell list.
   * @param input string value is the frontend input for the autocomplete
   * @returns filtered spell -- each spell level now only shows spell names
   * will text included in the user input
   */
  _filterSpellAutocomplete(input: string): {[level: string]: Observable<SpellResponse>} {
    input = input.toLowerCase();
    console.log('_filterSpellAutocomplete called', input);
    let filteredSpellResponseObservable: {[level: string]: Observable<SpellResponse>} = {}
    for(let spellLevel in this.spellsOfEachLevel$) {
      filteredSpellResponseObservable[`${spellLevel}`] = this.spellsOfEachLevel$[spellLevel].pipe(
        map(
          spellResponse => {
            let filteredSpellList = spellResponse.results.filter(
              (spell) => spell.name.toLowerCase().includes(input)
            );
            return {count: filteredSpellList.length, results: filteredSpellList};
          }
        )
      )
    }
    return filteredSpellResponseObservable;
  }

  /**
   * Converts the SpellResponseResults type that the autocomplete values
   * are stored as into the spell names that they show up as
   * @param selectedValue current selected spell value
   * @returns spell name or empty string
   */
  displaySpellAutocompleteValue(selectedValue: SpellResponseResults): string {
    return selectedValue && selectedValue.name ? selectedValue.name : '';
  }

  setGroupedSpellList() {
    let spellsGroups: Observable<SpellResponseResults[]>[] = [];
    for(let i = 0; i <= 6; i++) {
      spellsGroups.push(this.spellsService.getAllSpellsOfLevel(i).pipe(
        map((response) => response.results)
      ))
    }
    this.filteredGroupSpellList = this.attackRollsForm.get('spell')!.valueChanges.pipe(
      startWith(''),
      switchMap(spellSearchInput => {
        let spellString = typeof spellSearchInput === 'string' ? spellSearchInput : spellSearchInput?.name;
        // let spellString = spellSearchInput;
        spellString = spellString?.toLowerCase() || '';
        return forkJoin(spellsGroups).pipe(
          map(spellGroup => 
            spellGroup.map(spellList => 
              spellList.filter(spell =>
                spell.name.toLowerCase().startsWith(spellString || '')
              )
            )
          )
        )
      })
    )
  }

  constructor() { }

  ngOnInit(): void {
    this.rawSpellList$ = this.spellsService.getAllSpells();
    this.getSpellList();
    this.addObservableToLevelDropdown();
    this.filteredSpellsOfEachLevel = this.filterSpellAutocomplete();
    // this.filteredSpellsOfEachLevel.subscribe(
    //   (value) => console.log('filtered spell list', value)
    // )
    this.spellsService.getAllSpellsOfLevel(1).subscribe(
      (spell) => {
        for(let i = 0; i < 14; i++) {
          console.log('this the spell used', spell.results[i])
        }
      }
    )
    this.demoOptions = this.attackRollsForm.get('hardCodedAutocomplete')!.valueChanges.pipe(
      startWith(''),
      map((fakeSpellInput) => {
        let spellInput: string = fakeSpellInput?.toLowerCase() ?? ''
        return this.fakeSpellsOfEachLevel.map(spellGroup =>
          spellGroup.filter(spell => spell.name.toLowerCase().startsWith(spellInput)))
        }
      )
    )
    this.setGroupedSpellList();
    this.attackRollsForm.valueChanges.subscribe(value => console.log(value));
    // this.demoOptions = this.attackRollsForm.get('testAutocomplete')!.valueChanges.pipe(
    //   startWith(''),
    //   map((pokemon) =>
    //     this.demoDropdownList.map((typeGroup) => 
    //       (
    //         {
    //           groupName: typeGroup.groupName,
    //           group: typeGroup.group.filter((value) => value.label.startsWith(pokemon ?? ''))
    //         }
    //       )
    //   )
    //   )
    // );
  }

}
