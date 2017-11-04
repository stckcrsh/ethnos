import * as R from 'ramda';

export default function normalize<T>(
  id: string
): (entities: T[]) => Normalized<T> {
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

export interface Normalized<T> {
  entities: { [id: string]: T };
  ids: string[];
}
