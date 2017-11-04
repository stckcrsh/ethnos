export function getSandboxMenuItems() {
return [{"key":"./app/game/components/card/card.component.sandbox","searchKey":"CardComponent","name":"CardComponent","label":"","scenarioMenuItems":[{"key":1,"description":"basic card - type 0"},{"key":2,"description":"basic card - type 1"},{"key":3,"description":"basic card - type 2"},{"key":4,"description":"basic card - type 3"},{"key":5,"description":"basic card - type 4"},{"key":6,"description":"basic card - type 5"},{"key":7,"description":"basic card - type dragon"},{"key":8,"description":"active"},{"key":9,"description":"disabled"}]},{"key":"./app/game/components/hand/hand.component.sandbox","searchKey":"HandComponent","name":"HandComponent","label":"","scenarioMenuItems":[{"key":1,"description":"hand - 1 card"},{"key":2,"description":"hand - 7 cards"}]}];
}
export function getSandbox(path: string) {
switch(path) {
case './app/game/components/card/card.component.sandbox':
return import('./app/game/components/card/card.component.sandbox').then(sandbox => { return sandbox.default.serialize('./app/game/components/card/card.component.sandbox'); });
case './app/game/components/hand/hand.component.sandbox':
return import('./app/game/components/hand/hand.component.sandbox').then(sandbox => { return sandbox.default.serialize('./app/game/components/hand/hand.component.sandbox'); });
}}
