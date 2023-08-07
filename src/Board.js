// import React, { useState } from "react";
// import Confetti from 'react-confetti'; // Import Confetti component
// import Cell from "./Cell";
// import "./Board.css";

// /** Game board of Lights out.
//  *
//  * Properties:
//  *
//  * - nrows: number of rows of board
//  * - ncols: number of cols of board
//  * - chanceLightStartsOn: float, chance any cell is lit at start of game
//  *
//  * State:
//  *
//  * - board: array-of-arrays of true/false
//  *
//  *    For this board:
//  *       .  .  .
//  *       O  O  .     (where . is off, and O is on)
//  *       .  .  .
//  *
//  *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
//  *
//  *  This should render an HTML table of individual <Cell /> components.
//  *
//  *  This doesn't handle any clicks --- clicks are on individual cells
//  *
//  **/

// function Board({
//   nrows = 5,
//   ncols = 5,
//   chanceLightStartsOn = 0.30
// }) {
//   const [board, setBoard] = useState(createBoard());
//   const [showConfetti, setShowConfetti] = useState(false); // State for confetti animation


//   // Create a board with nrows high/ncols wide, each cell randomly lit or unlit
//   function createBoard() {
//     let initialBoard = [];
//     for (let y = 0; y < nrows; y++) {
//       let row = [];
//       for (let x = 0; x < ncols; x++) {
//         row.push(Math.random() < chanceLightStartsOn);
//       }
//       initialBoard.push(row);
//     }
//     return initialBoard;
//   }

//   // ... (previously defined functions)

//   function newGame() {
//     setShowConfetti(false); // Stop the confetti animation on starting a new game
//     setBoard(createBoard());
//   }

//   if (hasWon()) {
//     return (
//       <div>
//         {showConfetti && ( // Show confetti only when showConfetti is true
//           <Confetti
//             width={window.innerWidth}
//             height={window.innerHeight}
//             numberOfPieces={200}
//             recycle={false}
//             run={showConfetti}
//           />
//         )}
//         <div className="YouWonMessage">You Won!</div> {/* Add class for larger font */}
//         <button className="NewGameButton" onClick={newGame}>
//           New Game
//         </button>
//       </div>
//     );
//   }

//   function flipCellsAround(coord) {
//     setBoard(oldBoard => {
//       const [y, x] = coord.split("-").map(Number);

//       const flipCell = (y, x, boardCopy) => {
//         if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
//           boardCopy[y][x] = !boardCopy[y][x];
//         }
//       };

//       const newBoard = oldBoard.map(row => [...row]);

//       flipCell(y, x, newBoard);
//       flipCell(y - 1, x, newBoard);
//       flipCell(y + 1, x, newBoard);
//       flipCell(y, x - 1, newBoard);
//       flipCell(y, x + 1, newBoard);

//       return newBoard;
//     });
//   }

//   function newGame() {
//     setBoard(createBoard());
//   }

//   if (hasWon()) {
//     return (
//       <div>
//         <div>You Won!</div>
//         <button className="NewGameButton" onClick={newGame}>
//           New Game
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <table className="Board">
//         <tbody>
//           {board.map((row, y) => (
//             <tr key={y}>
//               {row.map((cell, x) => (
//                 <Cell
//                   key={`${y}-${x}`}
//                   isLit={cell}
//                   flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
//                 />
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="Instructions">
//         <h1>Gameplay</h1>
//         <h4>
//           The game consists of a 5 row by 5 columns grid of lights. When the game starts, a random number or a stored pattern of these lights is switched on. Pressing any of the lights will toggle it and the four adjacent lights. The goal of the puzzle is to switch all the lights off, preferably in as few button presses as possible.
//         </h4>
//       </div>
//       <button className="NewGameButton" onClick={newGame}>
//         New Game
//       </button>
//     </div>
//   );
// }

// export default Board;


import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Cell from "./Cell";
import "./Board.css";

function createBoard(nrows, ncols, chanceLightStartsOn) {
  let initialBoard = [];
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      row.push(Math.random() < chanceLightStartsOn);
    }
    initialBoard.push(row);
  }
  return initialBoard;
}

function Board({
  nrows = 5,
  ncols = 5,
  chanceLightStartsOn = 0.30,
}) {
  const [board, setBoard] = useState(createBoard(nrows, ncols, chanceLightStartsOn));
  const [showConfetti, setShowConfetti] = useState(false);

  function hasWon() {
    return board.every((row) => row.every((cell) => !cell));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = oldBoard.map((row) => [...row]);

      flipCell(y, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y, x - 1, newBoard);
      flipCell(y, x + 1, newBoard);

      return newBoard;
    });
  }

  function newGame() {
    setShowConfetti(false);
    setBoard(createBoard(nrows, ncols, chanceLightStartsOn));
  }

  useEffect(() => {
    if (hasWon()) {
      setShowConfetti(true);

      const timerId = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [board]);

  return (
    <div className="BoardContainer">
      <div className="BoardMessageContainer">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            run={showConfetti}
          />
        )}
        {hasWon() && <div className="YouWonMessage">You Won!</div>}
      </div>
      <div className="Board">
        <table>
          <tbody>
            {board.map((row, y) => (
              <tr key={y}>
                {row.map((cell, x) => (
                  <Cell
                    key={`${y}-${x}`}
                    isLit={cell}
                    flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="Instructions">
        <h1>Gameplay</h1>
        <h4>
          The game consists of a 5 row by 5 columns grid of lights. When the game starts, a random number or a stored pattern of these lights is switched on. Pressing any of the lights will toggle it and the four adjacent lights. The goal of the puzzle is to switch all the lights off, preferably in as few button presses as possible.
        </h4>
      </div>
      <button className="NewGameButton" onClick={newGame}>
        New Game
      </button>
    </div>
  );
}

export default Board;


// https://stackoverflow.com/questions/69826433/react-hookstate-assigned-a-state-to-an-array-now-this-array-is-treated-as-a-st
