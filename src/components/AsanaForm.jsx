import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getAllCourses } from '../services/courseService';
import { createAsana, updateAsana } from '../services/asanaService';
import ImageUpload from './ImageUpload';
import './AsanaForm.css';

const AsanaForm = ({ asana, onSave, onCancel }) => {
  const [imageUrl, setImageUrl] = useState(asana?.image || '');
  const [courses, setCourses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: asana || {
      name: '',
      description: '',
      benefits: '',
      executionTime: '',
      courseId: '',
    },
  });

  const selectedCourseId = watch('courseId');
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const isCosmoenergetics = selectedCourse?.category === 'cosmoenergetics';
  const itemLabel = isCosmoenergetics ? 'сеанс' : 'асана';
  const itemLabelPlural = isCosmoenergetics ? 'сеанси' : 'асани';

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Load courses error:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (asana) {
      // Преобразуваме benefits от масив в string (нов редове) за textarea
      const asanaForForm = {
        ...asana,
        benefits: Array.isArray(asana.benefits)
          ? asana.benefits.join('\n')
          : asana.benefits || '',
      };
      reset(asanaForForm);
      setImageUrl(asana.image || '');
    }
  }, [asana, reset]);

  const onSubmit = async (data) => {
    if (!data.courseId) {
      setError('Моля, изберете курс');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Преобразуваме benefits от string (нов редове) в масив
      const benefitsArray = data.benefits
        ? data.benefits
            .split('\n')
            .map((b) => b.trim())
            .filter((b) => b.length > 0)
        : [];

      const asanaData = {
        ...data,
        benefits: benefitsArray,
        image: imageUrl || '', // Позволи празно изображение
        executionTime: parseInt(data.executionTime) || 0,
        createdAt: asana?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (asana?.id) {
        await updateAsana(asana.id, asanaData);
      } else {
        await createAsana(asanaData);
      }

      onSave();
    } catch (err) {
      const errorMessage = isCosmoenergetics 
        ? `Грешка при запазване на сеанса: ${err.message}` 
        : `Грешка при запазване на асаната: ${err.message}`;
      setError(err.message || errorMessage);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="asana-form">
      <h2>{asana ? `Редактиране на ${itemLabel}` : `Създаване на нов ${itemLabel}`}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="courseId">Курс *</label>
        {loadingCourses ? (
          <p>Зареждане на курсове...</p>
        ) : (
          <select
            id="courseId"
            {...register('courseId', { required: 'Курсът е задължителен' })}
            className={errors.courseId ? 'error' : ''}
          >
            <option value="">Изберете курс</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        )}
        {errors.courseId && (
          <span className="field-error">{errors.courseId.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="name">Име *</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Името е задължително' })}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
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

      <div className="form-group">
        <label htmlFor="benefits">Предимства *</label>
        <textarea
          id="benefits"
          rows="3"
          placeholder="Всяко предимство на нов ред"
          {...register('benefits', { required: 'Предимствата са задължителни' })}
          className={errors.benefits ? 'error' : ''}
        />
        {errors.benefits && (
          <span className="field-error">{errors.benefits.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="executionTime">Време за изпълнение (секунди) *</label>
        <input
          id="executionTime"
          type="number"
          min="0"
          placeholder={isCosmoenergetics ? "2700-3000 (45-50 минути)" : "напр. 60"}
          {...register('executionTime', {
            required: 'Времето за изпълнение е задължително',
            valueAsNumber: true,
          })}
          className={errors.executionTime ? 'error' : ''}
        />
        {errors.executionTime && (
          <span className="field-error">{errors.executionTime.message}</span>
        )}
        {isCosmoenergetics && selectedCourseId && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
            За космоенергетика: сеансите обикновено траят 45-50 минути. Въведете времето в секунди (2700-3000 сек = 45-50 мин).
          </p>
        )}
      </div>

      <div className="form-group">
        <label>Изображение</label>
        <ImageUpload
          currentImage={imageUrl}
          onImageUploaded={setImageUrl}
          folder="asanas"
        />
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Опционално - можеш да добавиш изображение по-късно
        </p>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Отказ
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Запазване...' : asana ? 'Обнови' : 'Създай'}
        </button>
      </div>
    </form>
  );
};

export default AsanaForm;

