import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './CourseForm.css';

const CosmoenergeticsCourseForm = ({ course, onSave, onCancel, saving, error, setError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: course || {
      title: '',
      description: '',
      style: 'Космоенергетика',
      focus: 'Енергийна работа',
      category: 'cosmoenergetics',
    },
  });

  useEffect(() => {
    if (course) {
      // Уверяваме се, че style и focus са попълнени
      const courseData = {
        ...course,
        style: course.style || 'Космоенергетика',
        focus: course.focus || 'Енергийна работа',
        duration: course.duration || 47
      };
      reset(courseData);
    }
  }, [course, reset]);

  const onSubmit = async (data) => {
    setError(null);
    const courseData = {
      ...data,
      category: 'cosmoenergetics',
      duration: 47, // Средна стойност между 45-50 минути
      style: data.style || 'Космоенергетика',
      focus: data.focus || 'Енергийна работа',
      createdAt: course?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(courseData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="course-form">
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
          <label>Продължителност</label>
          <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '4px', color: '#666' }}>
            45-50 минути (фиксирано за космоенергетика)
          </div>
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
            За космоенергетика: продължителността е фиксирана (45-50 минути) и няма нива на трудност.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="style">Стил</label>
          <input
            id="style"
            type="text"
            {...register('style')}
            readOnly
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="focus">Фокус</label>
        <input
          id="focus"
          type="text"
          {...register('focus')}
          readOnly
          style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
        />
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

export default CosmoenergeticsCourseForm;

