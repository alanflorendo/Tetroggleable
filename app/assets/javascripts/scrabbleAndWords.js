function WordTracker() {

  this.calculateScrabbleScore = function(tiles, length) {
    var score = 0;
    var extraMultiplier = 1;
    var currentWordPoints = 0;
    var j = 1

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

  this.loadDictionary = function() {
    $.get( "/assets/dictionary.txt", function( text ) {
      dicts = text.split( "\n" );
    });
  }

  this.findWord = function() {
    if (game.gameIsPaused && INPRODUCTION)
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
        wordScore = this.calculateScrabbleScore(tilesOnBoard, currentLetters.length)
        game.updateScores('word', wordScore)
        gameTetris.makeTilesFall(tilesOnBoard);
        game.updateWordScores(letters, wordScore);
        statTracker.runStats(letters, wordScore);
      }
      else
        $('#wordNotFound').show().fadeOut(3000);
    }
  }

}