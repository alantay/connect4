import lines from './Line'

const yellowStrSeq = [
	"0111",
	"1011",
	"1101",
	"1110"
]

const redStrSeq = [
	"0222",
	"2022",
	"2202",
	"2220"
]

function minimax(boardState,isRed, depth){
	let possibleMoves = findPossibleMoves(boardState);	
	
	let bestMove = null;
	let bestScore = isRed? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER
	if(possibleMoves.length == 0 || depth == 0 || checkWin(boardState)) {
		// console.log(evalBoard(boardState));
		return {bestMove:null,bestScore: evalBoard(boardState)}
	}

	for(let m=0;m<possibleMoves.length;m++){
		
		if(!isRed){ 
			// yellow's turn
			let row = possibleMoves[m].r;
			let col = possibleMoves[m].c;
			
			let tempSlot = boardState.slice(0);	
			tempSlot[row][col] = {filled:'yellow'}
			let result = minimax(tempSlot, true, depth-1);
			if(result.bestScore > bestScore){
				bestScore = result.bestScore;
				bestMove = {r:row, c:col}
			}	
			tempSlot[row][col] = null;	
		}

		if(isRed){ 
			// red's turn
			let row = possibleMoves[m].r;
			let col = possibleMoves[m].c;
			
			let tempSlot = boardState.slice(0);	
			tempSlot[row][col] = {filled:'red'}
			let result = minimax(tempSlot, false, depth-1);
			if(result.bestScore < bestScore){
				bestScore = result.bestScore;
				bestMove = {r:row, c:col}
			}	
			tempSlot[row][col] = null;	
		}
	}
	
	return { bestMove, bestScore }
}

function findPossibleMoves(boardState){
	let possibleMoves = [];

    for(let col = 0; col < 7; col++){
    	let move = null;
        for(let row = 0; row < 6; row++){
        	if(!boardState[row][col]){
        		move = {r:row, c:col}
        	}
        }
        if(move) possibleMoves.push(move);
    }
    return possibleMoves;
}

function evalBoard(boardState){
	let score = 0;

	for(let l=0;l < lines.length; l++){
        let redSeq = null;
        let yellowSeq = null;
        let previousSeq = null;
        let lineSeq = lines[l];
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
            if(yellowSeq == 4){
            	score = 1000;
            }
            if(redSeq == 4){
                score = -1000;
            }

            if(yellowSeq == 4 || redSeq == 4){
            	//return score;
            }
        }
    }	
	
	//convert to string
	for(let l=0;l < lines.length; l++){
		let lineSeq = lines[l]
		let toStr = ''
		for(let s=0; s<lineSeq.length;s++){
			let row = lineSeq[s].r;
            let col = lineSeq[s].c;
            if(boardState[row][col] == null){
				toStr += '0';
            }
            else if(boardState[row][col].filled == 'yellow'){
				toStr += '1';
            }
            else if(boardState[row][col].filled == 'red'){
				toStr += '2';
            }
		}

		//check yellow
		for(let y=0; y < yellowStrSeq.length; y++){
			if(toStr.search(yellowStrSeq[y]) > -1){
				score += 100;
			}
		}

		//check red
		for(let r=0; r < redStrSeq.length; r++){
			if(toStr.search(redStrSeq[r]) > -1){
				score -= 100;
			}
		}
	}
	


	return score;
}

function checkWin(boardState){
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

export default minimax;