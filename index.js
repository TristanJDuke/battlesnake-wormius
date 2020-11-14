const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Tristan Duke',
    color: '#7303a3',
    head: 'pixel',
    tail: 'pixel'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body
  let move = 'left';
  let possibleMoves = ['up', 'down', 'left', 'right']

  let foodList = gameData.board.food;
  let closestFood;
  let closestDistance = Infinity;
  
  for (let food of foodList) {

    let currentDistance = Math.abs(food.x - gameData.you.head.x) + Math.abs(food.y - gameData.you.head.y)
    if(currentDistance < closestDistance) {
      closestDistance = currentDistance;
      closestFood = food;
      }
  }
  let board = gameData.board;
  let head = gameData.you.head;
  let validMove = {
    up:    head.y<board.height-1,
    down:  head.y>0,
    left:  head.x>0,
    right: head.x<board.width-1,
  };

  for (snake of gameData.board.snakes){
    for (part of snake.body) {
      if (part.x == head.x && part.y == head.y+1){
        validMove.up = false;
      } 
      if (part.x == head.x && part.y == head.y-1){
        validMove.down = false;
      } 
      if (part.x == head.x-1 && part.y == head.y){
        validMove.left = false;
      } 
      if (part.x == head.x+1 && part.y == head.y){
        validMove.right = false;
      }
    }
  }
  
  if (head.x > closestFood.x && validMove.left) {
    move = 'left';
  }
  else if (head.x < closestFood.x && validMove.right) {
    move = 'right';
  }
  else if (head.y > closestFood.y && validMove.down) {
    move = 'down';
  }
  else if (head.y < closestFood.y && validMove.up) {
    move = 'up';
  } else {
    if (validMove.up) {
      move = 'up';
    } else if (validMove.down) {
      move = 'down';
    } else if (validMove.left) {
      move = 'left';
    } else if (validMove.right) {
      move = 'right';
    }
  }
  console.log('MOVE: ' + move)
  response.status(200).send({
      move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
