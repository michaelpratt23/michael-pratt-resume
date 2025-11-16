import React from 'react'
import Nav from './components/Nav'
import AboutMe from './components/AboutMe'
import Thoughts from './components/Thoughts'
import './App.css'

function App() {
  return (
    <div className="App">
      <Nav />
      <main>
        <AboutMe />
        <Thoughts />
      </main>
    </div>
  )
}

export default App

