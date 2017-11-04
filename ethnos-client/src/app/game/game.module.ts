import { GameEffects } from './effects/game.effects';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers/reducers';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { PlayerStateComponent } from './components/player-state/player-state.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameSetupComponent } from './containers/game-setup/game-setup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayerCreateFormComponent } from './components/player-create-form/player-create-form.component';
import { GameComponent } from './containers/game/game.component';
import { BoardComponent } from './components/board/board.component';
import { CardComponent } from './components/card/card.component';
import { DeckComponent } from './components/deck/deck.component';
import { DrawComponent } from './components/draw/draw.component';
import { HandComponent } from './components/hand/hand.component';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'gamesetup', component: GameSetupComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature([GameEffects])
  ],
  declarations: [
    PlayerStateComponent,
    GameSetupComponent,
    PlayerCreateFormComponent,
    GameComponent,
    BoardComponent,
    CardComponent,
    DeckComponent,
    DrawComponent,
    HandComponent
  ]
})
export class GameModule {}
