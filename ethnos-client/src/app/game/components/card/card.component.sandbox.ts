import { sandboxOf } from 'angular-playground';
import { CardComponent } from './card.component';
import { Card } from '../../models/card.model';
const card: Card = {
	name: 'Minotaur',
	type: '0',
	id: 'someid'
}

export default sandboxOf(CardComponent)
	.add('basic card - type 0', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card }
	}).add('basic card - type 1', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '1' } }
	}).add('basic card - type 2', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '2' } }
	}).add('basic card - type 3', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '3' } }
	}).add('basic card - type 4', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '4' } }
	}).add('basic card - type 5', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '5' } }
	}).add('basic card - type dragon', {
		template: `<app-card [card]="card"></app-card>`,
		context: { card: { ...card, type: '6' } }
	}).add('active', {
		template: `<app-card [card]="card" [active]="true"></app-card>`,
		context: { card }
	}).add('disabled', {
		template: `<app-card [card]="card" [disabled]="true"></app-card>`,
		context: { card }
	});
