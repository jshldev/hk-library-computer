// src/components/LibrarySelector.jsx
import "./LibrarySelector.css";

// SVG 星星圖標
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
}) {
  return (
    <div className="library-selector">
      <div className="favorites-header">
        <h3>我的最愛</h3>
        {favoriteLibraries.length > 0 && (
          <button className="clear-favorites" onClick={() => setFavorites([])}>
            清空我的最愛
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
                title="從我的最愛移除"
              >
                <FilledStar />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>尚未添加我的最愛圖書館</p>
      )}

      <div className="district-header">
        <label htmlFor="district-select">選擇區域：</label>
        <label className="open-only-checkbox">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => setShowOpenOnly(e.target.checked)}
          />
          只顯示開放中的圖書館
        </label>
      </div>
      <select
        id="district-select"
        value={selectedDistrict}
        onChange={(e) => onDistrictChange(e.target.value)}
      >
        <option value="">請選擇區域</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      {selectedDistrict && (
        <div className="library-list">
          <h3>{selectedDistrict} 的圖書館</h3>
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
                      ? "從我的最愛移除"
                      : "加入我的最愛"
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
