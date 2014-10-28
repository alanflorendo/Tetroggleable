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
var lineScore;
var previousTime;
var dicts;
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
				game.userControls(event);
			if(k==13)
				wordTracker.findWord();
			if(k==27)
				game.toggleGamePause();
			else
				$('boggle_letters').focus();
	})
});
