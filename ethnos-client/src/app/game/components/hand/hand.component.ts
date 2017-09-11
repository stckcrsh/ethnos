import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Card } from "../../models/card.model";
import { CardSet } from "../../models/cardset.model";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {
  default as normalize,
  Normalized
} from "../../../../helpers/normalize";
import * as R from "ramda";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/shareReplay";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/switchMap";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs/Subject";

interface CardPlus extends Card {
  __selected: boolean;
  __selectable: boolean;
}

const selectable = card =>
  R.either(
    R.compose(R.all(R.equals(card.type)), R.pluck("type")),
    R.compose(R.all(R.equals(card.name)), R.pluck("name"))
  );

@Component({
  selector: "app-hand",
  templateUrl: "./hand.component.html",
  styleUrls: ["./hand.component.css"]
})
export class HandComponent implements OnInit, OnDestroy {
  public leader: FormControl = new FormControl();

  @Input()
  public set cards(value: Card[]) {
    this.cards$.next(normalize<Card>("id")(value));
  }

  private selected$: Subject<CardPlus> = new Subject<CardPlus>();
  public cards$: ReplaySubject<Normalized<Card>> = new ReplaySubject<
    Normalized<Card>
  >();

  public selectedCards$: Observable<
    Normalized<CardPlus>
  > = this.cards$.switchMap(() => {
    return this.getSelectedCards();
  });
  public leader$: Observable<CardPlus>;
  public submit$: Subject<boolean> = new Subject<boolean>();

  @Output() public playSet: any;

  public viewSelected$: Observable<CardPlus[]>;
  constructor() {
    this.leader$ = this.leader.valueChanges.startWith(null);

    this.viewSelected$ = Observable.combineLatest(
      this.selectedCards$,
      this.cards$,
      (selected: any, cards) => {
        return [
          ...cards.ids.map(id => ({
            ...cards.entities[id],
            __selected: selected.entities[id] ? true : false,
            __selectable: selectable(cards.entities[id])(
              selected.ids.map(id => selected.entities[id])
            )
          }))
        ];
      }
    );

    this.playSet = this.submit$
      .withLatestFrom(this.getCardSet())
      .map(([_, set]) => set);
  }

  public submit() {
    this.submit$.next(true);
  }

  public getSelectedCards(): Observable<Normalized<CardPlus>> {
    return this.selected$
      .filter(card => card.__selectable)
      .scan<CardPlus>((acc, card) => {
        let newAcc;
        if (card.__selected) {
          return acc.filter(_card => _card.id !== card.id);
        } else {
          return acc.concat([card]);
        }
      }, [])
      .startWith([])
      .map(normalize<CardPlus>("id"))
      .do(() => this.leader.reset());
  }

  ngOnInit() {}

  public getCardSet() {
    return this.leader$
      .filter(leader => !!leader)
      .withLatestFrom(this.selectedCards$)
      .map(([leader, selected]) => ({
        leader: leader.id,
        cards: selected.ids
      }));
  }

  public cardClick(card) {
    this.selected$.next(card);
  }

  public ngOnDestroy() {
    console.log("Destroyed");
  }

  public isSelectable(card: CardPlus) {
    return this.selectedCards$.map(
      R.either(
        R.compose(R.all(R.equals(card.type)), R.pluck("type")),
        R.compose(R.all(R.equals(card.type)), R.pluck("name"))
      )
    );
  }
}
