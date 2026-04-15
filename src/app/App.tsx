import { useState } from 'react'
import './App.css'
import { Header, MainBox, Sidebar } from './layout'

function App() {
  const [activePath, setActivePath] = useState('/home')

  return (
    <section className="app">
      <Header className="header-position" />

      <div className="body">
        <Sidebar
          activePath={activePath}
          className="sidebar-position"
          onNavigate={setActivePath}
        />
        <MainBox activePath={activePath} className="main-box-position" />
      </div>
    </section>
  )
}

export default App