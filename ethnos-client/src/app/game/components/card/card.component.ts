import { Card } from '../../models/card.model';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-card',
	// templateUrl: './card.component.html',
	template: `
    <h4 class="card__title">{{card.name}}</h4>
  `,
	styleUrls: ['./card.component.scss'],
	host: {
		'[class]': '"card card--"+card.type'
  },
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
	@Input() public card: Card;

  @HostBinding('class.card--active') @Input() public active: boolean = false;
  @HostBinding('class.card--disabled') @Input() public disabled: boolean = false;

	constructor() {}

	ngOnInit() {
	}
}
