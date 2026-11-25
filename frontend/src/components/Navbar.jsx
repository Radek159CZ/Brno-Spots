export default function Navbar({ isSidebarOpen, onToggleSidebar }) {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Hide place list' : 'Show place list'}
          aria-expanded={isSidebarOpen}
        >
          ☰
        </button>
        <span className="navbar-logo-mark" />
        <span className="navbar-logo-text">Brno Spots</span>
      </div>

      <div className="navbar-actions">
        <button type="button" className="btn btn-primary">
          + Add place
        </button>
        <div className="avatar">R</div>
      </div>
    </header>
  )
}
