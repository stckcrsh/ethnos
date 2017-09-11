import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-draw",
  templateUrl: "./draw.component.html",
  styleUrls: ["./draw.component.css"]
})
export class DrawComponent implements OnInit {
  @Input() public cards;
  @Output() public draw: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  public drawCard(card) {
    this.draw.next(card);
  }
}
