# AngularBg3Cheats

This webpage is designed to show all possible values that could result in rolling certain amounts of dice.
This makes it easier to determine what the likelihood of each decision would be when playing dnd,
and properly understand how likely an action is to suceed when you try it in dnd.

## Technologies Used

Angular is used to build website. API calls are made to <https://www.dnd5eapi.co/> to get the list of all spells in dnd.
TailwindCSS and Material are used for styling components, and organizing the layout.
Documentation is built with compodoc, and deployed to github pages using github actions.
Deployment is handled by firebase.

## Pages

### Services

- dice-calculations.service.ts -- This holds all the functions used in dice calculations
- spells.service.ts -- This holds all the functions used to access DnD API to get spell information

### Data Types

- spell.ts -- This holds all the data types used to organize data gotten from API
- diceset.ts -- This holds all the data types used to organize data related to dice rolls
  - Check skillCheckCalc function on diceset details main algorithm used to calculate dice rolls

### Components

- skill-check.component.ts -- Skill Check Link.
It contains frontend for calculating likelihood of skill check suceeeding.
- attack-rolls.component.ts -- Attack Rolls Link.
It contains frontend for calculating spell damage and likelihood.
- stepper.component.ts -- Modified form input (type="number", but with + and - buttons on the sides)
