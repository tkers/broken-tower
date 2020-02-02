export const countWrongPieces = pieces => {
  return pieces.filter(p => !p.stable).length;
};

export const getScore = pieces => {
  const total = pieces.length;
  const good = total - countWrongPieces(pieces);
  return Math.floor((good * 1000) / total);
};
