import React from 'react';
import minimax from './Minimax'

const boardStateArr= [6][7]
const diagonals = [
    [{r:0,c:0}, {r:1,c:1},{r:2,c:2},{r:3,c:3},{r:4,c:4},{r:5,c:5}],
    [{r:1,c:0}, {r:2,c:1},{r:3,c:2},{r:4,c:3},{r:5,c:4}],
    [{r:2,c:0}, {r:2,c:1},{r:3,c:2},{r:4,c:3}],

    [{r:0,c:6}, {r:1,c:5},{r:2,c:4},{r:3,c:3},{r:4,c:2},{r:5,c:1}],
    [{r:1,c:6}, {r:2,c:5},{r:3,c:4},{r:4,c:3},{r:5,c:2}],
    [{r:2,c:6}, {r:3,c:5},{r:4,c:4},{r:5,c:3}],
];

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

class Connect4 extends React.Component{
    constructor() {
        super();
        
        const mArr = [];        
        for(let row = 0;row < 6; row++){
            mArr.push([])
            for(let col = 0; col < 7; col++){
                mArr[row].push(null);
            }
        }

        this.state = {
            history: [{
                squares: mArr
            }],
            redIsNext: true,
            stepNumber: 0,
        };
    }

    handleMouseEnter(r,c){

    }

    handleClick(r,c){
       // if(!this.state.redIsNext) return

        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].squares.slice()
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
        const boardState = history[stepNumber].squares.slice()
        boardState[r][c]={filled:this.state.redIsNext?'red':'yellow'}
        this.checkWin(boardState);

        this.setState({
            history: history.concat({squares:boardState}),
            stepNumber: stepNumber + 1,
            redIsNext: !this.state.redIsNext
        });

        this.aiTurn();
    }
    
    aiTurn(){
        const history = this.state.history
        const stepNumber = this.state.stepNumber
        const boardState = history[stepNumber].squares.slice()
        minimax(boardState,false,10);
        setTimeout(()=> {

        })
           
    }

    checkWin(boardState){

        // row check for 4 in a row.
        for(let row = 0;row < 6; row++){
            let redSeq = null;
            let yellowSeq = null;
            let previousSeq = null;
            for(let col = 0; col < 7; col++){

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

        
        // col check for 4 in a col
        for(let col = 0;col < 7; col++){
            let redSeq = null;
            let yellowSeq = null;
            let previousSeq = null;
            for(let row = 0; row < 6; row++){
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

        // Check diagonals
        for(let d=0;d < diagonals.length; d++){
            let redSeq = null;
            let yellowSeq = null;
            let previousSeq = null;
            var diaSeq = diagonals[d];
            for(let s=0; s<diaSeq.length;s++){
                let row = diaSeq[s].r;
                let col = diaSeq[s].c;
                
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

    render(){
        const history = this.state.history
        const stepNumber =  this.state.stepNumber
        const boardState = history[stepNumber].squares.slice();

        const winner = this.checkWin(boardState)
        if(winner){
            status = "Game Over";
        }


        return(
            <div>
                <Board boardState= {boardState} onMouseEnter= {(r,c)=> this.handleMouseEnter(r,c)} onClick = {(r,c) => this.handleClick(r,c)}/>
                <div className="status">{status}</div>
            </div>

        )
    }
}


export default Connect4;