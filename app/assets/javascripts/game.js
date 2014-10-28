function TetrisGame() {
	this.currentLevel = 1;
	this.currentSpeed = SPEEDS[0];
	this.currentLines = 0;
	this.scrabbleScore = 0;
	this.totalScore = 0;
	this.isGameOver = false;
	this.gameIsPaused = false;



	this.gameOver = function() {
		statTracker.saveGame();
		$("#boggle_letters").prop("disabled", true)
	  $("#right-bar h3").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
	}

	this.updateScores = function(type, points) {
		if (type === 'line') {
			this.currentLines = this.currentLines + 1;
			$("#lines").text(this.currentLines);
			console.log(type + ":  " + points);
		}
		else if (type === 'word') {
			this.scrabbleScore = this.scrabbleScore + points;
			$("#scrabble_score").text(this.scrabbleScore);
			console.log(type + ":  " + points);
		}
		this.totalScore = (this.currentLines * linePoints) + this.scrabbleScore;
		$("#overall_score").text(this.totalScore);
	}

	this.toggleGamePause = function() {
		this.gameIsPaused = !(this.gameIsPaused);
	}


	this.updateWordScores = function(word, score) {
		var wordHTML = "<li>" + word + ": " + score + "</li>";
		$("#word_scores ul").prepend(wordHTML)
	}


  this.advanceLevelIfNeeded = function() {
    if (this.currentLines % 10 === 0 && this.currentLevel < SPEEDS.length){
      this.currentLevel += 1;
      this.currentSpeed = SPEEDS[this.currentLevel - 1];
      $("#levels").text(this.currentLevel.toString());
    };
  }



}


function startGame() {
	var row, col;
	// currentLines = 0;
	// currentLevel = 1;
	// currentSpeed = SPEEDS[currentLevel - 1];
	game = new TetrisGame();
	gameTiler = new TileGenerator();
	gameCanvas = new Canvas();
	gameTetris = new TetrisController();
	gameData = new Array();
	statTracker = new StatsTracker();

	$("#levels").text(game.currentLevel);
	// $("#levels").game.currentLevel;
	$('input:text:first').focus();
	loadDictionary();

	for(row= 0; row < ROWS; row++) {
		gameData[row] = new Array();
		for(col = 0; col < COLS; col++) {
			gameData[row][col] = 0;
		}
	}

	currentBlock = getRandomBlock();
	nextBlock = getRandomBlock();

	var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimFrame;
	requestAnimationFrame(updateGame);

	drawPreview();
}

function getKeyCode(e) {
	e.preventDefault();

	if(game.isGameOver != true) {
		switch(e.keyCode) {
			case 32: { // space bar
				gameTetris.letBlockFall();
			}
			break;

			case 37: { // left arrow
				if( gameTetris.validateMove(currentBlock.gridX - 1, currentBlock.gridY, currentBlock.currentRotation) )
					currentBlock.gridX--;
			}
			break;

			case 39: { // right arrow
				if( gameTetris.validateMove(currentBlock.gridX + 1, currentBlock.gridY, currentBlock.currentRotation) )
					currentBlock.gridX++;
			}
			break;

			case 38: { // up arrow
				var newRotation = currentBlock.currentRotation - 1;
				if(newRotation < 0)
					newRotation = currentBlock.rotations.length - 1;

				if( gameTetris.validateMove(currentBlock.gridX, currentBlock.gridY, newRotation) )
					currentBlock.currentRotation = newRotation;
			}
			break;

			case 40: { // down arrow
				if( gameTetris.validateMove(currentBlock.gridX, currentBlock.gridY + 1, currentBlock.currentRotation) )
					currentBlock.gridY++;
			}
			break;
		}
	}
}

function updateGame() {
  currentTime = new Date().getTime();

  if (currentTime - previousTime > game.currentSpeed && !(game.gameIsPaused)) {
    if (gameTetris.validateMove(currentBlock.gridX, currentBlock.gridY + 1, currentBlock.currentRotation)) {
      currentBlock.gridY += 1;
    }
    else {
      gameTetris.landBlock(currentBlock);
      currentBlock = nextBlock;
      nextBlock = getRandomBlock();
      drawPreview();
    }

    previousTime = currentTime;
  }

  context.clearRect(0, 0, BOARDWIDTH, BOARDHEIGHT);
  gameCanvas.drawBoard();
  gameCanvas.drawBlock(currentBlock);

  if (game.isGameOver == false) {
    requestAnimationFrame(updateGame);
  }
  else {
  	game.gameOver();
  }
}
