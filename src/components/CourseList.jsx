import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, deleteCourse } from '../services/courseService';
import './CourseList.css';

const CourseList = ({ onEdit, onCreateNew }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Грешка при зареждане на курсовете');
      console.error('Load courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този курс?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteCourse(id);
      await loadCourses();
    } catch (err) {
      alert(err.message || 'Грешка при изтриване на курса');
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="loading">Зареждане...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="course-list">
      <div className="course-list-header">
        <h2>Курсове ({courses.length})</h2>
        <button onClick={onCreateNew} className="btn-primary">
          + Нов курс
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>Няма курсове. Създайте първия курс!</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card course-card-clickable"
              onClick={() => navigate(`/courses/${course.id}/asanas`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/courses/${course.id}/asanas`);
                }
              }}
            >
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item">⏱ {typeof course.duration === 'number' ? `${course.duration} мин` : course.duration}</span>
                  {course.category === 'yoga' && (
                    <span className="meta-item">
                      {course.difficulty === 'beginner' && '🟢 Начинаещ'}
                      {course.difficulty === 'intermediate' && '🟡 Средно'}
                      {course.difficulty === 'advanced' && '🔴 Напреднал'}
                    </span>
                  )}
                  {course.style && (
                    <span className="meta-item">🎨 {course.style}</span>
                  )}
                  {course.focus && (
                    <span className="meta-item">🎯 {course.focus}</span>
                  )}
                </div>
                <p className="course-card-hint">Преглед на асани →</p>
                <div className="course-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(course)}
                    className="btn-edit"
                  >
                    Редактирай
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn-delete"
                    disabled={deletingId === course.id}
                  >
                    {deletingId === course.id ? 'Изтриване...' : 'Изтрий'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;

