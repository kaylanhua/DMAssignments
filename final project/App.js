// import React, { Component } from 'react';
// import './App.css';
// import DormsMatches from './stats/DormsMatches';
// import DormsChordDiagram from './stats/DormsChordDiagram';
//
// class App extends Component {
//   render() {
//     return (
//         <div className="PageStats">
//             <div className="dorms-match-chord">
//                 <DormsChordDiagram />
//             </div>
//       </div>
//     )
//   }
// }
//
// export default App;

import React, { Component } from 'react';
import './App.css';
import DormsMatches from './stats/DormsMatches';
import DormsChordDiagram from './stats/DormsChordDiagram';
import WordFreq from './stats/WordFreq';
import Answers from './stats/Answers';
import SearchMatch from './stats/SearchMatch';
import Hometowns from './stats/Hometowns';
import Spotify from './stats/Spotify';

class App extends Component {
    render() {
        return (
            <div className="PageStats">
                {/*<div>*/}
                {/*    <Hometowns />*/}
                {/*    <Spotify />*/}
                {/*</div>*/}
                {/*<div className="answers-stats">*/}
                {/*    <Answers college={"Harvard"} />*/}
                {/*</div>*/}
                {/*<div className="search-matches-stats">*/}
                {/*    <SearchMatch />*/}
                {/*</div>*/}
                <div className="dorms-match-stats">
                    <DormsMatches />
                </div>
                <div className="dorms-match-chord-stats">
                    <DormsChordDiagram />
                </div>
                {/*<div className="word-freq-stats">*/}
                {/*    <WordFreq />*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default App;
