
var minesCount = 1;
var minesLocation = [];
var rows = 8;
var cols = 8;
var board = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;



window.onload=function(){
    startGame();
    flag_button_listen();
}

function flag_button_listen(){
    document.getElementById('flag-button').addEventListener('click',function(){
        flagEnabled = 1-flagEnabled;
        this.style.backgroundColor = flagEnabled?'darkgray':'white';
    })
}

function setMines(){
    // minesLocation.push('2-2');
    // minesLocation.push('2-3');
    // minesLocation.push('3-4');
    // minesLocation.push('1-1');
    // minesLocation.push('5-6');
    let minesLeft = minesCount;
    while(minesLeft>0){
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*cols);
        let coords = r+'-'+c;
        if(!minesLocation.includes(coords)){
            minesLocation.push(coords);
            minesLeft-=1;
        }

    }

    document.getElementById('start').addEventListener('click',()=>{
        minesLocation = [];
        gameOver=false;
        tilesClicked = 0;
        board = [];
        document.getElementById('board').innerHTML = '';
        minesCount = parseInt(totalMineCount.value);
        log.innerHTML = minesCount;
        startGame();

    })



}


function startGame(){
    document.getElementById('mines-count').innerText=minesCount;
    setMines();


    for(let i=0;i<rows;i++){
        let row = [];
        for(let j=0;j<cols;j++){
            let div = document.createElement('div');
            div.id = i+'-'+j;
            div.addEventListener('click',clickTile);
            row.push(div);
            document.getElementById('board').append(div);
        }
        board.push(row);
    }



}

function clickTile(){
    if(gameOver || this.classList.contains('tile-clicked')){
        return;
    }
    let tile = this;
    if(flagEnabled){
        if(tile.innerText==''){
            tile.innerText = '🚩';
        }else if(tile.innerText=='🚩'){
            tile.innerText = '';
        }
        return;
    }

    if(minesLocation.includes(tile.id)){
        log.innerHTML='game over';
        gameOver=true;
        revealMines();
        return;
    }

    let coords = tile.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r,c);


}

function checkMine(r,c){
    if(r<0 || r>=rows || c<0 || c>=cols){
        return;
    }
    let tile = board[r][c];
    if(tile.classList.contains('tile-clicked')){
        return;
    }
    tile.classList.add('tile-clicked');
    tilesClicked += 1;
    log.innerText = tilesClicked;

    let minesFound = 0;
    minesFound += checkTile(r-1,c-1);
    minesFound += checkTile(r-1,c);
    minesFound += checkTile(r-1,c+1);

    minesFound += checkTile(r,c-1);
    minesFound += checkTile(r,c+1);

    minesFound += checkTile(r+1,c-1);
    minesFound += checkTile(r+1,c);
    minesFound += checkTile(r+1,c+1);

    if(minesFound>0){
        tile.innerText = minesFound;
        tile.classList.add('x'+minesFound);
        tile.classList.add('tile-clicked');
    }else{
        checkMine(r-1,c-1);
        checkMine(r-1,c);
        checkMine(r-1,c+1);

        checkMine(r,c-1);
        checkMine(r,c+1);

        checkMine(r+1,c-1);
        checkMine(r+1,c);
        checkMine(r+1,c+1);

    }

    if(tilesClicked==rows*cols-minesCount){
        log.innerHTML = 'win';
        document.getElementById('mines-count').innerText = 'cleared';
        gameOver = true;
    }

}

function checkTile(r,c){
    return minesLocation.includes(r+'-'+c)?1:0;
}

function revealMines(){
    for(let row of board){
        for(let tile of row){
            if(minesLocation.includes(tile.id)){
                tile.innerText = '💣';
                tile.style.backgroundColor = 'red';
            }
        }
    }
}