import React from 'react';
import minimax from './Minimax'
import lines from './Line'


const aiStartStr = [
    "My puny brain cannot handle this, AI go first.",
    "I'm having a existential crisis. AI can start first.",
    "Let AI go first, I'm gonna lose either way.",
    "Sir... me skurdd...Sir you go first..."
];

const aiWin = [
    "Evolution does not apply for your brain I guess.",
    "Sorry for your caveman intelligence. Go hunting yo.",
    "Dumbarse! You might want to go get your IQ tested.",
    "LOL. NOOB! EASY GAME."
];

const aiDraw = [
    "Yea this is the furthest you can go. A draw.",
    "Next time, try winning... you wouldn't cut it with a draw.",
    "You couldn't even win an AI built with just a few line of codes?"
];

const aiLose = [
    "You just got lucky. I wasn't even trying.",
    "Yea you win... big deal? Fight me again!",
    "You didn't Win, I let you win to save you from self-pity."
];

const aiTurn = [
    "My turn. Let me see....",
    "My turn. Hmmm...how do I make a fool of you...."
]

const playerTurn = [
    "It's your turn weakling.",
    "Your turn. Make it quick Human",
    "Stop dreaming and make your move."
]

let status = '';
const disableAI = false;

function Square(props){
    return(
        <div className= {props.className} data-row={props.row} data-col={props.col} 
            onClick={()=>props.onClick()} onMouseEnter={()=> props.onMouseEnter()}>
            <img src="./assets/img/slot.svg" alt=""/>
            <Coin></Coin>
        </div>
    );
}

function Coin(props){
    return(
        <div className="coin animated bounceInDown"></div>
    );
}

function Board(props){
    let squares =[];
    let boardState = props.boardState;
    let winningPieces = props.winningPieces;
    
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < 7; col++){
            
            let className = (boardState[row][col])? "square " + boardState[row][col].filled: "square ";
            if(winningPieces){
                for(let p = 0; p<winningPieces.length; p++){
                    let wp = winningPieces[p];
                    if(wp.r == row && wp.c == col){
                        className += ' win';
                    }
                }  
            }

            squares.push(<Square row={row} col={col}
                className={className} 
                onMouseEnter={()=> props.onMouseEnter(row,col)} 
                onClick={()=>props.onClick(row,col)}/>);
        }            
    }
    
    return(
        <div className="board">
        {squares} 
        </div>
    )
}

function coin(props){
    return(
        <div className="coin"></div>
    )
}

function createEmptyBoard(){

}

class Connect4 extends React.Component{
    constructor() {
        super();
        
        this.state = {
            history: [{
                boardState: this.createEmptyBoard()
            }],
            redIsNext: true,
            stepNumber: 0,
            gameOver: false,
            winningPieces: null
        };
    }

    createEmptyBoard(){
        const mArr = [];        
        for(let row = 0;row < 6; row++){
            mArr.push([])
            for(let col = 0; col < 7; col++){
                mArr[row].push(null);
            }
        }
        return mArr;
    }

    handleMouseEnter(r,c){

    }

    handleClick(r,c){
        if(!this.state.redIsNext && !disableAI) return
        if(this.state.gameOver) return;

        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].boardState
        let row = r
        let col = c
        let lastEmptyRow = null

        // get the last empty slot on column. So the coin will slide to the bottom
        for(let rowCount = 0; rowCount<6; rowCount++){
            if(!boardState[rowCount][col])
                lastEmptyRow = rowCount
            else
                break;
            
        }

        if(lastEmptyRow != null) this.makeMove(lastEmptyRow,c)
        
    }
    
    makeMove(r,c){
        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].boardState
        let gameOver = false;
        boardState[r][c]={filled:this.state.redIsNext?'red':'yellow'}
        // check if game
        const checkWinHolder = this.checkWin(boardState);
        if(checkWinHolder){
            gameOver = true;
        }

        this.setState({
            history: history.concat({boardState}),
            stepNumber: stepNumber + 1,
            redIsNext: !this.state.redIsNext,
            gameOver: gameOver,
            winningPieces : gameOver? checkWinHolder:this.state.winningPieces
        });
      

       gameOver || disableAI || this.aiTurn()
    }
    aiTurn(){
        
        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].boardState
        let gameOver = false;
        status = aiTurn[Math.floor(Math.random() * aiTurn.length)];

        setTimeout(()=> {
            const result = minimax(boardState,false,6, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const bestMove = result.bestMove;

            status = playerTurn[Math.floor(Math.random() * playerTurn.length)];
            boardState[bestMove.r][bestMove.c]= {filled:"yellow"};
            
            const checkWinHolder = this.checkWin(boardState);
            if(checkWinHolder){
                gameOver = true;
            }
           
            this.setState({
                history: history.concat([{
                    boardState
                }]),
                redIsNext: true,
                stepNumber: stepNumber + 1,
                gameOver: gameOver,
                winningPieces : gameOver? checkWinHolder:this.state.winningPieces
            })
        },0);
        
    }

    checkWin(boardState){
        // Check lines
        for(let d=0;d < lines.length; d++){
            let redSeq = null;
            let yellowSeq = null;
            let previousSeq = null;
            let lineSeq = lines[d];
            let yellowPieces = [];
            let redPieces = [];
            for(let s=0; s<lineSeq.length;s++){
                let row = lineSeq[s].r;
                let col = lineSeq[s].c;
                
                if(boardState[row][col] == null){
                    redSeq = 0;
                    yellowSeq = 0;
                    yellowPieces=[];
                    redPieces = [];
                    continue;
                }
                if(boardState[row][col].filled == 'red'){
                    yellowSeq = 0;
                    yellowPieces = []
                    previousSeq = 'red';
                    redPieces.push({r:row, c:col})
                    redSeq++;
                }
                if(boardState[row][col].filled == 'yellow'){
                    redSeq = 0;
                    redPieces = []
                    previousSeq = 'yellow'
                    yellowPieces.push({r:row, c:col})
                    yellowSeq++;
                }
                if(yellowPieces.length == 4 || redPieces.length == 4){
                    // console.log(yellowPieces,redPieces)

                    return (yellowPieces.length>0)? yellowPieces : redPieces;
                }
            }
        }
        return false;
    }

    resetGame(){
        status = '';
        this.setState({
            history: [{
                boardState: this.createEmptyBoard()
            }],
            redIsNext: true,
            stepNumber: 0,
            gameOver: false,
            winningPieces: null
        });

    }

    render(){
        const history = this.state.history
        const stepNumber =  this.state.stepNumber
        const boardState = history[stepNumber].boardState;
        const gameOver = this.state.gameOver;
        
        if(gameOver){
            // status = 'Game Over';
            if(this.state.redIsNext) 
                status = aiWin[Math.floor(Math.random() * aiWin.length)];
            else
                status = aiLose[Math.floor(Math.random() * aiLose.length)];
        }

        return(
            <div>
                <Board boardState= {boardState} winningPieces={this.state.winningPieces} onMouseEnter= {(r,c)=> this.handleMouseEnter(r,c)} onClick = {(r,c) => this.handleClick(r,c)}/>
                <div className="status">{status}</div>
                <button className={(history.length>1)?"hide":""} role="button" type="button" onClick={()=>this.aiTurn()}>
                    {aiStartStr[Math.floor(Math.random() * aiStartStr.length)]}
                </button>
                <button className={(history.length>1)?"":"hide"} role="button" type="button" onClick={()=>this.resetGame()}>Reset</button>
            </div>

        )
    }
}


export default Connect4;