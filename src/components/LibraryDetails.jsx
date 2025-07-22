// src/components/LibraryDetails.jsx
import "./LibraryDetails.css";

function LibraryDetails({ library }) {
  return (
    <div className="library-details">
      <h2>{library.libraryDisplayName}</h2>
      <p>
        <strong>區域：</strong>
        {library.district}
      </p>
      <p>
        <strong>地址：</strong>
        {library.address}
      </p>
      <p>
        <strong>電話：</strong>
        {library.telephone}
      </p>
      <p>
        <strong>電郵：</strong>
        {library.email}
      </p>
      <p>
        <strong>開放狀況：</strong>
        {library.isOpen ? "開放中" : "已關閉"}
      </p>
      <p>
        <strong>最後更新時間：</strong>
        {library.lastUpdateDate}
      </p>

      <h3>電腦設施使用情況</h3>
      {library.sessionList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>時段開始</th>
              <th>時段結束</th>
              <th>工作站組</th>
              <th>可用電腦數量</th>
            </tr>
          </thead>
          <tbody>
            {library.sessionList.map((session, index) =>
              session.workstationGroup.map((group) => (
                <tr key={`${index}-${group.groupId}`}>
                  <td>{session.sessionStart}</td>
                  <td>{session.sessionEnd}</td>
                  <td>{group.groupName}</td>
                  <td>{group.availableWktNumber}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>當前無可用電腦設施時段。</p>
      )}
    </div>
  );
}

export default LibraryDetails;
