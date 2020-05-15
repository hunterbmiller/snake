import React, { useState, useEffect } from 'react';
import './Game.css';

const MOVE_LEFT = 'ArrowLeft';
const MOVE_RIGHT = 'ArrowRight';
const MOVE_UP = 'ArrowUp';
const MOVE_DOWN = 'ArrowDown';
const DIRECTIONS = [MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN];
const COLS = 25;
const ROWS = 25;
export default function Game(props) {
  const [food, setFood] = useState([getRandom(ROWS), getRandom(COLS)]);
  const [score, setScore] = useState(0);
  const direction = useDirection();
  const snake = useSnake(direction);

  useEffect(() => {
    if(snake[0] === food[0] && snake[1] === food[1]) {
      setScore((prevScore) => prevScore + 1);
      setFood([getRandom(ROWS), getRandom(COLS)])
    }
  }, [snake])
  
  function Tile({ isSnake, isFood }) {
    return(
      <div className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}></div>
    )
  }

  function Row(props) {
    const { row } = props;

    return(
      <div className="row">
        {[...Array(COLS)].map((_, currCol) => { 
          return <Tile key={currCol}
                       isSnake={snake[0] === currCol && snake[1] === row}
                       isFood={food[0] === currCol && food[1] === row} />
        })}
      </div>
    )
  }

  return (
    <div>
      <h3>Current Score {score}</h3>
      <div className="game">
        {[...Array(ROWS)].map((_, i) => {
          return (
            <Row row={i} key={i} />
          )
        })}
      </div>
    </div>
  );
}

function useDirection() {
  const [direction, setDirection] = useState(MOVE_LEFT);

  useEffect(() => {
    const listener = document.addEventListener('keydown', (e) => {
      if(DIRECTIONS.includes(e.code)) {
        setDirection(e.code);
      }
    });

    return () => document.removeEventListener('keydown', listener);
  });

  return direction;
}

function useSnake(direction) {
  const [snake, setSnake] = useState([getRandom(ROWS), getRandom(COLS)]);

  useEffect(() => {
    const tick = window.setInterval(() =>  {
      switch(direction) {
        case MOVE_LEFT:
          setSnake((prevSnake) => [prevSnake[0] - 1 < 0 ? COLS : prevSnake[0] - 1, prevSnake[1]]);
          break;
        case MOVE_RIGHT:
          setSnake((prevSnake) => [prevSnake[0] - 1 > COLS ? 0 : prevSnake[0] + 1, prevSnake[1]]);
          break;
        case MOVE_UP:
          setSnake((prevSnake) => [prevSnake[0], prevSnake[1] - 1 < 0 ? COLS : prevSnake[1] - 1]);
          break;
        case MOVE_DOWN:
          setSnake((prevSnake) => [prevSnake[0], prevSnake[1] - 1 > COLS ? 0 : prevSnake[1] + 1]);
          break;
      }
    }, 25);
    return () => clearInterval(tick);
  })

  return snake;
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}
