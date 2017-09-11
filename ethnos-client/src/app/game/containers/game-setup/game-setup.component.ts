import { Player } from "../../models/player.model";
import { GameSetupAction } from "../../actions/game.actions";
import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as shortid from "shortid";
import { Router } from "@angular/router";

const players: Player[] = [
  {
    name: "Rob",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Jon",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Bran",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Rickon",
    hand: [],
    sets: [],
    id: shortid()
  },
  {
    name: "Arya",
    hand: [],
    sets: [],
    id: shortid()
  }
];
const initialCards = 6;
const cards = [
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Elf",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Minotaur",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Skeleton",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Halfling",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Wizard",
    type: idx % 6
  })),
  ...Array.apply(null, Array(initialCards)).map((_, idx) => ({
    id: shortid(),
    name: "Goblin",
    type: idx % 6
  }))
];

const dragons = [1, 2, 3].map(() => ({
  id: shortid(),
  name: "Dragon",
  type: "6"
}));

@Component({
  selector: "app-game-setup",
  templateUrl: "./game-setup.component.html",
  styleUrls: ["./game-setup.component.css"]
})
export class GameSetupComponent implements OnInit {
  public setupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store$: Store<any>,
    private router: Router
  ) {
    this.setupForm = this.fb.group({
      name: ""
    });
  }

  ngOnInit() {}

  public onSubmit() {
    console.log(this.setupForm.value);
  }

  public setup() {
    // this.store$.dispatch(
      // new GameSetupAction(players, players[0].id, cards, dragons)
    // );
    this.router.navigate(["game"]);
  }
}
