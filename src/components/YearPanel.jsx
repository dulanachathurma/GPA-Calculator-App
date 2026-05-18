export default function YearPanel({
  years, activeYearId, activeSemId,
  onSelectSem, onAddYear, onRemoveYear,
  yearGPA, calcGPA, gradeColor
}) {
  return (
    <div className="year-panel">
      {/* Year tabs row */}
      <div className="year-tabs-row">
        <div className="year-tabs">
          {years.map((y) => {
            const gpa = yearGPA(y).toFixed(2);
            const isActive = y.id === activeYearId;
            return (
              <button
                key={y.id}
                className={`year-tab ${isActive ? "year-tab--active" : ""}`}
                onClick={() => onSelectSem(y.id, y.semesters[0].id)}
              >
                <span className="year-tab-name">Year {y.yearNum}</span>
                <span className="year-tab-gpa">{gpa}</span>
                {years.length > 1 && (
                  <span
                    className="year-tab-remove"
                    onClick={(e) => { e.stopPropagation(); onRemoveYear(y.id); }}
                    title="Remove year"
                  >×</span>
                )}
              </button>
            );
          })}
          <button className="btn-add-year" onClick={onAddYear}>+ Add Year</button>
        </div>
      </div>

      {/* Semester sub-tabs for active year */}
      {years.find((y) => y.id === activeYearId) && (
        <div className="sem-tabs-row">
          {years.find((y) => y.id === activeYearId).semesters.map((sem) => {
            const gpa = calcGPA(sem.courses).toFixed(2);
            const isActive = sem.id === activeSemId;
            return (
              <button
                key={sem.id}
                className={`sem-tab ${isActive ? "sem-tab--active" : ""}`}
                onClick={() => onSelectSem(activeYearId, sem.id)}
              >
                <span>{sem.label}</span>
                <span className="sem-tab-gpa">{gpa}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
