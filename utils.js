// utils.js (generador tablero buscaminas)
export function generateBoard() {
  const board = Array(100).fill(false);
  let bombs = 0;
  while (bombs < 25) {
    const idx = Math.floor(Math.random() * 100);
    if (!board[idx]) {
      board[idx] = true;
      bombs++;
    }
  }
  return board;
}
