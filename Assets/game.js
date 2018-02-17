paper.install(window);
$(document).ready(function() {
    //Set canvas height
    $('#myCanvas').height($('#gameZone').height());
    $('#myCanvas').width($('#hangmanHolder').width());
    $('#wordHolder').height($('#gameZone').height());

    //Define canvas dimensions
    var canvas = {
                    T: $('#myCanvas').position().top,
                    L: $('#myCanvas').position().left,
                    H: $('#myCanvas').height(),
                    W: $('#myCanvas').width(),                                            
                };

    //Define Stand Object
    var stand = {
                    base: {
                            obj: {},
                            T: canvas.T + (canvas.H * .8),
                            L: canvas.L + (canvas.W * .1),
                            H: canvas.H * .1,
                            W: canvas.W * .8,  
                            },
                    pole: {
                            obj: {},
                            T: canvas.T + (canvas.H * .1),
                            R: canvas.L + (canvas.W * .1),
                            B: canvas.T + (canvas.H * .8),
                            L: canvas.L + (canvas.W * .1)                                
                        },
                    hanger1: {
                                obj: {},
                                T: canvas.T + (canvas.H * .1),
                                R: canvas.L + (canvas.W * .5),
                                B: canvas.T + (canvas.H * .1),
                                L: canvas.L + (canvas.W * .095)                                    
                            },
                    hanger2: {
                                obj: {},
                                T: canvas.T + (canvas.H * .095),
                                R: canvas.L + (canvas.W * .5),
                                B: canvas.T + (canvas.H * .15),
                                L: canvas.L + (canvas.W * .5)
                            }
                }

    //Define variables of key points on stickman 
    var radius = (stand.hanger2.B - stand.hanger2.T),
        center = {x: stand.hanger2.L, y: stand.hanger2.B + radius},            
        nose = center.x,
        neck = center.y + radius,
        shoulders = neck + (radius*2.5),
        hand = neck + radius,
        hips = neck + (radius*5),
        foot = neck + (radius*8),
        left = nose - (radius*2),
        right = nose + (radius*2),
        eye = {
                top: center.y - (radius/2), 
                bottom: center.y - (radius/4), 
                left: (radius/2), 
                right: (radius/4)
            }   

    //Define Stickman Object
    var stickMan = {
                    parts: ['head','body','armL','armR','legL','legR','eyeL','eyeR','mouth'], 
                    head: {
                            obj: {},                                
                            },
                    body: {
                            obj: {},
                            T: neck,
                            R: nose,
                            B: hips,
                            L: nose
                        },
                    armL: {
                            obj: {},
                            T: shoulders,
                            R: nose,
                            B: hand,
                            L: left
                        },
                    armR: {
                            obj: {},
                            T: shoulders,
                            R: nose,
                            B: hand,
                            L: right
                        },
                    legL: {
                            obj: {},
                            T: hips,
                            R: left,
                            B: foot,
                            L: nose
                        },
                    legR: {
                            obj: {},
                            T: hips,
                            R: right,
                            B: foot,
                            L: nose
                        },
                    eyeL1: {
                            obj: {},
                            T: eye.top,
                            R: nose - eye.right,
                            B: eye.bottom,
                            L: nose - eye.left
                        },
                    eyeL2: {
                            obj: {},
                            T: eye.top,
                            R: nose - eye.left,
                            B: eye.bottom,
                            L: nose - eye.right
                        },
                    eyeR1: {
                            obj: {},
                            T: eye.top,
                            R: nose + eye.right,
                            B: eye.bottom,
                            L: nose + eye.left
                        },
                    eyeR2: {
                            obj: {},
                            T: eye.top,
                            R: nose + eye.left,
                            B: eye.bottom,
                            L: nose + eye.right 
                        },
                    mouth: {
                                obj: {},
                                T: center.y + (radius/2),
                                R: nose + eye.left,
                                B: center.y + (radius/2),
                                L: nose - eye.left
                            } 
                }


    //Onload function is where all canvas drawings are initialized
    window.onload=function() {  
        paper.setup('myCanvas');

        //Initialize and Draw stand
        for(var part in stand)
        {
            switch (part)
            {
                case 'base':
                    stand[part].obj = new Path.Rectangle(new Rectangle ({
                                                                            x: stand.base.L,
                                                                            y: stand.base.T,
                                                                            width: stand.base.W,
                                                                            height: stand.base.H 
                                                                        }));
                    break;
                default:
                    stand[part].obj = new Path(new Point(stand[part].L, stand[part].B),
                                                new Point(stand[part].R, stand[part].T));
                    break;
            }
            stand[part].obj.strokeColor = 'black';
            stand[part].obj.strokeWidth = 6;
        }
        
        //Initailize hangman
        for (var part in stickMan)
        {
            switch (part)
            {
                case 'parts':
                    break;
                case 'head':
                    stickMan[part].obj = new Path.Circle(new Point(center.x, center.y), radius);
                    stickMan[part].obj.strokeWidth = 3; 
                    break;
                default: 
                    stickMan[part].obj = new Path(new Point(stickMan[part].L, stickMan[part].T),
                                                    new Point(stickMan[part].R, stickMan[part].B));
                    stickMan[part].obj.strokeWidth = 3;                         
                    break;
            }                               
        }
    }       

    //Define Game Object
    var game = {
        abc: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        wordBank: ['basketball', 'volleyball', 'athlete', 'game', 'football', 'soccer', 'team', 'coach',
                    'foul', 'scholarship', 'contract', 'referee', 'tennis', 'olympics', 'raquetball', 
                    'squash', 'baseball', 'softball', 'opponent', 'championship', 'trophy', 'captain',
                    'cheerleader', 'mascot', 'winner', 'recruit', 'sideline', 'benchwarmer', 'plays',
                    'score', 'surfboard', 'frisbee', 'jockey', 'track', 'marathon', 'golf', 'rivalry',
                    'swim', 'run', 'throw', 'homerun', 'medal', 'uniform', 'halftime', 'contest', 'meet',
                    'race', 'competition', "hockey", "ski", "cyclist"
                    ],
        getWord: function() {
            var newWord = "";
            // check that all words haven't been guessed correctly

            //make sure word hasn't been used yet
            do {
                newWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)]
            }
            while(this.usedWords.indexOf(newWord)!=-1);
            
            //set up game        
            this.keyWord.value = newWord;
            this.keyWord.letters = newWord.split('');
            this.revealWord();
        }, 
        keyWord: {
                    value:"",
                    letters:[]
                    },
        guess: {
                    letter:"",
                    word:""
                },
        usedWords: [],
        usedLetters:{
                        right:[],
                        wrong:[]
                    },
        status: "guess",
        movesLeft: 0,
        winCount: 0,
        lossCount: 0,
        isInArray: function (arr, str = this.guess.letter) {
            return arr.indexOf(str) > -1;
        },
        isNewGuess: function () {
            var chk1 = this.isInArray (this.usedLetters.right);
            var chk2 = this.isInArray (this.usedLetters.wrong);
            //if in neither array then true
            return (!chk1 && !chk2);
        },
        guessLetter: function(str) {
            this.guess.letter = str;
            if (this.isInArray(this.abc)) //Check if the key pressed is a letter
            {
                var correct = this.isInArray(this.keyWord.letters);
                var newGuess = this.isNewGuess();
                var action = correct?'right':'wrong';

                if (newGuess)
                {
                    this.usedLetters[action].push(this.guess.letter);
                    if (correct) 
                    {
                        this.revealWord();
                    } 
                    else 
                    {
                        this.drawStickMan();
                        this.movesLeft --;  
                        $('#wrongLetters').text(this.usedLetters.wrong.join(', '));                                                      
                    } 
                    
                    this.winStatus();
                    
                    switch (this.status)
                    {
                        case "win":
                            this.winCount++
                            //Add word to used list
                            this.usedWords.push(this.keyWord.value);
                            //tell user they've won and ask if they want to play again
                            $('#modalTitle').text('Game Over');
                            $('#modalMessage').html('<p>Congratulations You Won!</p>' +
                                                    '<p>Would you like to play another game?</p>');
                            $('#gameOverModal').modal('show');                                
                            break;

                        case "lose":
                            this.lossCount++
                            //tell user they've lost see if they want to play again
                            $('#modalTitle').text('Game Over');
                            $('#modalMessage').html('<p>Better luck next time!</p>' +
                                                    '<p>Would you like to play another game?</p>');
                            $('#gameOverModal').modal('show');
                            break;
                        default:
                            break;
                    }

                }
            }
            else
            {
                var msg = "Did not press a letter!"
            }
        },
        revealWord: function(){
            var str = "",
                chk = "";

            $.each(game.keyWord.letters, function(key, value) {
                str += (game.isInArray(game.usedLetters.right, value) ? value : '_') + ' ';
            });

            $('#keyWord').text(str.trim());

            this.guess.word = str.replace(/\s+/g, '');//clear blank spaces                
        },
        drawStickMan: function() {
            var part = stickMan.parts[9 - this.movesLeft];
            //need to handle differently for eyes
            switch (part)
            {
                case 'eyeL':
                case 'eyeR':
                    stickMan[part+'1'].obj.strokeColor = 'black';
                    stickMan[part+'2'].obj.strokeColor = 'black';
                    break;
                default:
                    stickMan[part].obj.strokeColor = 'black';   
            } 
        },
        eraseStickMan: function() {
            $.each(stickMan, function (index, part) {
                if (index != 'parts') stickMan[index].obj.strokeColor = 'white'; 
            });
        },
        winStatus: function() {
            if (this.guess.word === this.keyWord.value)//win game
            {
                this.status = "win";
            }
            else if (this.movesLeft === 0) //lose game
            {
                this.status = "lose";
            }
            else
            {
                this.status = "guess";
            }
                
        },
        playAgain: function() {
            game.newGame();
            $('#gameOverModal').modal('hide');                
        },
        exit: function() {
            $('#winCount').text(this.winCount);
            $('#lossCount').text(this.lossCount);
            $('#gameOverModal').modal('hide');
        },
        newGame: function() {                
            this.guess.letter = "";
            this.guess.word = "";
            this.usedLetters.right = [];
            this.usedLetters.wrong = [];                
            $('#wrongLetters').text('');
            this.movesLeft = 9;
            this.status = "guess";
            this.eraseStickMan();
            this.getWord();
            $('#winCount').text(this.winCount);
            $('#lossCount').text(this.lossCount);
        }            
    }

    $('#play').on('click',game.playAgain);
    $('#exit').on('click',game.exit);

    $('#gameOverModal').modal('hide');
    game.newGame();
    document.onkeyup = function(event) 
    {
        game.guessLetter(event.key);
    }
});