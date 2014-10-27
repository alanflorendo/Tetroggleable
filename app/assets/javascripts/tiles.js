function Tile (letter, score, scrabble) {
  this.letter = letter;
  this.score = score;
  this.scrabbleExtras = scrabble;
  this.highlight = false;
}

function TileGenerator() {
  
  LETTERS = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U", "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z"];
  var randomLetters = [];

  POINTS = {"A":1, "B":3, "C":3, "D":2, "E":1, "F":4, "G":2, "H":4, "I":1, "J":8, "K":5, "L":1, "M":3, "N":1, "O":1, "P":3, "Q":10, "R":1, "S":1, "T":1, "U":1, "V":4, "W":4, "X":8, "Y":4, "Z":10};

  SCRABBLE = ["NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA","WX2", "WX3", "NA", "LX3", "NA", "LX2"]
  var randomScrabbles = [];

  this.getRandomLetter = function() {
    if (randomLetters.length === 0) {
      randomLetters = clone(shuffle(LETTERS));
    }
    randomLetter = randomLetters.shift();
    return randomLetter;
  }

  this.getRandomScrabble = function() {
    if (randomScrabbles.length === 0) {
      randomScrabbles = clone(shuffle(SCRABBLE));
    }
    var randomScrabble = randomScrabbles.shift();
    return randomScrabble;
  }

  this.getNewTile = function() {
    var ltr = this.getRandomLetter();
    var pts = POINTS[ltr];
    var scr = this.getRandomScrabble();
    return new Tile(ltr, pts, scr);
  }

  this.generateTiles = function() {
    var tileArray = []
    for (i = 0; i < 4; i++) {
      tileArray.push(this.getNewTile());
    }
    return tileArray;
  }
}
