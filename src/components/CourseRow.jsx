import { GRADE_POINTS } from "../App";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

export default function CourseRow({ course, index, semId, canRemove, onChange, onRemove }) {
  const pts = (GRADE_POINTS[course.grade] ?? 0) * Number(course.credits);

  return (
    <div className="course-row" style={{ animationDelay: `${index * 0.04}s` }}>
      <input
        className="c-input c-name"
        type="text"
        placeholder={`Course ${index + 1}`}
        value={course.name}
        onChange={(e) => onChange(semId, course.id, "name", e.target.value)}
      />
      <input
        className="c-input c-credits"
        type="number"
        min="0"
        max="12"
        step="0.5"
        value={course.credits}
        onChange={(e) => onChange(semId, course.id, "credits", e.target.value)}
      />
      <select
        className="c-select"
        value={course.grade}
        onChange={(e) => onChange(semId, course.id, "grade", e.target.value)}
      >
        {GRADES.map((g) => (
          <option key={g} value={g}>{g} ({GRADE_POINTS[g]?.toFixed(1)})</option>
        ))}
      </select>
      <div className="c-pts">
        <span className="c-pts-val">{pts.toFixed(1)}</span>
        <span className="c-pts-lbl">pts</span>
      </div>
      <button
        className="c-remove"
        disabled={!canRemove}
        onClick={() => onRemove(semId, course.id)}
        title="Remove"
      >×</button>
    </div>
  );
}
