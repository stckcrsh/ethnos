import { Card } from "./cards.reducer";
import { DrawDrawAction } from "./draw-pile.reducer";
import { DeckDrawAction, getTopCard } from "./deck.reducer";
import { shuffle } from "./helpers";
import {
  DragonDrawnAction,
  GameSetupAction,
  NextPlayerAction,
  RoundSetup
} from "./game.reducer";
import { Player, PlaySetAction } from "./player.reducer";
import * as fromReducer from "./reducers";
import * as shortid from "shortid";
import * as inquirer from "inquirer";
import * as R from 'ramda';

declare var Promise: any;

const reducer = (state, action) => {

  const playersLens = R.lensProp("players");
  const newState = fromReducer.reducer(state, action)
  console.log(`Players: ${JSON.stringify(playersLens(newState), null, '  ')}`)
  return newState;
};

function gameSetup(state) {
  function setupDeck() {
    const initialCards = 2;
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

    return cards;
  }
  // This will prompt the user to add players till they are done or 6 players
  const getPlayers = (): Promise<Player[]> => {
    const getPlayerInfo = (): Promise<Player> =>
      inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "Name?",
            default: "Marty McFly"
          }
        ])
        .then(user => ({ ...user, id: shortid(), hand: [], sets: [] }));

    const getPlayersR = (players: Player[]): Promise<Player[]> =>
      players.length < 6
        ? inquirer
            .prompt([
              {
                type: "confirm",
                name: "again",
                message: "Add another player (hit enter for Yes)?",
                default: true
              }
            ])
            .then(
              ({ again }) =>
                again
                  ? getPlayerInfo().then((player: Player) =>
                      getPlayersR([...players, player])
                    )
                  : players
            )
        : players;

    return getPlayerInfo().then(player => getPlayersR([player]));
  };
  const dragons = [1, 2, 3].map(() => ({
    id: shortid(),
    name: "Dragon",
    type: "6"
  }));
  return getPlayers()
    .then(
      players =>
        new GameSetupAction(players, players[0].id, setupDeck(), dragons)
    )
    .then(action => reducer(state, action));
}

function game() {
  Promise.resolve(reducer(undefined, { type: "" }))
    .then(gameSetup)
    .then(roundSetup)
    .then(playerTurns)
    .then(state => console.log(JSON.stringify(state, null, "  ")));
}

function playerTurns(_state) {
  function playerTurn(state) {
    const playerIds = fromReducer.getPlayerIds(state);
    const currentPlayer = fromReducer.getCurrentPlayer(state);
    return inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: `${currentPlayer.name}: choose an option?`,
          choices: [
            {
              name: "draw",
              value: playerDraw,
              disabled: state.deck.length === 0 && state.draw.length === 0
            },
            {
              name: "play",
              value: playerSet,
              disabled:
                currentPlayer.hand.length > 0
                  ? false
                  : "No cards to play (try drawing)"
            }
          ]
        }
      ])
      .then(({ option }) => option(state))
      .then(
        newState =>
          newState.game === "round_over"
            ? newState
            : playerTurn(
                reducer(
                  newState,
                  new NextPlayerAction(
                    playerIds[
                      (playerIds.indexOf(currentPlayer.id) + 1) %
                        playerIds.length
                    ]
                  )
                )
              )
      );
  }

  return playerTurn(_state);
}

function playerDraw(state) {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "Deck or draw-pile?",
        choices: [
          {
            name: "deck:" + ` ( ${state.deck.length} cards left )`,
            value: playerDeckDraw,
            disabled: state.deck.length > 0 ? false : "No Cards in Deck"
          },
          {
            name: "draw-pile",
            value: playerDrawDraw,
            disabled: state.draw.length > 0 ? false : "No Cards in Draw Pile"
          }
        ]
      }
    ])
    .then(({ option }) => option(state));
}

function playerDeckDraw(state) {
  if (state.deck.length === 0) return state;
  const cardEntities = fromReducer.getCardEntities(state);
  const topCard = cardEntities[fromReducer.getTopCard(state)];
  const currentPlayerId = fromReducer.getCurrentPlayerId(state);
  const action = new DeckDrawAction(topCard.id, currentPlayerId);

  const newState = reducer(state, action);
  if (topCard.type === "6") {
    return playerDeckDraw(
      reducer(newState, new DragonDrawnAction(currentPlayerId, topCard.id))
    );
  } else {
    return newState;
  }
}

function playerDrawDraw(state) {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "choose a freaking card",
        name: "cardId",
        choices: state.draw.map(id => {
          const card = state.cards.entities[id];

          return {
            name: `${card.name} - ${card.type}`,
            value: id
          };
        })
      }
    ])
    .then(({ cardId }) =>
      reducer(
        state,
        new DrawDrawAction(cardId, fromReducer.getCurrentPlayer(state).id)
      )
    );
}

function playerSet(state) {
  const currentPlayer = fromReducer.getCurrentPlayer(state);
  const cardEntities = fromReducer.getCardEntities(state);

  return inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Choose which cards to play?",
        name: "cards",
        choices: currentPlayer.hand.map(id => ({
          name: `${cardEntities[id].name} - ${cardEntities[id].type}`,
          value: id
        })),

        validate: function(answer) {
          if (answer.length < 1) {
            return "You must choose at least one card to play.";
          }
          return true;
        }
      }
    ])
    .then(({ cards }) => {
      return inquirer
        .prompt([
          {
            type: "list",
            name: "leader",
            message: "Choose your leader?",
            choices: cards.map(id => ({
              name: `${cardEntities[id].name} - ${cardEntities[id].type}`,
              value: id
            }))
          }
        ])
        .then(
          ({ leader }) =>
            new PlaySetAction(
              currentPlayer.id,
              { leader, cards },
              currentPlayer.hand.filter(id => cards.indexOf(id) === -1),
              cardEntities[leader].type
            )
        );
    });
}

function roundSetup(state) {
  const dragons = fromReducer.getAllDragonIds(state);
  const newDeck = shuffle(fromReducer.getAllCardIds(state));

  // take 2 cards per player for the draw pile
  let drawIdx = fromReducer.getAllPlayers(state).length * 2;

  // shuffle in the dragons
  const action = new RoundSetup(
    shuffle(newDeck.slice(drawIdx).concat(dragons)),
    newDeck.slice(0, drawIdx)
  );
  return Promise.resolve(reducer(state, action));
}

game();
