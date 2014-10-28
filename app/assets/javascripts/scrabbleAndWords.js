function WordTracker() {

  this.calculateScrabbleScore = function(tiles, word) {
    var score = 0;
    var extraMultiplier = 1;
    var currentWordPoints = 0;

    for (var i = 0; i < tiles.length; i++) {
      tile = gameData[tiles[i][0]][tiles[i][1]];

      currentLetterPoints = tile.score;

      switch(tile.scrabbleExtras) {
        case "NA": extraMultiplier *= 1;      break;
        case "WX2": extraMultiplier *= 2;     break;
        case "WX3": extraMultiplier *= 3;     break;
        case "LX2": currentLetterPoints *=2;  break;
        case "LX3": currentLetterPoints *=3;  break;
      }

      currentWordPoints += currentLetterPoints;
    }

    if (word.length >= 7) // double if word is more than 7 letters
      extraMultiplier *= 2;
      
    score += currentWordPoints;
    score *= extraMultiplier;
    return score;
  }

  this.loadDictionary = function() {
    $.get( "/assets/dictionary.txt", function( text ) {
      dicts = text.split( "\n" );
    });
  }

  this.findWord = function() {
    if (game.gameIsPaused && INPRODUCTION)
      return;

    var word = $("#boggle_letters").val();
    $("#boggle_letters").val("");
    var currentLetters = word.split( "" );
    var tilesOnBoard = [];
    if( currentLetters.length >= 3 ) { // word must be at least 3 letters long

      if( dicts.indexOf(word.toUpperCase())  != -1 ) // word must be a real dictionary word
        tilesOnBoard = wordCoordsOnBoggleBoard(word, gameData);

      if (tilesOnBoard.length > 0) { // word must be on the board
        wordScore = this.calculateScrabbleScore(tilesOnBoard, word)
        game.updateScores('word', wordScore)
        gameTetris.makeTilesFall(tilesOnBoard);
        game.updateWordScores(word, wordScore);
        statTracker.runStats(word, wordScore);
      }
      else
        $('#wordNotFound').show().fadeOut(3000);
    }
  }

}