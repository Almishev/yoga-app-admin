import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import AsanaList from '../components/AsanaList';
import AsanaForm from '../components/AsanaForm';
import './Asanas.css';

const Asanas = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAsana, setEditingAsana] = useState(null);

  const handleCreateNew = () => {
    setEditingAsana(null);
    setShowForm(true);
  };

  const handleEdit = (asana) => {
    setEditingAsana(asana);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingAsana(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsana(null);
  };

  return (
    <div className="asanas-page">
      <PageHeader />
      {showForm ? (
        <div className="form-container">
          <AsanaForm
            asana={editingAsana}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <AsanaList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      )}
    </div>
  );
};

export default Asanas;

