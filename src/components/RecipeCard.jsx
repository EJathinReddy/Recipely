
export default function RecipeCard({ recipe, onClick }) {
  return (
    <article className="recipe-card">
      <button
        className="recipe-image-button"
        onClick={onClick}
        aria-label={`View ${recipe.strMeal} recipe`}
      >
        <img
          className="recipe-image"
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
        />
        <span className="image-badge">
          {recipe.strCategory || "Recipe"}
        </span>
      </button>

      <div className="recipe-card-content">
        <div className="recipe-meta">
          <span>🍽️ {recipe.strArea || "World cuisine"}</span>
          <span>✦ Recipe</span>
        </div>

        <h3>{recipe.strMeal}</h3>

        <div className="recipe-card-footer">
          <span className="recipe-subtitle">
            Ready for something delicious?
          </span>
          <button
            className="view-recipe-button"
            onClick={onClick}
            aria-label={`Open ${recipe.strMeal}`}
          >
            →
          </button>
        </div>
      </div>
    </article>
  );
}
