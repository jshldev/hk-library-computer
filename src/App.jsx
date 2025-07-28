// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import LibrarySelector from "./components/LibrarySelector";
import LibraryDetails from "./components/LibraryDetails";
import translations from "./translations";
import "./App.css";

function App() {
  // 解析 URL 參數
  const urlParams = new URLSearchParams(window.location.search);
  const initialLibraryCode = urlParams.get("libraryCode") || "";
  const initialLanguage = ["zh-HK", "zh-CN", "en-US"].includes(
    urlParams.get("lang")
  )
    ? urlParams.get("lang")
    : localStorage.getItem("language") || "zh-HK";

  console.log("URL Params:", {
    libraryCode: initialLibraryCode,
    lang: initialLanguage,
    search: window.location.search,
  });

  const [libraries, setLibraries] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState(initialLanguage);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 區名對應表（需補充完整）
  const districtMapping = {
    "zh-HK": {
      "Sha Tin District": "沙田區",
      "Tai Po District": "大埔區",
      // 補充其他區
    },
    "zh-CN": {
      "Sha Tin District": "沙田区",
      "Tai Po District": "大埔区",
      // 補充其他區
    },
    "en-US": {
      沙田區: "Sha Tin District",
      大埔區: "Tai Po District",
      沙田区: "Sha Tin District",
      大埔区: "Tai Po District",
      // 補充其他區
    },
  };

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const apiUrl = `https://sls.hkpl.gov.hk/api/cfm-admin-service/open-api/library/selectLibraryPageInfoForPSI?language=${language}&sizePerPage=9999`;
        console.log("Fetching API:", apiUrl);
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

  // 處理初始 URL 參數的 libraryCode
  useEffect(() => {
    if (libraries.length > 0 && !initialLoadDone && initialLibraryCode) {
      console.log(
        "Libraries loaded:",
        libraries.map((lib) => ({
          libraryCode: lib.libraryCode,
          libraryDisplayName: lib.libraryDisplayName,
          district: lib.district,
        }))
      );
      const library = libraries.find(
        (lib) => lib.libraryCode === initialLibraryCode
      );
      console.log(
        "Looking for libraryCode:",
        initialLibraryCode,
        "Found:",
        library
      );
      if (library) {
        setSelectedLibrary(library);
        setSelectedDistrict(library.district);
      } else {
        console.warn("Library not found for libraryCode:", initialLibraryCode);
      }
      setInitialLoadDone(true);
    }
  }, [libraries, initialLibraryCode, initialLoadDone]);

  // 更新已選擇的圖書館和區域（語言切換時）
  useEffect(() => {
    if (libraries.length > 0 && initialLoadDone && selectedLibrary) {
      const updatedLibrary = libraries.find(
        (lib) => lib.libraryCode === selectedLibrary.libraryCode
      );
      console.log("Updating selectedLibrary:", updatedLibrary);
      if (updatedLibrary) {
        setSelectedLibrary(updatedLibrary);
        setSelectedDistrict(updatedLibrary.district);
      } else {
        setSelectedLibrary(null);
        setSelectedDistrict("");
      }
    } else if (libraries.length > 0 && selectedDistrict) {
      const newDistrict =
        libraries.find((lib) => {
          const mapping = districtMapping[language] || {};
          const mappedDistrict = mapping[selectedDistrict] || selectedDistrict;
          return lib.district === mappedDistrict;
        })?.district || "";
      console.log("Updating selectedDistrict:", newDistrict);
      setSelectedDistrict(newDistrict);
    }
    console.log("Selected Library:", selectedLibrary);
    console.log("Selected District:", selectedDistrict);
  }, [libraries, language, selectedLibrary, selectedDistrict, initialLoadDone]);

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
    // 更新 URL，移除 libraryCode
    const params = new URLSearchParams();
    params.set("lang", language);
    window.history.replaceState(
      {},
      "",
      `/hk-library-computer?${params.toString()}`
    );
  };

  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library);
    // 更新 URL
    const params = new URLSearchParams();
    params.set("libraryCode", library.libraryCode);
    params.set("lang", language);
    window.history.replaceState(
      {},
      "",
      `/hk-library-computer?${params.toString()}`
    );
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // 更新 URL
    const params = new URLSearchParams();
    if (selectedLibrary) {
      params.set("libraryCode", selectedLibrary.libraryCode);
    }
    params.set("lang", newLanguage);
    window.history.replaceState(
      {},
      "",
      `/hk-library-computer?${params.toString()}`
    );
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
            setLanguage={handleLanguageChange}
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
