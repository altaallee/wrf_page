import React from 'react';
import './App.css';
import Header from './Header';
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <Header></Header>
            <Outlet />
        </>
    );
}

export default App;
