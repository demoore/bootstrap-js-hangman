/**
 * Created with IntelliJ IDEA.
 * User: dylan
 * Date: 2013-07-10
 * Time: 3:02 PM
 */
$(document).ready(function () {
    var canvas = document.getElementById('gallows');
    var context = $('#gallows')[0].getContext("2d");

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var font = '20pt Courier';

    var words = ['I love you Christian', 'Thinking of you, honey'];

    var numberWrongOfGuesses = 0;

    var wordX = 10;
    var wordY = 50;

    var maxWidth = 400;
    var lineHeight = 40;
    var x = (canvas.width - maxWidth) / 2;
    var y = 60;

    var pickedWord = pickWord();
    var splitWord = pickedWord.split('');
    var guessWord = obfuscateWord(splitWord);

    function placeText(word, x, y, font) {
        context.font = font;
        context.fillText(word, x, y);
    }

    function placeTextHTML(word) {
        //word = word.split("").join('<span style="border-bottom: 0px;">' + String.fromCharCode(8202) + '</span>');
        $('#words').html(word)
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    }

    //I lost the game
    function lostTheGame() {
        clearCanvas();
        displayWordHTML();
        disableButtons();
        $('#words').append('<br><br><br>You lost the game!');
//        wrapText(context,"You've lost, press reset to play again", wordX, wordY + 200, maxWidth,lineHeight );
        return;
    }

    function wonTheGame() {
        clearCanvas();
        displayWordHTML();
        disableButtons();
        $('#words').append('<br><br><br>You won the game!');
//        wrapText(context,"You win! Press reset to play again", wordX, wordY + 200, maxWidth,lineHeight );
        return;

    }

    function checkGuess(event) {
        buttonClicked = event.target.id;
        selectedLetter = $("#" + buttonClicked).text().toLowerCase();
        $("#" + buttonClicked).attr('disabled', true);
//        console.log(buttonClicked);
//        console.log(selectedLetter);

        letterExists = false;
        for (var i = 0; i < splitWord.length; i++) {
            if (splitWord[i].toLowerCase() == selectedLetter) {
                guessWord = setCharAt(guessWord, i, splitWord[i]);
                letterExists = true;
            }
        }

        var wonCheck = checkIfWon(guessWord);
        if (wonCheck) {
            wonTheGame();
            return;
        }


        if (!letterExists) {
            numberWrongOfGuesses++;
            incrementGuess();
        }

        if (numberWrongOfGuesses > 7) {
            console.log("LOST");
            lostTheGame();
            return;
        }

        console.log(guessWord);
        /*clearCanvas();
         wrapText(context,guessWord, wordX, wordY, maxWidth,lineHeight );*/
        placeTextHTML(spanTheWord(guessWord));

    }

    function drawButtons() {
        for (var i = 0; i < alphabet.length; i++) {
            $('<button/>', {
                text: alphabet[i],
                id: 'guess_' + alphabet[i],
                class: 'btn btn-small',
                click: function (event) {
                    checkGuess(event);
                }
            }).appendTo('#buttonDiv');
        }
    }

    drawButtons();

    function pickWord() {
        var number = Math.floor(Math.random() * words.length);
//        console.log(number);
        return words[number];
    }


    //Special cases go here!
    function obfuscateWord(word) {
        var obfuscatedWord = "";
        for (var i = 0; i < word.length; i++) {
            if (word[i] == " ") {
                obfuscatedWord += " ";
            } else if (word[i] == ",") {
                obfuscatedWord += ',';
            }
            else if (word[i] == '\'') {
                obfuscatedWord += '\'';
            }
            else if (word[i] == '"') {
                obfuscatedWord += '"';
            }
            else if (word[i] == '?') {
                obfuscatedWord += '?';
            }
            else {
                obfuscatedWord += "_"

            }
        }

        return obfuscatedWord;
    }

    //Special cases go here!
    function spanTheWord(word) {
        var obfuscatedWord = "";
        for (var i = 0; i < word.length; i++) {
            if (word[i] == " ") {
                obfuscatedWord += " ";
            } else if (word[i] == ",") {
                obfuscatedWord += ',';
            }
            else if (word[i] == '\'') {
                obfuscatedWord += '\'';
            }
            else if (word[i] == '"') {
                obfuscatedWord += '"';
            }
            else if (word[i] == '?') {
                obfuscatedWord += '?';
            }
            else if (word[i] == '_') {
                obfuscatedWord += ('<span class="blank">' + word.charAt(i) + '</span>' + String.fromCharCode(8202));
            }
            else {
                obfuscatedWord += ('<span class="notBlank">' + word.charAt(i) + '</span>' + String.fromCharCode(8202));
            }

            obfuscatedWord += ""
        }

        return obfuscatedWord;
    }


    function incrementGuess() {
        $("#wrongGuess").html(numberWrongOfGuesses);
    }

    function startCanvas() {
//        wrapText(context,guessWord, wordX, wordY, maxWidth,lineHeight );
        placeTextHTML(spanTheWord(guessWord));
        incrementGuess();
    }

    startCanvas();

    function enableButtons() {
        for (var i = 0; i < alphabet.length; i++) {
            $("#guess_" + alphabet[i]).attr('disabled', false);
        }
    }

    function disableButtons() {
        for (var i = 0; i < alphabet.length; i++) {
            $("#guess_" + alphabet[i]).attr('disabled', true);
        }
    }

    function reset() {
        enableButtons();
        pickedWord = pickWord();
        splitWord = pickedWord.split('');
        guessWord = obfuscateWord(splitWord);
        numberWrongOfGuesses = 0;
        clearCanvas();
        startCanvas();
        console.log("RESET!");
    }

    function resetButton() {
        $("#resetButton").click(function () {
            reset();
        });
    }

    resetButton();


    function checkIfWon(guess) {
        var checkWord = guessWord.split("");
        for (var i = 0; i < checkWord.length; i++) {
            if (checkWord[i] == '_') {
                return false;
            }
        }
        return true;
    }


    /*  Stolen From:
     http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/*/
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        placeText(line, x, y, font);
    }

    function displayWord() {
        clearCanvas();
        wrapText(context, pickedWord, wordX, wordY, maxWidth, lineHeight);
    }

    function displayWordHTML() {
        placeTextHTML(spanTheWord(pickedWord));
    }

});



