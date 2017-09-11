import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-deck",
  templateUrl: "./deck.component.html",
  styleUrls: ["./deck.component.css"]
})
export class DeckComponent implements OnInit {
  @Input() public size = 0;

  @Output() public draw: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  public drawCard() {
    this.draw.next();
  }
}
