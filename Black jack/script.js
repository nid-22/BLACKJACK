
let blackjackgame ={
    'you':{'yourspan':"#your-card-score" , 'div':'.your-box', 'score':0},
    'dealer':{'yourspan':"#dealer-card-score" , 'div':'.bot-box', 'score':0},
    'allcards':['2','3','4','5','6', '7','8','9','10','A','J','K','Q'],
    'cardsvalue':{'2': 2,'3':3 ,'4': 4,'5': 5,'6': 6, '7': 7,'8': 8,'9':9,'10': 10,'A':[1,11],'J':10,'K':12,'Q':11},
    'wins':0,
    'losses':0,
    'draws':0,
    'isstand': false,
    'turnsover':true
};

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']
const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const lostsound = new Audio('sounds/aww.mp3');



//buttons
document.querySelector('#hit').addEventListener('click', blackjackhit);
document.querySelector('#deal').addEventListener('click', blackjackdeal);
document.querySelector('#stand').addEventListener('click', blackjackstand);


//functions
function ramdomnumber(){
    let num = Math.floor(Math.random()*13);
    return blackjackgame['allcards'][num];
    
}
//GAMELOGIC function
function blackjackhit(){
    if(blackjackgame['isstand']== false){
        var card = ramdomnumber();
        console.log(card);
        showcard(YOU,card);
        updatescore(YOU, card)
        showscore(YOU);

        if(YOU['score']>21){
            blackjackgame['losses']++;
            document.getElementById('losses').textContent = blackjackgame['losses'];
            message = 'YOU LOST!';
            messagecolor = 'red';
            lostsound.play();
            document.getElementById('titlemessage').textContent = message;
            document.getElementById('titlemessage').style.color = messagecolor;
            blackjackgame['turnsover'] = true
        }else if(YOU['score']===21){
            blackjackgame['wins']++;
            document.getElementById('wins').textContent = blackjackgame['wins'];
            message = 'YOU WON!';
            messagecolor = 'green';
            winsound.play();
            document.getElementById('titlemessage').textContent = message;
            document.getElementById('titlemessage').style.color = messagecolor;
            blackjackgame['turnsover'] = true
        }
        
    }
    
}
//GAMELOGIC function
function blackjackstand(){
    dealerlogic()
}



function showcard(activeplayer, card){
    if (activeplayer['score']<=21){
        let cardimage = document.createElement('img');
        cardimage.src = 'images/' + card +'.png';
        cardimage.style.height = '130px';
        cardimage.style.width = '100px';
        cardimage.style.padding = '5px';
        document.querySelector(activeplayer['div']).appendChild(cardimage);
        hitsound.play();
        

    }
    
}
//GAMELOGIC function
function blackjackdeal(){
    if(blackjackgame['turnsover'] === true){

        blackjackgame['isstand'] = false;

        let yourimages = document.querySelector('.your-box').querySelectorAll('img');
        for(i=0;i<yourimages.length;i++){
            yourimages[i].remove()
        };
        let dealerimages = document.querySelector('.bot-box').querySelectorAll('img');
        for(i=0;i<dealerimages.length;i++){
            dealerimages[i].remove()
        };
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.getElementById("your-card-score").textContent = 0;
        document.getElementById("your-card-score").style.color = 'white';
        document.getElementById("dealer-card-score").textContent  = 0;
        document.getElementById("dealer-card-score").style.color = 'white';
        document.getElementById("titlemessage").textContent = 'Lets Play!!';
        document.getElementById("titlemessage").style.color = 'black';

        blackjackgame['turnsover'] = false;
    }
}

//SCORES
function updatescore(activeplayer, card){
    //ace....if adding 11 keeps me below 21 then add 11, else add 1
    if (card ==='A'){
        if (activeplayer['score'] + 11 <=21){
            activeplayer['score'] += 11;
        }else{
            activeplayer['score'] += 1;
        }
    }else{
        activeplayer['score'] += blackjackgame['cardsvalue'][card];
    }
    
};

function showscore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['yourspan']).innerHTML = 'BUST!';
        document.querySelector(activeplayer['yourspan']).style.color = 'red';
    }else{
        document.querySelector(activeplayer['yourspan']).innerHTML = activeplayer['score'];
    }
    
}

//function to time the dealers cards
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

//making a asynchronous function
async function dealerlogic(){
    blackjackgame['isstand'] = true;

    while(blackjackgame['isstand'] = true && DEALER['score'] < 17){
        var card = ramdomnumber();
        showcard(DEALER,card);
        updatescore(DEALER, card);
        showscore(DEALER);
        await sleep(1000)
    }
    blackjackgame['turnsover'] = true;
    showwinner(decidewinner());
}

function decidewinner(){
    let winner;
    if(YOU['score'] <= 21){
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackgame['wins']++;
            winner = YOU;
            
        }else if(YOU['score'] < DEALER['score'] ){
            blackjackgame['losses']++;
            winner = DEALER;
            
        }else if(YOU['score'] == DEALER['score'] ){
            blackjackgame['draws']++;
        }
    }else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        
        winner = DEALER;
        blackjackgame['losses']++;
        
    }else if(DEALER['score'] > 21 && YOU['score'] > 21){

        blackjackgame['draws']++;
    }
    

    console.log('winner is', winner);
    console.log(blackjackgame);
    return winner;
    
}

function showwinner(winner){
    if(blackjackgame['turnsover'] === true){
        let message,messagecolor;
        if(winner == YOU){
            message = 'YOU WIN!!!';
            messagecolor = 'green';
            winsound.play();
            document.getElementById('wins').textContent = blackjackgame['wins'];
        }else if(winner == DEALER){
            message = 'YOU LOST!';
            messagecolor = 'red';
            lostsound.play();
            document.getElementById('losses').textContent = blackjackgame['losses'];

        }else{  
            message = 'YOU DREW!';
            messagecolor = 'yellow';
            document.getElementById('draws').textContent = blackjackgame['draws'];
        }
        document.getElementById('titlemessage').textContent = message;
        document.getElementById('titlemessage').style.color = messagecolor;
    }
}