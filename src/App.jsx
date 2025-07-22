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
        // 假設圖書館資料在 response.data
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Parsed Libraries:", data);
        setLibraries(data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("無法加載圖書館資料，請稍後再試。");
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  console.log(
    "Libraries before districts:",
    libraries.map((lib) => ({
      libraryCode: lib.libraryCode,
      district: lib.district,
    }))
  );

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
  console.log("Computed Districts:", districts);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedLibrary(null);
  };

  const handleLibrarySelect = (library) => {
    setSelectedLibrary(library);
  };

  const filteredLibraries = libraries.filter(
    (lib) => lib.district === selectedDistrict
  );

  return (
    <div className="app">
      <h1>香港公共圖書館電腦設施可供使用情況查詢</h1>
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
          {districts.length === 0 && (
            <p>無可用區域資料，請稍後再試或檢查 API 資料。</p>
          )}
          <LibrarySelector
            districts={districts}
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
            libraries={filteredLibraries}
            onLibrarySelect={handleLibrarySelect}
          />
          {selectedLibrary && <LibraryDetails library={selectedLibrary} />}
        </>
      )}
    </div>
  );
}

export default App;
