import React from 'react';
import Game from './Game';
class App extends React.Component {
    render() {
        return(
            <div>
                <h1>Snake Game</h1>
                <Game rows={25} cols={25}/>
            </div>
        )
    }
}

export default App;