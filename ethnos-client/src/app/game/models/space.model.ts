export interface Space {
  type: string;
  pieces: { [id: string]: number };
  scores: number[];
}
