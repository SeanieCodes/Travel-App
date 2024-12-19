import { useState } from 'react'
import './App.css'
import Calendar from './components/Calendar/Calendar'; // Adjust the path based on your folder structure

const App = () => {
    return (
        <div className="App">
            <h1>Travel Planner</h1>
            <Calendar />
        </div>
    );
};

export default App;
