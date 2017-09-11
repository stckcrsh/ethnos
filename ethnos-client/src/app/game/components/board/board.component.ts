import { Space } from '../../models/space.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @Input() public spaces: Space[];
  constructor() { }

  ngOnInit() {
  }

}
