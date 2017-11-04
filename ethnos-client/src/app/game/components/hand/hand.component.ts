import { ConnectableObservable } from 'rxjs/Rx';
import { Component, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/merge';

import normalize, { Normalized } from "../../../../helpers/normalize";
import { Abilities } from '../../models/abilities.model';
import { Card } from '../../models/card.model';
import { CardSet } from '../../models/cardset.model';

interface CardPlus extends Card {
	__selected: boolean;
	// __selectable: boolean;
}

const selectable = card =>
	R.either(
		R.compose(R.all(R.equals(card.type)), R.pluck('type')),
		R.compose(R.all(R.equals(card.name)), R.pluck('name'))
	);

const cardNormalizer = normalize < Card > ('id');
const listEntites = (ids, entities) => R.map((id) => R.prop(id, entities), ids)

const removeCardById = (id) => (cards) => R.remove(R.indexOf(id, cards), 1, cards)

@Component({
	selector: 'app-hand',
	// templateUrl: './hand.component.html',
	template: `
  <button (click)="play()" >PLAY SET</button>
  <ng-template ngFor let-card [ngForOf]="activeCards$ | async" [ngForTrackBy]="trackByFn">
    <span class="hand__item">
      <app-card [card]="card" (click)="cardClick(card)" [active]="card.__selected"></app-card>
      <input *ngIf="card.__selected" class="hand__leader" type="radio" name="leader" [formControl]="leader" [value]="card.id" />
    </span>
  </ng-template>
  <button (click)="clear()">CLEAR</button>
  `,
	styleUrls: ['./hand.component.scss'],
	host: {
		'[class]': '"hand"'
  },
  encapsulation: ViewEncapsulation.None
})
export class HandComponent {
	@ViewChild('playButton') public playButton;
	@ViewChild('clearButton') public clearButton;

	public leader: FormControl = new FormControl();

	public cardsClicked$: Subject < Card > = new Subject < Card > ();
	public selected$: Observable < string[] > ;
	public cards$: ReplaySubject < Normalized < Card >> = new ReplaySubject < Normalized < Card > > ();
	public activeCards$: Observable < CardPlus[] > ;

	public cleared$: Subject < void > = new Subject < void > ();
	public played$: Subject < void > = new Subject < void > ();

	@Input()
	public set cards(cards: Card[]) {
		this.cards$.next(cardNormalizer(cards));
		this.cleared$.next();
	}

	@Output() public playSet$: Observable < CardSet > ;

	constructor() {

		this.selected$ = this.cardsClicked$
			.scan < Card, string[] > ((acc, card) => R.contains(card.id, acc) ? removeCardById(card.id)(acc) : [...acc, card.id], [])
			.startWith([])
			.takeUntil(this.cleared$)
			.repeat();

		this.activeCards$ = combineLatest(this.selected$.startWith([]), this.cards$)
			.map < [string[], Normalized < Card > ], CardPlus[] > (([selected, cards]: [string[], Normalized < Card > ]) => {
				const entities = R.reduce((acc, item) => R.assocPath([item, '__selected'], true, acc), cards.entities, selected);
				return listEntites(cards.ids, entities);
			});

		this.playSet$ = this.played$
			.withLatestFrom(combineLatest(this.selected$, this.leader.valueChanges))
			// filter out if there are no cards selected or if the leader is not a selected card
			.filter(([_, [cards, leader]]) => !R.isEmpty(cards) && R.contains(leader, cards))
			.map(([_, [cards, leader]]) => ({ leader: leader, cards: cards }));

		this.playSet$.subscribe(res => console.log(res))

	}

	public cardClick(card: Card) {
		this.cardsClicked$.next(card);
	}

	public clear() {
		this.cleared$.next();
	}

	public play() {
		this.played$.next();
	}

	public trackByFn(card: CardPlus) {
		return card.id;
	}

}
