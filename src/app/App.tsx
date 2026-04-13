import './App.css'
import { Header, MainBox, Sidebar } from './layout'

function App() {
  return (
    <section className="app">
      <Header className="header-position" />

      <div className="body">
        <Sidebar className="sidebar-position" />
        <MainBox className="main-box-position" />
      </div>
    </section>
  )
}

export default App