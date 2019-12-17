import React from 'react';
import UserList from './UserList'
import './App.css';

function App() {
  function Nav() {

    return (<nav className="nav">
      <h2>Rest NoSQL database <span>777 Casino</span></h2>
    </nav>)

  }
  return (

    <div className="main">
      <Nav/>
      <UserList/>
    </div>

  );
}

export default App;
