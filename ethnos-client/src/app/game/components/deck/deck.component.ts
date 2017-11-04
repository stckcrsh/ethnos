import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  public card = {
    name: 'DRAW - 0',
    type: '7'
  };

  @Input() public set size(value: number) {
    this.card = { ...this.card, name: 'DRAW - ' + value };
  };

  @Output() public draw: EventEmitter<any> = new EventEmitter<any>();



  constructor() { }

  ngOnInit() { }

  public drawCard() {
    this.draw.next();
  }
}
