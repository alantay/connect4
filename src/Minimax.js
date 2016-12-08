function minimax(boardState,isRed, depth){
	let possibleMoves = findPossibleMoves(boardState);	
	
	let bestMove = null;
	if(possibleMoves.length == 0) {
		return {bestMove:null};
	}

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

export default minimax;