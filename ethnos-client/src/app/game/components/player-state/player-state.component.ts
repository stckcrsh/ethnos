import { CardSet } from "../../models/cardset.model";
import { HandComponent } from "../hand/hand.component";
import { Observable } from "rxjs/Rx";
import { getCardEntities } from "../../reducers/reducers";
import { PlaySetAction } from "../../actions/player.actions";
import { Store } from "@ngrx/store";
import { Player } from "../../models/player.model";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/if";
import { empty } from "rxjs/observable/empty";

@Component({
  selector: "app-player-state",
  templateUrl: "./player-state.component.html",
  styleUrls: ["./player-state.component.css"]
})
export class PlayerStateComponent implements OnInit {
  public isCurrentPlayer$: Subject<boolean> = new Subject<boolean>();
  public playedSets$: Observable<CardSet>;

  @ViewChild(HandComponent) private hand: HandComponent;
  @Input() public player: any;

  @Input()
  public set isCurrentPlayer(value: boolean) {
    this.isCurrentPlayer$.next(value);
  }

  constructor(private store$: Store<any>) {
    this.isCurrentPlayer$
      .switchMap(active =>
        Observable.if(() => active, this.hand.playSet, empty())
      )
      .withLatestFrom(this.store$.select(getCardEntities))
      .subscribe(([set, cards]: [CardSet, any]) =>
        this.store$.dispatch(
          new PlaySetAction(
            this.player.id,
            set,
            this.player.hand
              .filter(card => set.cards.indexOf(card.id) === -1)
              .map(card => card.id),
            cards[set.leader].type
          )
        )
      );
  }

  ngOnInit() {}

  public logSet(set) {
    // this.store$
    //   .select(getCardEntities)
    //   .take(1)
    //   .subscribe(cards =>
    //     this.store$.dispatch(
    //       new PlaySetAction(
    //         this.player.id,
    //         set,
    //         this.player.hand
    //           .filter(card => set.cards.indexOf(card.id) === -1)
    //           .map(card => card.id),
    //         cards[set.leader].type
    //       )
    //     )
    //   );
  }
}
