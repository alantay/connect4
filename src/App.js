import React from 'react';
import {render} from 'react-dom';
import Connect4 from './Connect4'

class Game extends React.Component{
    render(){
        return(
            <Connect4></Connect4>
        )   
    }
}

render(<Game/>, document.getElementById('app'));

