function Canvas() {

  this.drawTile = function(drawX, drawY) {
    context.strokeStyle = tileTextColor;
      context.beginPath();
    context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);
    context.fill();
    context.stroke();
  }

  this.tileColors = function(contextName, scrabbleExtras, highlight) {
    if (scrabbleExtras == "NA")
      contextName.fillStyle = tileColor;

    if (scrabbleExtras == "WX2")
      contextName.fillStyle = wX2;

    if (scrabbleExtras == "WX3")
      contextName.fillStyle = wX3;

    if (scrabbleExtras == "LX2")
      contextName.fillStyle = lX2;

    if (scrabbleExtras == "LX3")
      contextName.fillStyle = lX3;

    if (highlight)
      contextName.fillStyle = "#3C00FB";

    contextName.fill();
    contextName.stroke();
  }

  this.drawTileBackground = function(drawX, drawY, scrabbleExtras, highlight) {
    numberPosX = drawX * SIZE;
    numberPosY = drawY * SIZE;

    context.strokeStyle = tileTextColor;
    context.beginPath();
    context.rect(drawX * SIZE, drawY * SIZE , SIZE, SIZE);

    this.tileColors(context, scrabbleExtras, highlight);
    context.fillRect(numberPosX, numberPosY, SIZE, SIZE);
  };

  this.drawLetter = function(drawX, drawY, letter) {
    letterPosX = drawX * SIZE + 7;
    letterPosY = drawY * SIZE + 27;

    context.fillStyle = tileTextColor;
    context.font = '20pt Arial';
    if (!INPRODUCTION || !game.gameIsPaused) {
      context.fillText(letter, letterPosX, letterPosY, 22);
    }
  }

  this.drawNumber = function(drawX, drawY, score) {
    numberPosX = drawX * SIZE + 2;
    numberPosY = drawY * SIZE + 10;

    context.fillStyle = tileTextColor;
    context.font = 'bolder 8pt Arial';
    if (!INPRODUCTION || !game.gameIsPaused) {
      context.fillText(score, numberPosX, numberPosY, SIZE);
    }
  }

  this.drawBoard = function() {
    context.beginPath();
    context.rect(0, 0, 320, 640);
    context.fillStyle="black";
    context.fill();

    for(var row = 0; row < ROWS; row++) {
      for(var col = 0; col < COLS; col++) {
        if(gameData[row][col] != 0) {
          tile = gameData[row][col]
          this.drawTileBackground(col, row, tile.scrabbleExtras, tile.highlight);
          this.drawTile(col, row);
          this.drawLetter(col, row, tile.letter);
          this.drawNumber(col, row, tile.score);
        }
      }
    }
  }

  this.drawBlock = function(block) {
    var drawX = block.gridX;
    var drawY = block.gridY;
    var rotation = block.currentRotation;

    for(var row = 0, len = block.rotations[rotation].length; row < len; row++) {
      for(var col = 0, len2 = block.rotations[rotation][row].length; col < len2; col++) {
        if(block.rotations[rotation][row][col] != 0 && drawY >= 0) {
          tile = block.rotations[rotation][row][col]
          this.drawTileBackground(drawX, drawY, tile.scrabbleExtras, tile.highlight);
          this.drawTile(drawX, drawY);
          this.drawLetter(drawX, drawY, tile.letter);
          this.drawNumber(drawX, drawY, tile.score);
        }
        drawX += 1;
      }
      drawX = block.gridX;
      drawY += 1;
    }
  }
}

function drawPreview() {
  prevsize = 20;
  prevDrawX = 0;
  prevDrawY = 0;

  prevctx.beginPath();
  prevctx.rect(0, 0, 150, 100);
  prevctx.fillStyle="black";
  prevctx.fill();

  for(var row = 0, len = nextBlock.rotations[0].length; row < len; row++) {
    for(var col = 0, len2 = nextBlock.rotations[0][row].length; col < len2; col++) {
      if(nextBlock.rotations[0][row][col] != 0) {
        tile = nextBlock.rotations[0][row][col];

        prevctx.strokeStyle = tileTextColor;
        prevctx.beginPath();
        prevctx.rect(prevDrawX * prevsize, prevDrawY * prevsize, prevsize, prevsize);

        gameCanvas.tileColors(prevctx, tile.scrabbleExtras);

        prevctx.fillRect(prevDrawX * prevsize, prevDrawY * prevsize, prevsize, prevsize);

        prevctx.strokeStyle = tileTextColor;
        prevctx.beginPath();
        prevctx.rect(prevDrawX * prevsize, prevDrawY * prevsize, prevsize, prevsize);
        prevctx.fill();
        prevctx.stroke();

        prevctx.fillStyle = tileTextColor;
        prevctx.font = '15pt Arial';
        prevctx.fillText(tile.letter, (prevDrawX * prevsize + 3), (prevDrawY * prevsize + 17), 15);
      }
      prevDrawX += 1;
    }
    prevDrawX = 0;
    prevDrawY += 1;
  }
}
