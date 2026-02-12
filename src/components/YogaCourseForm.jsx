import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './CourseForm.css';

const YogaCourseForm = ({ course, onSave, onCancel, saving, error, setError }) => {
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
      style: '',
      focus: '',
      difficulty: 'beginner',
      category: 'yoga',
    },
  });

  useEffect(() => {
    if (course) {
      // Уверяваме се, че duration е число при зареждане на курс за редактиране
      const courseData = {
        ...course,
        duration: typeof course.duration === 'number' ? course.duration : (course.duration ? parseInt(course.duration) || '' : '')
      };
      reset(courseData);
    }
  }, [course, reset]);

  const onSubmit = async (data) => {
    setError(null);
    // Парсваме duration като число (минути)
    const durationValue = data.duration ? parseInt(data.duration) || 0 : 0;
    
    const courseData = {
      ...data,
      duration: durationValue, // Запазваме като число
      category: 'yoga',
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
          <label htmlFor="duration">Продължителност (минути) *</label>
          <input
            id="duration"
            type="number"
            min="1"
            placeholder="напр. 30"
            {...register('duration', { 
              required: 'Продължителността е задължителна',
              valueAsNumber: true,
              min: { value: 1, message: 'Продължителността трябва да е поне 1 минута' }
            })}
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="style">Стил на йога *</label>
          <input
            id="style"
            type="text"
            placeholder="напр. Хатха, Виньяса, Аштанга..."
            {...register('style', { required: 'Стилът е задължителен' })}
            className={errors.style ? 'error' : ''}
          />
          {errors.style && (
            <span className="field-error">{errors.style.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="focus">Фокус *</label>
          <input
            id="focus"
            type="text"
            placeholder="напр. Релаксация, Сила, Гъвкавост..."
            {...register('focus', { required: 'Фокусът е задължителен' })}
            className={errors.focus ? 'error' : ''}
          />
          {errors.focus && (
            <span className="field-error">{errors.focus.message}</span>
          )}
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

export default YogaCourseForm;

