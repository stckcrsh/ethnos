import { Player } from "../models/player.model";
import * as fromRoot from "./reducers";

const jon_snow: Player = {
  name: "Jon Snow",
  id: "77u34nncj",
  hand: [],
  sets: [{
    leader: 'sdcd',
    cards:['sdcdcwe']
  },{
    leader: 'sdcd',
    cards:['sdcdcwe',]
  }]
};

const arya_stark: Player = {
  name: "Arya Stark",
  id: "oid834-8d",
  hand: [],
  sets: [{
    leader: 'sdcd',
    cards:['sdcdcwe','dcsde', 'dc34fge5']
  },{
    leader: 'sdcd',
    cards:['sdcdcwe','dcsde']
  }]
};

const reek: Player = {
  name: "Reek",
  id: "iic8s=-ec3",
  hand: [],
  sets: [{
    leader: 'sdcd',
    cards:['sdcdcwe','dcsde', 'dc34fge5']
  },{
    leader: 'sdcd',
    cards:['sdcdcwe','dcsde', 'dc34fge5']
  },{
    leader: 'sdcd',
    cards:['sdcdcwe','dcsde', 'dc34fge5']
  }]
};

describe("Reducers Root", () => {
  fdescribe("Scoring Selector", () => {
    let state: fromRoot.GameState;

    beforeEach(() => {
      state = {
        game: {
          currentPlayer: null,
          scores: {},
          dragons: [],
          round: 2
        },
        deck: [],
        board: {
          "0": {
            type: "0",
            pieces: { [jon_snow.id]: 2, [arya_stark.id]: 1, [reek.id]: 1 },
            scores: [6, 8, 8]
          },
          "1": { type: "1", pieces: { [reek.id]: 1 }, scores: [0, 2, 4] },
          "2": {
            type: "2",
            pieces: { [arya_stark.id]: 3, [jon_snow.id]: 2, [reek.id]: 1 },
            scores: [2, 4, 8]
          },
          "3": {
            type: "3",
            pieces: { [jon_snow.id]: 2, [arya_stark.id]: 1 },
            scores: [0, 0, 4]
          },
          "4": { type: "4", pieces: { [reek.id]: 1 }, scores: [4, 8, 10] },
          "5": { type: "5", pieces: { [jon_snow.id]: 2 }, scores: [0, 0, 6] }
        },
        players: {
          entities: {
            [jon_snow.id]: { ...jon_snow },
            [arya_stark.id]: { ...arya_stark },
            [reek.id]: { ...reek }
          },
          ids: [jon_snow.id, arya_stark.id, reek.id]
        },
        draw: [],
        cards: {
          entities: {},
          ids: [],
          dragons: []
        }
      };
    });

    it("should score accurately", () => {
      const scores = fromRoot.getScores({ game: state });

      const expected = {
        // expected scores
        //      spaces   0   1   2   3   4   5 sets
        [jon_snow.id]:   8 + 0 + 4 + 4 + 0 + 6 + 0,
        [arya_stark.id]: 7 + 0 + 8 + 0 + 0 + 0 + 4,
        [reek.id]:       7 + 4 + 2 + 0 + 10 + 0 + 9
      };
      expect(scores).toEqual(expected);
    });

    it("should calculate scores correctly", () => {
      const newState = {
        deck: [],
        game: {
          currentPlayer: "SkeHOtjfO-",
          scores: {
            "S1S_KszO-": 4,
            "SkeHOtjfO-": 6,
            "SyWSOtoGOb": 0
          },
          dragons: [],
          round: 1
        },
        draw: [],
        players: {
          entities: {
            "S1S_KszO-": {
              name: "Rob",
              hand: ["ByGruYofdZ"],
              sets: [
                {
                  leader: "SJKHutsMOb",
                  cards: ["SJKHutsMOb", "rJDS_Yoz_b"]
                },
                {
                  leader: "SkoHutsG_Z",
                  cards: ["H1mS_tif_b", "SkoHutsG_Z", 'dcsd', 'scdcsdv', 'asdcdc', 'sdcsdc']
                }
              ],
              id: "S1S_KszO-"
            },
            "SkeHOtjfO-": {
              name: "Jon",
              hand: [],
              sets: [
                {
                  leader: "SyqrOFsfdZ",
                  cards: ["SyqrOFsfdZ"]
                },
                {
                  leader: "SkhSuFjMOW",
                  cards: ["SkhSuFjMOW", "H18B_Ksz_Z", 'asdcdc']
                }
              ],
              id: "SkeHOtjfO-"
            },
            SyWSOtoGOb: {
              name: "Bran",
              hand: [],
              sets: [
                {
                  leader: "ryES_YozO-",
                  cards: ["ryES_YozO-"]
                },
                {
                  leader: "r1pB_Yszdb",
                  cards: ["r1pB_Yszdb", "rJSSOYjzOW"]
                }
              ],
              id: "SyWSOtoGOb"
            }
          },
          ids: ["S1S_KszO-", "SkeHOtjfO-", "SyWSOtoGOb"]
        },
        cards: {
          entities:{
          },
          ids: [
          ],
          dragons: []
        },
        board: {
          "0": {
            type: "0",
            pieces: {
              "S1S_KszO-": 1,
              "SkeHOtjfO-": 2,
              SyWSOtoGOb: 1
            },
            scores: [2, 2, 10]
          },
          "1": {
            type: "1",
            pieces: {
              "SkeHOtjfO-": 1,
              SyWSOtoGOb: 2,
              "S1S_KszO-": 2
            },
            scores: [0, 4, 8]
          },
          "2": {
            type: "2",
            pieces: {},
            scores: [0, 4, 10]
          },
          "3": {
            type: "3",
            pieces: {},
            scores: [2, 6, 10]
          },
          "4": {
            type: "4",
            pieces: {},
            scores: [0, 6, 6]
          },
          "5": {
            type: "5",
            pieces: {},
            scores: [4, 8, 8]
          }
        }
      };

      expect(fromRoot.getScores({game:newState})).toEqual({
        // spaces     0   1 sets
        "S1S_KszO-":  1 + 2 + 16,
        "SkeHOtjfO-": 2 + 0 + 3,
        "SyWSOtoGOb": 1 + 2 + 1
      })
    });
  });
});
