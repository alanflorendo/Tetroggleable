function StatsTracker() {

	this.longest_word = "";
	this.longest_word_score = 0;
	this.highest_word = "";
	this.highest_word_score = 0;
	this.most_common_word = "";
	this.most_common_word_times = 0;
	this.wordsUsed = {};

	this.trackCommonWords = function (word) {
		if (this.wordsUsed[word]) {
			this.wordsUsed[word] += 1;
		}
		else {
			this.wordsUsed[word] = 1;
		}
	}

	this.updateMostCommonWord = function() {
		var numTimesUsed = 1;
		var mostUsedWord = "";
		var obj = this.wordsUsed;
		for (var prop in obj) {
			if (obj[prop] > numTimesUsed) {
				numTimesUsed = obj[prop];
				this.most_common_word_times = numTimesUsed;
				this.most_common_word = prop;
			}
		}
	}

	this.runStats = function(word, score) {
		if (word.length > this.longest_word.length) {
			this.longest_word = word;
			this.longest_word_score = score;
		}

		if (score > this.highest_word_score) {
			this.highest_word = word;
			this.highest_word_score = score;
		}

		this.trackCommonWords(word);
	}

	this.saveGame = function(){
		var level = $("#levels").text();
		var scrabble_score = $("#scrabble_score").text();
		var lines = $("#lines").text();
		var score = $("#overall_score").text();
		this.updateMostCommonWord();
		$.ajaxSetup({
		headers: {
			'X-CSRF-Token':$('meta[name="csrf-token"]').attr("content")
			}
		});
		$.ajax({
			url: '/games',
			type: 'POST',
			dataType: 'json',
			data: {game: { score: score, scrabble_score: scrabble_score, level: level,  lines: lines, longest_word: this.longest_word, longest_word_score: this.longest_word_score, highest_word: this.highest_word, highest_word_score: this.highest_word_score, most_common_word: this.most_common_word,}}
		})
		.done(function(response) {
			console.log("success");
			console.log(response)
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	}
}