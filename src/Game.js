import React, { useState, useEffect } from 'react';
import './Game.css';

const MOVE_LEFT = 'ArrowLeft';
const MOVE_RIGHT = 'ArrowRight';
const MOVE_UP = 'ArrowUp';
const MOVE_DOWN = 'ArrowDown';
const DIRECTIONS = [MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN];
const WIDTH = 25;
const HEIGHT = 25;

export default function Game() {
  const direction = useDirection();
  const { snake, food } = useSnake(direction);

  function Cell({ isSnake, isFood }) {
    return(
    <div className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}></div>
    )
  }

  function Row({ row }) {
    let cells = [];
    for(let i = 0; i < WIDTH; i++) {
      cells.push(<Cell key={i}
                       isSnake={snake.find((part) => part[0] === i && part[1] === row)}
                       isFood={food[0] === i && food[1] === row} />)
    }

    return(
      <div className="row">
        {cells}
      </div>
    )
  }

  let rows = []
  for(let i = HEIGHT - 1; i >= 0; i--) {
    rows.push(<Row row={i} key={i} />)
  }

  return (
    <div>
      <div className="game">
        {rows}
      </div>
    </div>
  );
}

function moveSegment(segment, direction) {
  if(direction === MOVE_LEFT) {
    return [segment[0] - 1 < 0 ? WIDTH - 1 : segment[0] - 1, segment[1]];
  } else if(direction === MOVE_RIGHT) {
    return [segment[0] + 1 > WIDTH - 1 ? 0 : segment[0] + 1, segment[1]];
  } else if(direction === MOVE_UP) {
    return [segment[0], segment[1] + 1 > HEIGHT - 1 ? 0 : segment[1] + 1];
  } else if(direction === MOVE_DOWN) {
    return [segment[0], segment[1] - 1 < 0 ? HEIGHT - 1 : segment[1] - 1];
  } else {
    return [...segment];
  }
}

function useDirection() {
  const [direction, setDirection] = useState(MOVE_LEFT);

  useEffect(() => {
    const listener = document.addEventListener('keydown', (e) => {
      if(DIRECTIONS.includes(e.code)) {
        setDirection((prevDirection) => {
          if((prevDirection === MOVE_UP && e.code === MOVE_DOWN)    ||
             (prevDirection === MOVE_DOWN && e.code === MOVE_UP)    ||
             (prevDirection === MOVE_LEFT && e.code === MOVE_RIGHT) ||
             (prevDirection === MOVE_RIGHT && e.code === MOVE_LEFT)) {
            return prevDirection;
          } else {
            return e.code;
          }
        });
      }
    });

    return () => document.removeEventListener('keydown', listener);
  });

  return direction;
}

function useSnake(direction) {
  const [snake, setSnake] = useState([[getRandom(HEIGHT), getRandom(WIDTH)]]);
  const [food, setFood] = useState([getRandom(HEIGHT), getRandom(WIDTH)]);

  // Add a segment when the snake eats a food
  useEffect(() => {
    if(snake.find((part) => part[0] === food[0] && part[1] === food[1])) {
      setFood([getRandom(HEIGHT), getRandom(WIDTH)])
      setSnake((prevSnake) => {
        return [...prevSnake, moveSegment(prevSnake[prevSnake.length - 1], direction)];
      });
    }
  }, [snake, food, direction])

  // Move the snake segment by segment
  useEffect(() => {
    const tick = window.setInterval(() =>  {
      setSnake((prevSnake) => {
        return prevSnake.map((segment, i) => {
          return i === 0 ?  moveSegment(segment, direction) : [...prevSnake[i - 1]];
        });
      })

    }, 50);
    return () => clearInterval(tick);
  })

  return { snake: snake, food: food };
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}
