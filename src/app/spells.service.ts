import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpellI, SpellResponse, Spell } from './spell';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpellsService {

  http!: HttpClient;
  url = new URL('https://www.dnd5eapi.co/api');
  protected spellsList: SpellI[] = [];

  getAllSpells(): Observable<SpellResponse> {
    return this.http.get<SpellResponse>(
      `${this.url.href}/spells?level=0&level=1&level=2&level=3&level=4&level=5&level=6`,
      );
  }

  getAllSpellsOfLevel(level: number): Observable<SpellResponse> {
    return this.http.get<SpellResponse>(
      `${this.url.href}/spells?level=${level}`,
      );
  }

  getSpell(url: string, modifier=0): Observable<SpellI> {
    return this.http.
      get<{[damage: string]: {[damage_at_slot: string]: 
          {[spell_level: string]: string}}}>(
        `${this.url.origin}${url}`
      ).pipe(map((response) => {
        console.log('pipe response', response)
        let spellName: string = response['name'] as unknown as string;
        let spellLevel: number = response['level'] as unknown as number;
        let spell = new Spell(spellName, url, spellLevel);
        try {
          spell.setDamageFromAPI(
            response['damage']['damage_at_slot_level'], 
            modifier
          );
        } catch(e) {
          spell.setDamageFromAPI(
            response['heal_at_slot_level'] as unknown as {[level: string]: string}, modifier
          )
        }
        return spell;
    }));
  }

  getAllSpellNames(): string[] {
    let spells: string[] = [];
    this.http.get(`${this.url.href}/spells`, {responseType: 'text'}).subscribe(
      response => {
        console.log(`spell names ${response}`);
        console.log(`spell one ${JSON.parse(response).count}`)
        spells = JSON.parse(response).results
          .filter((spell: {level: number; }) => spell.level <= 6)
          .map((spell: { name: any; }) => spell.name)
        console.log(spells);
      },
    );
    return spells;
  }

  constructor(http: HttpClient) { 
    this.http = http;
  }
}
