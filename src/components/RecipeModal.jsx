
import { useEffect } from "react";

export default function RecipeModal({ recipe, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const ingredient = recipe[`strIngredient${number}`]?.trim();
    const measure = recipe[`strMeasure${number}`]?.trim();

    return ingredient
      ? { ingredient, measure: measure || "" }
      : null;
  }).filter(Boolean);

  const instructions = (recipe.strInstructions || "")
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close recipe"
        >
          ×
        </button>

        <img
          className="modal-hero-image"
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <div className="modal-content">
          <div className="modal-tags">
            {recipe.strCategory && (
              <span>{recipe.strCategory}</span>
            )}
            {recipe.strArea && <span>{recipe.strArea} cuisine</span>}
          </div>

          <h2 id="recipe-title">{recipe.strMeal}</h2>

          <p className="modal-description">
            Everything you need to prepare this delicious recipe at home.
          </p>

          {ingredients.length > 0 && (
            <section className="modal-section">
              <h3>🥗 Ingredients</h3>
              <p className="section-hint">
                Check off each ingredient as you prepare.
              </p>

              <ul className="ingredient-list">
                {ingredients.map((item, index) => (
                  <li key={`${item.ingredient}-${index}`}>
                    <label>
                      <input type="checkbox" />
                      <span className="ingredient-name">
                        {item.ingredient}
                      </span>
                      <span className="ingredient-measure">
                        {item.measure}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {instructions.length > 0 && (
            <section className="modal-section">
              <h3>👨‍🍳 Cooking Instructions</h3>

              <ol className="instructions-list">
                {instructions.map((step, index) => (
                  <li key={index}>
                    <span className="step-number">{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {recipe.strYoutube && (
            <a
              className="youtube-button"
              href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
            >
              <span>▶</span>
              Watch on YouTube
              <span className="youtube-arrow">↗</span>
            </a>
          )}

          {recipe.strSource && (
            <a
              className="source-link"
              href={recipe.strSource}
              target="_blank"
              rel="noreferrer"
            >
              View original recipe source ↗
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
