import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './Dashboard.css';

const Dashboard = () => {

  return (
    <div className="dashboard">
      <PageHeader />
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <Link to="/courses" className="dashboard-card">
            <div className="card-icon">📚</div>
            <h2>Курсове</h2>
            <p>Управление на курсове</p>
          </Link>

          <Link to="/asanas" className="dashboard-card">
            <div className="card-icon">🧘</div>
            <h2>Асани</h2>
            <p>Управление на асани</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

