import React from 'react';

function Square(props){
    return(
        <button className="square" onClick={()=>props.onClick()}>
            {props.value}
        </button>
    );
}

class test extends React.Component{
    render(){
    //    return(
            <div>testy</div>
      //  )
    }
}

class Connect4 extends React.Component{
    render(){
        return(
            <div>
            <Square value="aaa"/>
            <test></test>
            </div>

        )
    }
}


export default Connect4;