// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import LibrarySelector from "./components/LibrarySelector";
import LibraryDetails from "./components/LibraryDetails";
import translations from "./translations";
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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "zh-HK";
  });
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  // 儲存區名對應表，方便語言切換時查找
  const districtMapping = {
    "zh-HK": {
      "Sha Tin District": "沙田區",
      "Tai Po District": "大埔區",
      // 添加其他區名對應
    },
    "zh-CN": {
      "Sha Tin District": "沙田区",
      "Tai Po District": "大埔区",
      // 添加其他區名對應
    },
    "en-US": {
      沙田區: "Sha Tin District",
      大埔區: "Tai Po District",
      沙田区: "Sha Tin District",
      大埔区: "Tai Po District",
      // 添加其他區名對應
    },
  };

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const apiUrl = `https://sls.hkpl.gov.hk/api/cfm-admin-service/open-api/library/selectLibraryPageInfoForPSI?language=${language}&sizePerPage=9999`;
        const response = await axios.get(apiUrl);
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
        setError(translations[language].error);
        setLoading(false);
      }
    };
    fetchLibraries();
  }, [language]);

  useEffect(() => {
    if (libraries.length > 0 && (selectedLibrary || selectedDistrict)) {
      // 如果有選擇的圖書館，優先更新 selectedLibrary 和 selectedDistrict
      if (selectedLibrary) {
        const updatedLibrary = libraries.find(
          (lib) => lib.libraryCode === selectedLibrary.libraryCode
        );
        if (updatedLibrary) {
          setSelectedLibrary(updatedLibrary);
          setSelectedDistrict(updatedLibrary.district);
        } else {
          // 如果圖書館不存在（例如被過濾），清空選擇
          setSelectedLibrary(null);
          setSelectedDistrict("");
        }
      } else if (selectedDistrict) {
        // 如果只有 selectedDistrict，嘗試查找新語言的對應區名
        const newDistrict =
          libraries.find((lib) => {
            const mapping = districtMapping[language] || {};
            const mappedDistrict =
              mapping[selectedDistrict] || selectedDistrict;
            return lib.district === mappedDistrict;
          })?.district || "";
        setSelectedDistrict(newDistrict);
      }
    }
  }, [libraries, language, selectedLibrary, selectedDistrict]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("language", language);
  }, [favorites, language]);

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
    setSelectedDistrict(library.district);
  };

  const filteredLibraries = libraries.filter(
    (lib) => lib.district === selectedDistrict && (!showOpenOnly || lib.isOpen)
  );

  const favoriteLibraries = libraries.filter(
    (lib) =>
      favorites.includes(lib.libraryCode) && (!showOpenOnly || lib.isOpen)
  );

  return (
    <div className="app">
      <h1>{translations[language].appTitle}</h1>
      {loading && <p>{translations[language].loading}</p>}
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
            {translations[language].retry}
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
            language={language}
            setLanguage={setLanguage}
            translations={translations[language]}
          />
          {selectedLibrary && (
            <LibraryDetails
              library={selectedLibrary}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              translations={translations[language]}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
