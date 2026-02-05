import { useState, useEffect } from 'react';
import { getAllCourses, deleteCourse } from '../services/courseService';
import './CourseList.css';

const CourseList = ({ onEdit, onCreateNew }) => {
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
            <div key={course.id} className="course-card">
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item">⏱ {course.duration}</span>
                  <span className="meta-item">
                    {course.difficulty === 'beginner' && '🟢 Начинаещ'}
                    {course.difficulty === 'intermediate' && '🟡 Средно'}
                    {course.difficulty === 'advanced' && '🔴 Напреднал'}
                  </span>
                </div>
                <div className="course-actions">
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

