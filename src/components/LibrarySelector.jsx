// src/components/LibrarySelector.jsx
import "./LibrarySelector.css";

function LibrarySelector({
  districts,
  selectedDistrict,
  onDistrictChange,
  libraries,
  onLibrarySelect,
}) {
  return (
    <div className="library-selector">
      <label htmlFor="district-select">選擇區域：</label>
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
              <li
                key={library.libraryCode}
                onClick={() => onLibrarySelect(library)}
                className="library-item"
              >
                {library.libraryDisplayName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LibrarySelector;
