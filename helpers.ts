import * as R from "ramda";

export function normalize<T>(
  id: string
): (
  entities: T[]
) => {
  entities: { [id: string]: T };
  ids: string[];
} {
  return R.compose(
    R.reduce(
      (acc, item) => ({
        entities: { ...acc.entities, [item[id]]: item },
        ids: [...acc.ids, item[id]]
      }),
      { entities: {}, ids: [] }
    )
  );
}

export function shuffle<T>(_array: T[]): T[] {
  let array = _array.slice();
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
