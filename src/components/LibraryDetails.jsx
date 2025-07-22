// src/components/LibraryDetails.jsx
import "./LibraryDetails.css";

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

function formatTime(dateTime) {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function LibraryDetails({ library, favorites, toggleFavorite, translations }) {
  return (
    <div className="library-details">
      <h2>
        {library.libraryDisplayName}
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
      </h2>
      <p>
        <strong>{translations.libraryDetails.district}：</strong>
        {library.district}
      </p>
      <p>
        <strong>{translations.libraryDetails.address}：</strong>
        {library.address}
      </p>
      <p>
        <strong>{translations.libraryDetails.telephone}：</strong>
        {library.telephone}
      </p>
      <p>
        <strong>{translations.libraryDetails.email}：</strong>
        {library.email}
      </p>
      <p>
        <strong>{translations.libraryDetails.isOpen}：</strong>
        {library.isOpen
          ? translations.libraryDetails.isOpenTrue
          : translations.libraryDetails.isOpenFalse}
      </p>
      <p>
        <strong>{translations.libraryDetails.lastUpdate}：</strong>
        {library.lastUpdateDate}
      </p>

      <h3>{translations.libraryDetails.computerFacilities}</h3>
      {library.sessionList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{translations.libraryDetails.sessionStart}</th>
              <th>{translations.libraryDetails.sessionEnd}</th>
              <th>{translations.libraryDetails.workstationGroup}</th>
              <th>{translations.libraryDetails.availableComputers}</th>
            </tr>
          </thead>
          <tbody>
            {library.sessionList.map((session, sessionIndex) => {
              const rowSpan = session.workstationGroup.length;
              return session.workstationGroup.map((group, groupIndex) => (
                <tr key={`${sessionIndex}-${group.groupId}`}>
                  {groupIndex === 0 ? (
                    <>
                      <td rowSpan={rowSpan} className="time-cell">
                        {formatTime(session.sessionStart)}
                      </td>
                      <td rowSpan={rowSpan} className="time-cell">
                        {formatTime(session.sessionEnd)}
                      </td>
                    </>
                  ) : null}
                  <td>{group.groupName}</td>
                  <td>{group.availableWktNumber}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      ) : (
        <p>{translations.libraryDetails.noFacilities}</p>
      )}
    </div>
  );
}

export default LibraryDetails;
