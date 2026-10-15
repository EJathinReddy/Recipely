
export default function SearchBar({ value, onChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">⌕</span>

      <input
        type="search"
        placeholder="Search chicken, pasta, dessert..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search recipes"
      />

      {value && (
        <button
          type="button"
          className="clear-search"
          onClick={() => {
            onChange("");
            onSearch("");
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}
