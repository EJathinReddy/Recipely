
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import "./styles.css";

const API = "https://www.themealdb.com/api/json/v1/1";

const categories = [
  "All", "Chicken", "Beef", "Seafood", "Vegetarian",
  "Pasta", "Dessert", "Breakfast", "Starter", "Vegan"
];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [exploreAll, setExploreAll] = useState(false);
  const requestId = useRef(0);

  async function fetchRecipes(search = "", selectedCategory = "All") {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");
    setRecipes([]);
    setVisibleCount(12);

    try {
      let url;

      if (search.trim()) {
        url = `${API}/search.php?s=${encodeURIComponent(search.trim())}`;
      } else if (selectedCategory !== "All") {
        url = `${API}/filter.php?c=${encodeURIComponent(selectedCategory)}`;
      } else {
        url = `${API}/search.php?s=`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to connect to the recipe service.");
      }

      const data = await response.json();
      let meals = data.meals || [];

      // The free API provides complete details for name searches,
      // but category filters return only IDs, names and thumbnails.
      if (
        selectedCategory !== "All" &&
        !search.trim() &&
        meals.length
      ) {
        meals = await Promise.all(
          meals.slice(0, 24).map(async (meal) => {
            try {
              const result = await fetch(
                `${API}/lookup.php?i=${meal.idMeal}`
              );
              const detail = await result.json();
              return detail.meals?.[0] || meal;
            } catch {
              return meal;
            }
          })
        );
      }

      if (currentRequest !== requestId.current) return;

      setRecipes(meals);
      if (!meals.length) {
        setError("No recipes found. Try another search or category.");
      }
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  function handleSearch(value) {
    setQuery(value);
    setCategory("All");
    setExploreAll(false);
    fetchRecipes(value, "All");
  }

  function handleCategory(value) {
    setCategory(value);
    setQuery("");
    setExploreAll(false);
    fetchRecipes("", value);
  }

  async function openRecipe(recipe) {
    setSelectedRecipe(recipe);

    // Load full recipe details when opening a card.
    try {
      const response = await fetch(
        `${API}/lookup.php?i=${recipe.idMeal}`
      );
      const data = await response.json();
      if (data.meals?.[0]) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch {
      // Keep the card information available if details fail to load.
    }
  }

  const visibleRecipes = exploreAll
    ? recipes
    : recipes.slice(0, visibleCount);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
      />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">✦ YOUR DAILY FOOD INSPIRATION</span>
            <h1>
              Find your next
              <br />
              <span>favorite recipe.</span>
            </h1>
            <p>
              Discover delicious dishes, explore new flavors,
              and bring something special to your table.
            </p>

            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
            />

            <div className="hero-note">
              <span>✓ Easy recipes</span>
              <span>✓ Step-by-step instructions</span>
              <span>✓ Free to explore</span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
              alt="Fresh colorful food bowl"
            />
            <div className="floating-label">
              <span>🍲</span>
              <div>
                <strong>Made with love</strong>
                <small>Something delicious awaits</small>
              </div>
            </div>
          </div>
        </section>

        <section className="recipe-section" id="recipes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE & ENJOY</span>
              <h2>What are you craving?</h2>
              <p>Choose a category and find your next meal.</p>
            </div>
            <span className="recipe-count">
              {loading ? "Finding recipes..." : `${recipes.length} recipes`}
            </span>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-chip ${
                  category === item ? "active" : ""
                }`}
                onClick={() => handleCategory(item)}
              >
                {item === "All" ? "✨" : ""}
                {item}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage
              message={error}
              onRetry={() => fetchRecipes(query, category)}
            />
          ) : (
            <>
              <div className="recipe-grid">
                {visibleRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={recipe}
                    onClick={() => openRecipe(recipe)}
                  />
                ))}
              </div>

              {recipes.length > 0 && (
                <div className="show-more-container">
                  {recipes.length > visibleCount && !exploreAll && (
                    <button
                      className="primary-button"
                      onClick={() =>
                        setVisibleCount((count) => count + 12)
                      }
                    >
                      Show More <span>↓</span>
                    </button>
                  )}

                  {!exploreAll && (
                    <button
                      className="secondary-button"
                      onClick={() => setExploreAll(true)}
                    >
                      Explore All Recipes →
                    </button>
                  )}

                  {exploreAll && (
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setExploreAll(false);
                        setVisibleCount(12);
                      }}
                    >
                      Show Less ↑
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <section className="bottom-banner">
          <div>
            <span className="eyebrow">A LITTLE INSPIRATION</span>
            <h2>Good food brings people together.</h2>
            <p>Find a recipe, gather your ingredients, and enjoy cooking.</p>
          </div>
          <span className="banner-emoji">🥑 🍅 🥕</span>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="brand footer-brand">
          <span className="brand-icon">♨</span>
          <span>Recipe<span className="brand-accent">ly</span></span>
        </a>
        <p>Made for food lovers, one recipe at a time.</p>
        <small>
          Recipe data provided by{" "}
          <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">
            TheMealDB
          </a>
        </small>
      </footer>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
