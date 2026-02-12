import { useState } from 'react';
import { createCourse, updateCourse } from '../services/courseService';
import YogaCourseForm from './YogaCourseForm';
import CosmoenergeticsCourseForm from './CosmoenergeticsCourseForm';
import './CourseForm.css';

const CourseForm = ({ course, onSave, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(course?.category || 'yoga');

  const category = course?.category || selectedCategory;

  const handleFormSubmit = async (courseData) => {
    setSaving(true);
    setError(null);

    try {
      if (course?.id) {
        await updateCourse(course.id, courseData);
      } else {
        await createCourse(courseData);
      }

      onSave();
    } catch (err) {
      setError(err.message || 'Грешка при запазване на курса');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!course) {
    return (
      <div className="course-form">
        <h2>Създаване на нов курс</h2>
        
        <div className="form-group">
          <label htmlFor="category-select">Избери категория *</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '8px',
            }}
          >
            <option value="yoga">🧘‍♀️ Йога</option>
            <option value="cosmoenergetics">🌌 Космоенергетика</option>
          </select>
        </div>

        {selectedCategory === 'cosmoenergetics' ? (
          <CosmoenergeticsCourseForm
            course={null}
            onSave={handleFormSubmit}
            onCancel={onCancel}
            saving={saving}
            error={error}
            setError={setError}
          />
        ) : (
          <YogaCourseForm
            course={null}
            onSave={handleFormSubmit}
            onCancel={onCancel}
            saving={saving}
            error={error}
            setError={setError}
          />
        )}
      </div>
    );
  }

  if (category === 'cosmoenergetics') {
    return (
      <div className="course-form">
        <h2>Редактиране на курс</h2>
        <CosmoenergeticsCourseForm
          course={course}
          onSave={handleFormSubmit}
          onCancel={onCancel}
          saving={saving}
          error={error}
          setError={setError}
        />
      </div>
    );
  }

  return (
    <div className="course-form">
      <h2>Редактиране на курс</h2>
      <YogaCourseForm
        course={course}
        onSave={handleFormSubmit}
        onCancel={onCancel}
        saving={saving}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default CourseForm;

