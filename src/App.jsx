// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import LibrarySelector from "./components/LibrarySelector";
import LibraryDetails from "./components/LibraryDetails";
import "./App.css";

function App() {
  const [libraries, setLibraries] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [showOpenOnly, setShowOpenOnly] = useState(false); // 新增狀態，預設不勾選

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await axios.get(
          "https://sls.hkpl.gov.hk/api/cfm-admin-service/open-api/library/selectLibraryPageInfoForPSI?language=zh-HK&sizePerPage=9999"
        );
        console.log("API Response:", response.data);
        console.log(
          "response.data type:",
          Array.isArray(response.data) ? "Array" : typeof response.data
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        console.log("Parsed Libraries:", data);
        setLibraries(data);
        setLoading(false);
      } catch (err) {
        console.error("API Error Details:", {
          message: err.message,
          response: err.response ? err.response.data : null,
          status: err.response ? err.response.status : null,
        });
        setError("無法加載圖書館資料，請稍後再試。");
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (libraryCode) => {
    setFavorites((prev) =>
      prev.includes(libraryCode)
        ? prev.filter((code) => code !== libraryCode)
        : [...prev, libraryCode]
    );
  };

  const districts =
    libraries.length > 0
      ? [
          ...new Set(
            libraries
              .filter(
                (lib) =>
                  typeof lib.district === "string" && lib.district.trim() !== ""
              )
              .map((lib) => lib.district)
          ),
        ].sort()
      : [];

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedLibrary(null);
  };

  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library);
  };

  // 過濾圖書館，根據 showOpenOnly 決定是否僅顯示開放中的圖書館
  const filteredLibraries = libraries.filter(
    (lib) => lib.district === selectedDistrict && (!showOpenOnly || lib.isOpen)
  );

  const favoriteLibraries = libraries.filter(
    (lib) =>
      favorites.includes(lib.libraryCode) && (!showOpenOnly || lib.isOpen)
  );

  return (
    <div className="app">
      <h1>香港公共圖書館電腦設施查詢</h1>
      {loading && <p>正在加載資料...</p>}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchLibraries();
            }}
          >
            重試
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          <LibrarySelector
            districts={districts}
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
            libraries={filteredLibraries}
            favoriteLibraries={favoriteLibraries}
            onLibrarySelect={handleLibrarySelect}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setFavorites={setFavorites}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
          />
          {selectedLibrary && (
            <LibraryDetails
              library={selectedLibrary}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
