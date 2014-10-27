function calculateScrabbleScore(tiles, length) {
  var score = 0;
  var extraMultiplier = 1;
  var currentWordPoints = 0;
  var j = 1

  for (var i = 0; i < tiles.length; i++) {
    tile = gameData[tiles[i][0]][tiles[i][1]];
    console.log(tile)

    currentLetterPoints = tile.score;

    switch(tile.scrabbleExtras) {
      case "NA": extraMultiplier *= 1;      break;
      case "WX2": extraMultiplier *= 2;     break;
      case "WX3": extraMultiplier *= 3;     break;
      case "LX2": currentLetterPoints *=2;  break;
      case "LX3": currentLetterPoints *=3;  break;
    }

    currentWordPoints += currentLetterPoints;

    //end of word
    if (j % length === 0) {
      currentWordPoints *= extraMultiplier

      if (j >= 7)
        currentWordPoints *= 2;

      score += currentWordPoints;
      extraMultiplier = 1;
      currentWordPoints = 0;
    }

    if (j >= length)
      j = 1;
    else
      j++
  }

  return score;
}

function loadDictionary() {
  $.get( "/assets/dictionary.txt", function( text ) {
    dicts = text.split( "\n" );
  });
}

function findWord() {
  if (gameIsPaused && INPRODUCTION)
    return;

  var letters = $("#boggle_letters").val();
  $("#boggle_letters").val("");
  var currentLetters = letters.split( "" );
  var tilesOnBoard = [];
  if( currentLetters.length >= 3 ) {
    word = currentLetters.join("");

    if( dicts.indexOf(word.toUpperCase())  != -1 )
      tilesOnBoard = wordCoordsOnBoggleBoard(word, gameData);

    if (tilesOnBoard.length > 0) {
      wordScore = calculateScrabbleScore(tilesOnBoard, currentLetters.length)
      updateScores('word', wordScore)
      gameTetris.makeTilesFall(tilesOnBoard);
      updateWordScores(letters, wordScore);
      statTracker.runStats(letters, wordScore);
    }
    else
      $('#wordNotFound').show().fadeOut(3000);
  }
}