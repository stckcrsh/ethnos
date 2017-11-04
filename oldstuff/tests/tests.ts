import * as shortid from "shortid";

const cards = [
    ...Array.apply(null, Array(3)).map((_, idx) => ({
      id: shortid(),
      name: "Elf",
      type: idx % 6
    })),
    ...Array.apply(null, Array(3)).map((_, idx) => ({
      id: shortid(),
      name: "Minotaur",
      type: idx % 6
    })),
    ...Array.apply(null, Array(3)).map((_, idx) => ({
      id: shortid(),
      name: "Wizard",
      type: idx % 6
    }))
  ]