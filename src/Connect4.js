import React from 'react';
import minimax from './Minimax'
import lines from './Line'

const disableAI = false;
const boardStateArr= [6][7]

function Square(props){
    return(
        <div className= {props.className} data-row={props.row} data-col={props.col} 
            onClick={()=>props.onClick()} onMouseEnter={()=> props.onMouseEnter()}>
        </div>
    );
}


function Board(props){
    let squares =[];
    let boardState = props.boardState;
    
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < 7; col++){
            let className = (boardState[row][col])? "square "+boardState[row][col].filled: "square ";
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
            gameOver: false
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
        if(this.checkWin(boardState)){
            gameOver = true;
        }

        this.setState({
            history: history.concat({boardState}),
            stepNumber: stepNumber + 1,
            redIsNext: !this.state.redIsNext,
            gameOver: gameOver
        });
      

       gameOver || disableAI || this.aiTurn()
    }
    aiTurn(){

        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].boardState
        
        setTimeout(()=> {
            const result = minimax(boardState,false,4);
            const bestMove = result.bestMove;
            // console.log(result);
            boardState[bestMove.r][bestMove.c]= {filled:"yellow"};
           
            this.setState({
                history: history.concat([{
                    boardState
                }]),
                redIsNext: true,
                stepNumber: stepNumber + 1
            })
        },0);
        
    }

    checkWin(boardState){
        // Check lines
        for(let d=0;d < lines.length; d++){
            let redSeq = null;
            let yellowSeq = null;
            let previousSeq = null;
            var lineSeq = lines[d];
            for(let s=0; s<lineSeq.length;s++){
                let row = lineSeq[s].r;
                let col = lineSeq[s].c;
                
                if(boardState[row][col] == null){
                    redSeq = 0;
                    yellowSeq = 0;
                    continue;
                }
                if(boardState[row][col].filled == 'red'){
                    yellowSeq = 0;
                    previousSeq = 'red';
                    redSeq++;
                }
                if(boardState[row][col].filled == 'yellow'){
                    redSeq = 0;
                    previousSeq = 'yellow';
                    yellowSeq++;
                }
                if(redSeq == 4 || yellowSeq == 4){
                    return true;
                }
            }
        }
        return false;
    }

    resetGame(){
        this.setState({
            history: [{
                boardState: this.createEmptyBoard()
            }],
            redIsNext: true,
            stepNumber: 0,
            gameOver: false
        });

    }

    render(){
        const history = this.state.history
        const stepNumber =  this.state.stepNumber
        const boardState = history[stepNumber].boardState;
        const gameOver = this.state.gameOver;
        if(gameOver){
            status = 'Game Over';
        }

        return(
            <div>
                <Board boardState= {boardState} onMouseEnter= {(r,c)=> this.handleMouseEnter(r,c)} onClick = {(r,c) => this.handleClick(r,c)}/>
                <div className="status">{status}</div>
                <button role="button" type="button" onClick={()=>this.resetGame()}>Reset</button>
            </div>

        )
    }
}


export default Connect4;