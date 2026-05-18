import { useState, useEffect } from "react";
import CourseRow from "./components/CourseRow";
import GPADisplay from "./components/GPADisplay";
import YearPanel from "./components/YearPanel";
import Footer from "./components/Footer";

export const GRADE_POINTS = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7,
  "D+": 1.3, D: 1.0, F: 0.0,
};

const newCourse = () => ({
  id: Date.now() + Math.random(),
  name: "",
  credits: 3,
  grade: "A",
});

const newSemester = (label) => ({
  id: Date.now() + Math.random(),
  label,
  courses: [newCourse()],
});

const newYear = (yearNum) => ({
  id: Date.now() + Math.random(),
  yearNum,
  semesters: [
    newSemester("Semester 1"),
    newSemester("Semester 2"),
  ],
});

const calcGPA = (courses) => {
  const valid = courses.filter((c) => Number(c.credits) > 0);
  if (!valid.length) return 0;
  const pts = valid.reduce((s, c) => s + (GRADE_POINTS[c.grade] ?? 0) * Number(c.credits), 0);
  const creds = valid.reduce((s, c) => s + Number(c.credits), 0);
  return creds === 0 ? 0 : pts / creds;
};

export default function App() {
  const [years, setYears] = useState([newYear(1)]);
  const [activeYearId, setActiveYearId] = useState(null);
  const [activeSemId, setActiveSemId] = useState(null);
  const [pulse, setPulse] = useState(false);

  // Init active selections
  useEffect(() => {
    if (years.length && !activeYearId) {
      setActiveYearId(years[0].id);
      setActiveSemId(years[0].semesters[0].id);
    }
  }, []);

  // Pulse animation on change
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 350);
    return () => clearTimeout(t);
  }, [years]);

  const activeYear = years.find((y) => y.id === activeYearId) ?? years[0];
  const activeSem = activeYear?.semesters.find((s) => s.id === activeSemId) ?? activeYear?.semesters[0];

  // GPA computations
  const semGPA = activeSem ? calcGPA(activeSem.courses) : 0;

  const yearGPA = (year) => {
    const allCourses = year.semesters.flatMap((s) => s.courses);
    return calcGPA(allCourses);
  };

  const cgpa = () => {
    const allCourses = years.flatMap((y) => y.semesters.flatMap((s) => s.courses));
    return calcGPA(allCourses);
  };

  const totalCredits = () =>
    years.flatMap((y) => y.semesters.flatMap((s) => s.courses))
      .reduce((s, c) => s + Number(c.credits), 0);

  // Mutations
  const updateCourse = (semId, courseId, field, val) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        semesters: y.semesters.map((s) =>
          s.id === semId
            ? { ...s, courses: s.courses.map((c) => c.id === courseId ? { ...c, [field]: val } : c) }
            : s
        ),
      }))
    );
  };

  const addCourse = (semId) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        semesters: y.semesters.map((s) =>
          s.id === semId ? { ...s, courses: [...s.courses, newCourse()] } : s
        ),
      }))
    );
  };

  const removeCourse = (semId, courseId) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        semesters: y.semesters.map((s) =>
          s.id === semId && s.courses.length > 1
            ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
            : s
        ),
      }))
    );
  };

  const addYear = () => {
    const yr = newYear(years.length + 1);
    setYears((prev) => [...prev, yr]);
    setActiveYearId(yr.id);
    setActiveSemId(yr.semesters[0].id);
  };

  const removeYear = (yId) => {
    if (years.length === 1) return;
    const remaining = years.filter((y) => y.id !== yId);
    setYears(remaining);
    if (activeYearId === yId) {
      setActiveYearId(remaining[0].id);
      setActiveSemId(remaining[0].semesters[0].id);
    }
  };

  const selectSem = (yearId, semId) => {
    setActiveYearId(yearId);
    setActiveSemId(semId);
  };

  const gradeColor = (gpa) => {
    if (gpa >= 3.7) return "card-a";
    if (gpa >= 3.0) return "card-b";
    if (gpa >= 2.0) return "card-c";
    if (gpa >= 1.0) return "card-d";
    return "card-f";
  };

  const activeYearGPA = activeYear ? yearGPA(activeYear) : 0;
  const cgpaVal = cgpa();

  return (
    <div className="app">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="container">
        {/* ── Header ── */}
        <header className="header">
          <div className="header-badge">GPA</div>
          <div>
            <h1 className="header-title">GPA Calculator</h1>
            <p className="header-sub">Track your academic performance year by year</p>
          </div>
        </header>

        {/* ── Stat Cards ── */}
        <div className="stats-grid">
          <GPADisplay label="Semester GPA" value={semGPA} cls={gradeColor(semGPA)} pulse={pulse} sub={activeSem?.label} />
          <GPADisplay label={`Year ${activeYear?.yearNum} GPA`} value={activeYearGPA} cls={gradeColor(activeYearGPA)} pulse={pulse} sub="current year" />
          <GPADisplay label="Cumulative GPA" value={cgpaVal} cls={gradeColor(cgpaVal)} pulse={pulse} sub={`${years.length} year${years.length > 1 ? "s" : ""}`} large />
          <GPADisplay label="Total Credits" value={totalCredits()} cls="card-neutral" pulse={false} sub="earned" isNum />
        </div>

        {/* ── Year / Semester Panel ── */}
        <YearPanel
          years={years}
          activeYearId={activeYearId}
          activeSemId={activeSemId}
          onSelectSem={selectSem}
          onAddYear={addYear}
          onRemoveYear={removeYear}
          yearGPA={yearGPA}
          calcGPA={calcGPA}
          gradeColor={gradeColor}
        />

        {/* ── Course Table ── */}
        {activeSem && (
          <div className="course-card">
            <div className="course-card-head">
              <div>
                <span className="course-card-year">Year {activeYear?.yearNum}</span>
                <h2 className="course-card-title">{activeSem.label}</h2>
              </div>
              <span className="course-badge">{activeSem.courses.length} course{activeSem.courses.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="table-wrap">
              <div className="table-head">
                <span>Course Name</span>
                <span>Credits</span>
                <span>Grade</span>
                <span>Quality Pts</span>
                <span></span>
              </div>

              {activeSem.courses.map((course, i) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  index={i}
                  semId={activeSem.id}
                  canRemove={activeSem.courses.length > 1}
                  onChange={updateCourse}
                  onRemove={removeCourse}
                />
              ))}
            </div>

            <button className="btn-add-course" onClick={() => addCourse(activeSem.id)}>
              <span className="btn-plus">+</span> Add Course
            </button>
          </div>
        )}

        {/* ── Grade Scale Legend ── */}
        <div className="legend">
          <p className="legend-title">Grade Scale</p>
          <div className="legend-items">
            {[
              { range: "4.0 – 3.7", label: "A range", cls: "dot-a" },
              { range: "3.3 – 2.7", label: "B range", cls: "dot-b" },
              { range: "2.3 – 1.7", label: "C range", cls: "dot-c" },
              { range: "1.3 – 1.0", label: "D range", cls: "dot-d" },
              { range: "Below 1.0", label: "F range", cls: "dot-f" },
            ].map((item) => (
              <div className="legend-item" key={item.range}>
                <span className={`legend-dot ${item.cls}`} />
                <span className="legend-range">{item.range}</span>
                <span className="legend-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
