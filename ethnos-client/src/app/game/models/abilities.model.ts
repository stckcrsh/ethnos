import { Card } from './card.model';
import * as R from 'ramda';

/**
 * Places that will need to be checked
 *
 * Band Size for scoring
 * Band Size for placing piece
 * Matching Sets
 * Choosing the place to put pieces
 * keeping cards in hand
 * drawing new cards
 * placing pieces on orc board
 * moving pieces on merfolk board
 * playing a second set
 * cant place a piece
 * breaking ties and collecting tokens
 * gaining points at play time and gaining points at round end
 */

export class AbilityHooks {

  /**
   * Determines the sets size for the purpose of scoring
   *
   * @param {Card[]} set
   * @returns
   * @memberof AbilityHooks
   */
  public setSizeForScoring(set: Card[]) {
    return set.length;
  }

  /**
   * Determines the sets size for the purpose of placing pieces
   *
   * @param {Card[]} set
   * @returns
   * @memberof AbilityHooks
   */
  public setSizeForPlacing(set: Card[]) {
    return set.length;
  }

  /**
   * Checks if a card can be used in a set
   *
   * @param {Card} this
   * @param {Card[]} set
   * @returns
   * @memberof AbilityHooks
   */
  public matchesSet(card: Card, set: Card[]) {
    return R.either(
      R.all((_card) => getAbilities(card.name).getType.call(card, _card) === getAbilities(_card.name).getType.call(_card, card)),
      R.all((_card) => getAbilities(card.name).getName.call(card, _card) === getAbilities(_card.name).getName.call(_card, card))
    )(set);
  }

  public getType(this: Card) {
    return (matcher: Card) => {
      return this.type;
    }
  }

  public getName(this: Card) {
    return (matcher: Card) => {
      return this.name;
    }
  }
}

class Skeleton extends AbilityHooks {
  public getType(this: Card) {
    return (matcher: Card) => {
      return matcher.type;
    }
  }

  public getName(this: Card) {
    return (matcher: Card) => {
      return matcher.name;
    }
  }
}

export const Abilities: { [type: string]: AbilityHooks } = {
  Skeleton: new Skeleton(),
  Elf: new AbilityHooks(),
  Minotaur: new AbilityHooks(),
  Halfling: new AbilityHooks(),
  Wizard: new AbilityHooks(),
  Goblin: new AbilityHooks(),
  default: new AbilityHooks()
}

export const getAbilities = (name: string) => Abilities[name || 'default'];
