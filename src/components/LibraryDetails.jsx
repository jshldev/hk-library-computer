// src/components/LibraryDetails.jsx
import "./LibraryDetails.css";

// 格式化時間函數，保留日期，移除秒數
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
            {library.sessionList.map((session, sessionIndex) => {
              const rowSpan = session.workstationGroup.length; // 計算 rowSpan
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
        <p>當前無可用電腦設施時段。</p>
      )}
    </div>
  );
}

export default LibraryDetails;
