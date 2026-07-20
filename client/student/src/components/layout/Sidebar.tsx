import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <span className="sidebar-icon">📅</span>
            <span>יומן</span>
          </NavLink>

          <NavLink
            to="/my-data"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <span className="sidebar-icon">👤</span>
            <span>הנתונים שלי</span>
          </NavLink>

          <NavLink
            to="/tests"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <span className="sidebar-icon">📝</span>
            <span>מבחנים</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};
