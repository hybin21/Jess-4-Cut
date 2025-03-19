import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import "./index.css"
import Main from "./components/main.jsx"
import PhotoGenerate from "./components/PhotoGenerate.jsx";

const App = () => {
    return (
        <Router basename="/Jess-4-Cut">
            <Routes>
                <Route path = "/" element = {<Main/>}/>
                <Route path = "/photo" element = {<PhotoGenerate/>}/>
            </Routes>
        </Router>
    )
}
export default App
