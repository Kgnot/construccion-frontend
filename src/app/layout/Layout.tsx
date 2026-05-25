import { Outlet } from 'react-router';
import { Header } from "./header/Header";
import { Sidebar } from "./sidebar/Sidebar";
import '../App.css';
import './main_box/MainBox.css';

export function Layout() {
  return (
    <section className="app">
      <Header className="header-position" />

      <div className="body">
        <Sidebar className="sidebar-position" />
        <main className="main-box main-box-position">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
