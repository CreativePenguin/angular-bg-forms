import { SpellResponse, SpellResponseResults } from "../app/spell";

const mockSpellResult0: SpellResponseResults = {
    index: '0',
    name: 'cantrip',
    level: 0,
    url: '/api/spells/cantrip'
}

const mockSpellResult1: SpellResponseResults = {
    index: '1',
    name: 'level 1',
    level: 1,
    url: '/api/spells/level-1'
}

const mockSpellResponse: SpellResponse = {
    count: 1,
    results: [mockSpellResult0, mockSpellResult1]
}

export {mockSpellResponse}
