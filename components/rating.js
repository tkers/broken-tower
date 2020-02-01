export const isBadPiece = (pieces, i) => {
  if (i === 0) return false;
  for (let k = i - 1; k >= 0; k--) {
    if (pieces[i] > pieces[k]) {
      return true;
    }
  }
  return false;
};

export const countWrongPieces = pieces => {
  let n = 0;
  pieces.forEach((width, i) => {
    if (isBadPiece(pieces, i)) n++;
  });
  return n;
};

export const getScore = pieces => {
  const total = pieces.length;
  const ok = total - countWrongPieces(pieces);
  return Math.floor((ok * 100) / total);
};
