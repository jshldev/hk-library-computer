// src/components/LibrarySelector.jsx
import "./LibrarySelector.css";

const FilledStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd700">
    <path d="M12 .587l3.668 7.431 8.332 1.209-6.001 5.853 1.415 8.25L12 18.897l-7.414 3.897 1.415-8.25-6.001-5.853 8.332-1.209z" />
  </svg>
);

const EmptyStar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ccc"
    strokeWidth="2"
  >
    <path d="M12 .587l3.668 7.431 8.332 1.209-6.001 5.853 1.415 8.25L12 18.897l-7.414 3.897 1.415-8.25-6.001-5.853 8.332-1.209z" />
  </svg>
);

function LibrarySelector({
  districts,
  selectedDistrict,
  onDistrictChange,
  libraries,
  favoriteLibraries,
  onLibrarySelect,
  favorites,
  toggleFavorite,
  setFavorites,
  showOpenOnly,
  setShowOpenOnly,
  language,
  setLanguage,
  translations,
}) {
  return (
    <div className="library-selector">
      <div className="language-selector">
        <span className="language-label">
          {language === "zh-HK"
            ? "語言"
            : language === "zh-CN"
            ? "语言"
            : "Language"}
          ：
        </span>
        <div className="language-buttons">
          <button
            className={`language-button ${
              language === "zh-HK" ? "active" : ""
            }`}
            onClick={() => setLanguage("zh-HK")}
          >
            繁體中文
          </button>
          <button
            className={`language-button ${
              language === "zh-CN" ? "active" : ""
            }`}
            onClick={() => setLanguage("zh-CN")}
          >
            简体中文
          </button>
          <button
            className={`language-button ${
              language === "en-US" ? "active" : ""
            }`}
            onClick={() => setLanguage("en-US")}
          >
            English
          </button>
        </div>
      </div>

      <div className="favorites-header">
        <h3>{translations.favorites}</h3>
        {favoriteLibraries.length > 0 && (
          <button className="clear-favorites" onClick={() => setFavorites([])}>
            {translations.clearFavorites}
          </button>
        )}
      </div>
      {favoriteLibraries.length > 0 ? (
        <ul className="favorite-list">
          {favoriteLibraries.map((library) => (
            <li key={library.libraryCode} className="favorite-item">
              <span
                onClick={() => onLibrarySelect(library)}
                className="library-name"
              >
                {library.libraryDisplayName}
              </span>
              <span
                className="star"
                onClick={() => toggleFavorite(library.libraryCode)}
                title={translations.removeFavorite}
              >
                <FilledStar />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>{translations.noFavorites}</p>
      )}

      <div className="district-header">
        <label htmlFor="district-select">{translations.selectDistrict}：</label>
        <label className="open-only-checkbox">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => setShowOpenOnly(e.target.checked)}
          />
          {translations.openOnly}
        </label>
      </div>
      <select
        id="district-select"
        value={selectedDistrict}
        onChange={(e) => onDistrictChange(e.target.value)}
      >
        <option value="">{translations.selectDistrictPlaceholder}</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      {selectedDistrict && (
        <div className="library-list">
          <h3>
            {translations.districtLibraries.replace(
              "{district}",
              selectedDistrict
            )}
          </h3>
          <ul>
            {libraries.map((library) => (
              <li key={library.libraryCode} className="library-item">
                <span
                  onClick={() => onLibrarySelect(library)}
                  className="library-name"
                >
                  {library.libraryDisplayName}
                </span>
                <span
                  className="star"
                  onClick={() => toggleFavorite(library.libraryCode)}
                  title={
                    favorites.includes(library.libraryCode)
                      ? translations.removeFavorite
                      : translations.addFavorite
                  }
                >
                  {favorites.includes(library.libraryCode) ? (
                    <FilledStar />
                  ) : (
                    <EmptyStar />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LibrarySelector;
