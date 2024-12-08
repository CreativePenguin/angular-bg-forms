import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpellI, SpellResponse, Spell } from './spell';
import { map, Observable } from 'rxjs';

/**
 * This service is for http calls to get a list of all the dnd spells
 * 
 * api used: https://www.dnd5eapi.co/api
 * api used to test: https://jsonplaceholder.typicode.com/
 * 
 * Main functions: getAllSpellsOfLevel, getAllSpells, getSpell
 */
@Injectable({
  providedIn: 'root'
})
export class SpellsService {

  http!: HttpClient;
  url = new URL('https://www.dnd5eapi.co/api');
  protected spellsList: SpellI[] = [];

  /**
   * Makes call to dnd5eapi to get spell list
   * @returns Observable that when subscribed to will get all the spells in dnd up to 6th level
   * The return value is a SpellResponse type which contains a list of the spells in SpellResponse.results
   */
  getAllSpells(): Observable<SpellResponse> {
    return this.http.get<SpellResponse>(
      `${this.url.href}/spells?level=0&level=1&level=2&level=3&level=4&level=5&level=6`,
      );
  }

  /**
   * 
   * @param level spell level to filter spells
   * @returns Observable that when subscribed to will get a list of all spells of said level
   */
  getAllSpellsOfLevel(level: number): Observable<SpellResponse> {
    return this.http.get<SpellResponse>(
      `${this.url.href}/spells?level=${level}`,
      );
  }

  /**
   * This function creates a SpellI by making an API request given a specific url.
   * DnD API returns a specific url with each spell name when searching all spells that contains additional information about the spell.
   * This function makes a separate API call using that new url, and attempts to create a SpellI data type using the info from the API request
   * @param url url from SpellResponseResults type
   * @param modifier In order to properly set spell damage, the spell modifier needs to be set based on what the user had inputted
   * @returns Observable that when subscribed to will give a Spell data type that holds all necessary information about the spell
   */
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
        if(spellLevel == 0) {
          spell.setDamageFromAPI(
            {'0': response['damage']['damage_at_character_level']['1']},
            modifier
          )
        } else {
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
        }
        return spell;
    }));
  }

  /**
   * 
   * @param http injection
   */
  constructor(http: HttpClient) { 
    this.http = http;
  }
}
