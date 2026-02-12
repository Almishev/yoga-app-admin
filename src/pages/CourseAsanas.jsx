import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getCourseById } from '../services/courseService';
import { getAsanasByCourseId, deleteAsana } from '../services/asanaService';
import './CourseAsanas.css';

const CourseAsanas = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [asanas, setAsanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const [courseData, asanasData] = await Promise.all([
        getCourseById(courseId),
        getAsanasByCourseId(courseId),
      ]);
      setCourse(courseData);
      setAsanas(asanasData);
    } catch (err) {
      setError(err.message || 'Грешка при зареждане на данните');
      console.error('Load course asanas error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleDelete = async (asana) => {
    const itemLabel = course?.category === 'cosmoenergetics' ? 'сеанс' : 'асана';
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете този ${itemLabel}?`)) {
      return;
    }
    try {
      setDeletingId(asana.id);
      await deleteAsana(asana.id);
      await loadData();
    } catch (err) {
      alert(err.message || `Грешка при изтриване на ${itemLabel}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (asana) => {
    navigate('/asanas', { state: { editAsana: asana } });
  };

  const isCosmoenergetics = course?.category === 'cosmoenergetics';
  const sectionLabel = isCosmoenergetics ? 'Сеанси' : 'Асани';
  const emptyLabel = isCosmoenergetics ? 'сеанси' : 'асани';
  const newItemLabel = isCosmoenergetics ? 'Нов сеанс' : 'Нова асана';

  if (loading && !course) {
    return (
      <div className="course-asanas-page">
        <PageHeader />
        <div className="loading">Зареждане...</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="course-asanas-page">
        <PageHeader />
        <div className="error">{error}</div>
        <Link to="/courses" className="back-link">← Назад към курсове</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-asanas-page">
        <PageHeader />
        <div className="error">Курсът не е намерен.</div>
        <Link to="/courses" className="back-link">← Назад към курсове</Link>
      </div>
    );
  }

  return (
    <div className="course-asanas-page">
      <PageHeader />
      <div className="course-asanas-content">
        <div className="course-asanas-header">
          <Link to="/courses" className="back-link">← Назад към курсове</Link>
          <h1 className="course-title">{course.title}</h1>
          {course.description && (
            <p className="course-description">{course.description}</p>
          )}
          <div className="course-meta">
            <span className="meta-item">
              ⏱ {typeof course.duration === 'number' ? `${course.duration} мин` : course.duration}
            </span>
            {course.category === 'yoga' && course.difficulty && (
              <span className="meta-item">
                {course.difficulty === 'beginner' && '🟢 Начинаещ'}
                {course.difficulty === 'intermediate' && '🟡 Средно'}
                {course.difficulty === 'advanced' && '🔴 Напреднал'}
              </span>
            )}
          </div>
        </div>

        <div className="asana-list-section">
          <div className="asana-list-header">
            <h2>{sectionLabel} ({asanas.length})</h2>
            <Link to="/asanas" className="btn-primary">
              + {newItemLabel}
            </Link>
          </div>

          {loading ? (
            <div className="loading">Зареждане на {emptyLabel}...</div>
          ) : asanas.length === 0 ? (
            <div className="empty-state">
              <p>Няма {emptyLabel} в този курс.</p>
              <Link to="/asanas" className="btn-primary" style={{ marginTop: '1rem' }}>
                + Добави {newItemLabel}
              </Link>
            </div>
          ) : (
            <div className="asana-grid">
              {asanas.map((asana) => (
                <div key={asana.id} className="asana-card">
                  {asana.image && (
                    <div className="asana-image">
                      <img src={asana.image} alt={asana.name} />
                    </div>
                  )}
                  <div className="asana-content">
                    <h3>{asana.name}</h3>
                    <p className="asana-description">{asana.description}</p>
                    <div className="asana-meta">
                      <span className="meta-item">
                        ⏱ {isCosmoenergetics
                          ? `${Math.round(asana.executionTime / 60)} мин`
                          : `${asana.executionTime} сек`}
                      </span>
                    </div>
                    {asana.benefits && asana.benefits.length > 0 && (
                      <div className="asana-benefits">
                        <strong>Предимства:</strong>
                        <ul>
                          {(Array.isArray(asana.benefits) ? asana.benefits : [])
                            .slice(0, 2)
                            .map((benefit, idx) => (
                              <li key={idx}>{typeof benefit === 'string' ? benefit : benefit}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <div className="asana-actions">
                      <button
                        onClick={() => handleEdit(asana)}
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
      </div>
    </div>
  );
};

export default CourseAsanas;
