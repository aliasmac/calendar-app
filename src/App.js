import React from "react";

import Calendar from "./components/Calendar";
import "./App.css";

class App extends React.Component {

  state = {
    isLoadingComplete: false
  }


  render() {
    return (
      <div className="App">
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              react<b>calendar</b>
            </span>
          </div>
        </header>
        <main>
          
            <div className="info-section">
              <span className="key-color"></span>
              <span>Booked - Click on date to book/unbook the date</span>
            </div>
          
          <Calendar />
        </main>
      </div>
    );
  }
}

export default App;