
export default function Navbar({ darkMode, onToggleDarkMode }) {
  return (
    <header className="navbar">
      <a href="#" className="brand">
        <span className="brand-icon">♨</span>
        <span>Recipe<span className="brand-accent">ly</span></span>
      </a>

      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#recipes">Explore Recipes</a>
        <a href="#recipes">Categories</a>
      </nav>

      <button
        className="theme-toggle"
        onClick={onToggleDarkMode}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
        <span>{darkMode ? "Light mode" : "Dark mode"}</span>
      </button>
    </header>
  );
}
