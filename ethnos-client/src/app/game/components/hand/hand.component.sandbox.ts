import { sandboxOf } from 'angular-playground';
import { CardComponent } from '../card/card.component';
import { Card } from '../../models/card.model';
import { HandComponent } from './hand.component';
import { ReactiveFormsModule } from '@angular/forms';

const card0: Card = {
	name: 'Minotaur',
	type: '0',
	id: 'someid'
}
const card1: Card = {
	name: 'Minotaur',
	type: '1',
	id: 'someid1'
}
const card2: Card = {
	name: 'Minotaur',
	type: '2',
	id: 'someid2'
}
const card3: Card = {
	name: 'Minotaur',
	type: '3',
	id: 'someid3'
}
const card4: Card = {
	name: 'Minotaur',
	type: '4',
	id: 'someid4'
}
const card5: Card = {
	name: 'Minotaur',
	type: '5',
	id: 'someid5'
}

const cards = [
	card0
]


export default sandboxOf(HandComponent, { declarations: [CardComponent], imports: [ReactiveFormsModule] })
	.add('hand - 1 card', {
		template: `<app-hand [cards]="cards"></app-hand>`,
		context: { cards }
	}).add('hand - 7 cards', {
		template: `<app-hand [cards]="cards"></app-hand>`,
		context: { cards: [card0, card1, card2, card3, card4, card5], emit: (event) => console.log(event) }
	});
