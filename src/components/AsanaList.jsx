import { useState, useEffect } from 'react';
import { getAllAsanas, deleteAsana } from '../services/asanaService';
import { getAllCourses } from '../services/courseService';
import './AsanaList.css';

const AsanaList = ({ onEdit, onCreateNew }) => {
  const [asanas, setAsanas] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const [asanasData, coursesData] = await Promise.all([
        getAllAsanas(),
        getAllCourses(),
      ]);
      setAsanas(asanasData);
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Грешка при зареждане на данните');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (asana) => {
    const courseCategory = getCourseCategory(asana.courseId);
    const itemLabel = courseCategory === 'cosmoenergetics' ? 'сеанс' : 'асана';
    
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете този ${itemLabel}?`)) {
      return;
    }

    try {
      setDeletingId(asana.id);
      await deleteAsana(asana.id);
      await loadData();
    } catch (err) {
      const errorMessage = courseCategory === 'cosmoenergetics' 
        ? `Грешка при изтриване на сеанса: ${err.message}` 
        : `Грешка при изтриване на асаната: ${err.message}`;
      alert(err.message || errorMessage);
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || 'Неизвестен курс';
  };

  const getCourseCategory = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.category || 'yoga';
  };

  const getItemLabel = (courseId) => {
    const category = getCourseCategory(courseId);
    return category === 'cosmoenergetics' ? 'сеанси' : 'асани';
  };

  const getItemLabelSingular = (courseId) => {
    const category = getCourseCategory(courseId);
    return category === 'cosmoenergetics' ? 'сеанс' : 'асана';
  };

  const filteredAsanas =
    selectedCourse === 'all'
      ? asanas
      : asanas.filter((asana) => asana.courseId === selectedCourse);

  if (loading) {
    return <div className="loading">Зареждане...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const selectedCourseData = selectedCourse !== 'all' 
    ? courses.find(c => c.id === selectedCourse) 
    : null;
  const listLabel = selectedCourseData?.category === 'cosmoenergetics' ? 'Сеанси' : 'Асани';
  const newItemLabel = selectedCourseData?.category === 'cosmoenergetics' ? 'Нов сеанс' : 'Нова асана';
  const emptyLabel = selectedCourseData?.category === 'cosmoenergetics' ? 'сеанси' : 'асани';
  const emptyLabelSingular = selectedCourseData?.category === 'cosmoenergetics' ? 'сеанс' : 'асана';

  return (
    <div className="asana-list">
      <div className="asana-list-header">
        <h2>{listLabel} ({filteredAsanas.length})</h2>
        <div className="header-actions">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-filter"
          >
            <option value="all">Всички курсове</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button onClick={onCreateNew} className="btn-primary">
            + {newItemLabel}
          </button>
        </div>
      </div>

      {filteredAsanas.length === 0 ? (
        <div className="empty-state">
          <p>
            {selectedCourse === 'all'
              ? `Няма ${emptyLabel}. Създайте първия ${emptyLabelSingular}!`
              : `Няма ${emptyLabel} за този курс.`}
          </p>
        </div>
      ) : (
        <div className="asana-grid">
          {filteredAsanas.map((asana) => (
            <div key={asana.id} className="asana-card">
              {asana.image && (
                <div className="asana-image">
                  <img src={asana.image} alt={asana.name} />
                </div>
              )}
              <div className="asana-content">
                <div className="asana-header">
                  <h3>{asana.name}</h3>
                  <span className="course-badge">{getCourseName(asana.courseId)}</span>
                </div>
                <p className="asana-description">{asana.description}</p>
                <div className="asana-meta">
                  <span className="meta-item">
                    ⏱ {getCourseCategory(asana.courseId) === 'cosmoenergetics' 
                      ? `${Math.round(asana.executionTime / 60)} мин` 
                      : `${asana.executionTime} сек`}
                  </span>
                </div>
                {asana.benefits && (
                  <div className="asana-benefits">
                    <strong>Предимства:</strong>
                    <ul>
                      {(Array.isArray(asana.benefits)
                        ? asana.benefits
                        : asana.benefits.split('\n').filter((b) => b.trim())
                      )
                        .slice(0, 2)
                        .map((benefit, idx) => (
                          <li key={idx}>{typeof benefit === 'string' ? benefit.trim() : benefit}</li>
                        ))}
                    </ul>
                  </div>
                )}
                <div className="asana-actions">
                  <button
                    onClick={() => onEdit(asana)}
                    className="btn-edit"
                  >
                    Редактирай
                  </button>
                  <button
                    onClick={() => handleDelete(asana)}
                    className="btn-delete"
                    disabled={deletingId === asana.id}
                  >
                    {deletingId === asana.id ? 'Изтриване...' : 'Изтрий'}
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

export default AsanaList;

