import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';
import TestPage from '../../pages/TestPage';
import MainPage from '../../pages/MainPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <h1>Production Prototype</h1>
        <Switch>
          <Route exact path="/" component={MainPage} ></Route>
          <Route exact path="/test" component={TestPage} ></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
