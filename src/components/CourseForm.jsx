import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createCourse, updateCourse } from '../services/courseService';
import './CourseForm.css';

const CourseForm = ({ course, onSave, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: course || {
      title: '',
      description: '',
      duration: '',
      difficulty: 'beginner',
    },
  });

  useEffect(() => {
    if (course) {
      reset(course);
    }
  }, [course, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setError(null);

    try {
      const courseData = {
        ...data,
        createdAt: course?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="course-form">
      <h2>{course ? 'Редактиране на курс' : 'Създаване на нов курс'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Заглавие *</label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Заглавието е задължително' })}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="field-error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание *</label>
        <textarea
          id="description"
          rows="4"
          {...register('description', { required: 'Описанието е задължително' })}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && (
          <span className="field-error">{errors.description.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">Продължителност *</label>
          <input
            id="duration"
            type="text"
            placeholder="напр. 30 минути"
            {...register('duration', { required: 'Продължителността е задължителна' })}
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && (
            <span className="field-error">{errors.duration.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Ниво на трудност *</label>
          <select
            id="difficulty"
            {...register('difficulty', { required: true })}
          >
            <option value="beginner">Начинаещ</option>
            <option value="intermediate">Средно</option>
            <option value="advanced">Напреднал</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Отказ
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Запазване...' : course ? 'Обнови' : 'Създай'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;

