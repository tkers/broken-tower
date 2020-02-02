export const countWrongPieces = pieces => {
  return pieces.filter(p => !p.stable).length;
};

export const getScore = (pieces = [], remainingPieces = 0) => {
  const total = pieces.length + remainingPieces;
  if (total === 0) return 0;
  const good = pieces.length - countWrongPieces(pieces);
  return Math.floor((good * 1000) / total);
};
