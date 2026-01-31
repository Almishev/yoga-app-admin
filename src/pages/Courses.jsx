import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import CourseList from '../components/CourseList';
import CourseForm from '../components/CourseForm';
import './Courses.css';

const Courses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleCreateNew = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  return (
    <div className="courses-page">
      <PageHeader />
      {showForm ? (
        <div className="form-container">
          <CourseForm
            course={editingCourse}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <CourseList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      )}
    </div>
  );
};

export default Courses;

