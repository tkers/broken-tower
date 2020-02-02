const chars = "BCDFGHJKLMNPQRSTVWXYZ23456789";
function generateId(len) {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function shuffle(arr) {
  let n = arr.length;
  while (n) {
    const i = Math.floor(Math.random() * n--);
    const elem = arr[n];
    arr[n] = arr[i];
    arr[i] = elem;
  }
  return arr;
}

exports.generateId = generateId;
exports.shuffle = shuffle;
