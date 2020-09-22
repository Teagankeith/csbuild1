import React, {useCallback, useState, useRef} from 'react';
import produce from 'immer';

import './App.css';

import {BrowserRouter as router, Link, Route} from "react-router-dom"

import cgl from "./assets/cgl.png"

const numRows = 40;
const numCols = 40;

const operations = [
  // These operations allow us to check all the locations around the current node a.k.a allows us to check all the neighbors
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]




function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  

  const [running, setRunning] = useState(false);

  const runningRef= useRef(running);
  runningRef.current = running;



  const resetPage = () => {
    window.location.reload(false);
  }

  // using useCallback allows us not to re-render
  const Simulate = useCallback(() => {
    if(!runningRef.current) {
      return;
    }

    // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation. 
    // 2. Any live cell with two or three live neighbours lives on to the next generation. 
    // 3. Any live cell with more than three live neighbours dies, as if by overpopulation. 
    // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. 
    setGrid((val) => {
      return produce(val, gridCopy => {
        for(let i = 0; i < numRows; i++){
          for(let j = 0; j < numCols; j++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              
              // We are checking here to make sure we don't go out of bounds
              if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += val[newI][newJ]
              }
            })

            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0
            } else if(val[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }





          }
        }
      });
    });
  

    setTimeout(Simulate, 100)
  }, [])

  console.log(grid);

  return (
    <div className="App">
      <header>
       <h1>Conway's Game of Life</h1>
        <nav>
          <a href="/cgl">Game</a>
          <a href="/rules">Rules</a>
          <a href="https://github.com/teagankeith">My Github</a>
        </nav>
      </header>

      <Route exact path="/">
        <div id="cgl-mid-img-cnt">
          <img id="cgl-mid-img"src={cgl} alt="Game of life image"/>
        </div>
        <section id="mid-inf-sctn">
          <h2> The Game of Life</h2>
          <p><a href="https://en.wikipedia.org/wiki/John_von_Neumann">John Von Neummann</a> said that:
          "Life is a creation which can repdouce itself and simulate a Turing Machine". In 1970, he made "The game of life".
          It's said that anything that can be solved with an algorithm can be solved within the Game of Life. The game is used 
          for instruction and teaching in many different fields around the world. 
          </p>

        </section>

      </Route>
      <Route path="/cgl">
        <div id="cgl-cnt">
          <div id="scnd-head-cnt"> 
            <h2>Welcome to the game!</h2>
            <p>Check the rules page if you don't know how to play!</p>
          </div>   
          <div id="cgl-container" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            margin:'2% 0 5% 25%',
          }}>
            {
              grid.map((rows, index) => rows.map((col, colIndex) => 
              <div key={`${index}-${colIndex}`}style={{width: 15, height: 15,
                backgroundColor: grid[index][colIndex] ? 'yellow' : undefined,
                border: 'solid 1px black',
                }}
                onClick={() =>{
                    const newGrid = produce(grid, gridCopy => {
                      gridCopy[index][colIndex] = grid[index][colIndex] ? 0 : 1;
                    });
                    setGrid(newGrid)
                  // setGrid(produce())
                }}
                
                id="box"/> ))
            }
          </div>

          <div id="cgl-btn-cnt">
          <button class="cgl-btn" onClick={() => {
            setRunning(!running);
            if(!running){
            runningRef.current = true;
            Simulate()
            }
          }
          }>{running ? "Stop" : "Start"}</button>
            <button class="cgl-btn" onClick={resetPage}> Reset </button>
            {/* <button class="cgl-btn"></button> */}
          </div>
        </div>
      </Route>

      <Route path="/rules">
        <section id="rules-sctn-cnt">
          <h2>The Rules</h2>
          <ul>
            <li> 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation. </li>
            <li> 2. Any live cell with two or three live neighbours lives on to the next generation. </li>
            <li> 3. Any live cell with more than three live neighbours dies, as if by overpopulation. </li>
            <li> 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. </li>
          </ul>
        </section>
      </Route>
    </div>
  );
}

export default App;
