var ROWS = 20;
var COLS = 10;
var SIZE = 32;
var SPEEDS = [500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 25, 10, 5, 1];
var BOARDHEIGHT = 640;
var BOARDWIDTH = 320;
var INPRODUCTION = true;

var canvas;
var context;
var preview;
var prevctx;
var currentBlock;
var currentTime;
var isGameOver;
var lineScore;
var previousTime;
var currentLevel = 1;
var currentSpeed = SPEEDS[currentLevel-1];
var dicts;
var gameIsPaused = false;
var linePoints = 10;
var tileColor = "#E4C390";
var lX2 = "#95B8D3";
var lX3 = "#237CBF";
var wX2 = "#DD9ABD";
var wX3 = "#A63952";
var tileTextColor = "#000";
var statTracker;
var gameCanvas;

function setRowsCols() {
	width = $(window).width();
	height = $(window).height();

	if (height < 760) {
		ROWS = 17;
		BOARDHEIGHT = 544;
		$("#game_canvas").attr("height", 544);
	}
}

$(window).load(function(){

	canvas = document.getElementById('game_canvas');
	context = canvas.getContext('2d');
	browserTest();
	preview = document.getElementById('game_preview');
	prevctx = preview.getContext('2d');
	lineScore = $('#lines');
	previousTime = 0;
	currentTime = 0;

	//shrink for smaller screen
	setRowsCols();

	startGame();
	$(document).keydown(function(event){
			k = event.keyCode
			if(k==32||k==37||k==38||k==39||k==40)
				getKeyCode(event);
			if(k==13)
				findWord();
			if(k==27)
				toggleGamePause();
			else
				$('boggle_letters').focus();
	})
});

function browserTest() {
	if (Modernizr.touch) {
		$("#game_main").hide();
		$("#browser_notice").show();
		$("#browser_notice .not_mobile").show();
		return;
	}
	if (!Modernizr.canvas) {
		$("#game_main").hide();
		$("#browser_notice").show();
		$("#browser_notice .upgrade").show();
		return;
	}
}

function startGame() {
	var row, col;
	currentLines = 0;
	isGameOver = false;
	currentLevel = 1;
	currentSpeed = SPEEDS[currentLevel - 1];
	$("#levels").text(1);
	gameTiler = new TileGenerator();
	gameCanvas = new Canvas();
	gameTetris = new TetrisController();
	gameData = new Array();

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
	statTracker = new StatsTracker;
}

function getKeyCode(e) {
	e.preventDefault();

	if(isGameOver != true) {
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

  if (currentTime - previousTime > currentSpeed && !(gameIsPaused)) {
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

  if (isGameOver == false) {
    requestAnimationFrame(updateGame);
  }
  else {
  	gameOver();
  }
}

function gameOver() {
	statTracker.saveGame();
	$("#boggle_letters").prop("disabled", true)
  $("#right-bar h3").fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
}

function updateScores(type, points) {
	if (type === 'line') {
		var lines = parseInt($("#lines").text()) + 1;
		$("#lines").text(lines);
	}
	else if (type === 'word') {
		var scrabbleScore = parseInt($("#scrabble_score").text()) + points;
		$("#scrabble_score").text(scrabbleScore);
	}
	var totalScore = parseInt($("#overall_score").text()) + points;
	$("#overall_score").text(totalScore);
}

function toggleGamePause() {
	gameIsPaused = !(gameIsPaused);
}


function updateWordScores(word, score) {
	var wordHTML = "<li>" + word + ": " + score + "</li>";
	$("#word_scores ul").prepend(wordHTML)
}

