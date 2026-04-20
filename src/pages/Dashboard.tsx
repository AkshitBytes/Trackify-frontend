import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsPanel from '../components/StatsPanel';
import DragDropBoard from '../components/DragDropBoard';
import AddQuestionModal from '../components/AddQuestionModal';
import api from '../api/axios';
import { Plus, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Failed to fetch questions', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleQuestionAdded = () => {
    setShowAddModal(false);
    triggerRefresh();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="page-container" style={{ flex: 1, paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Your Progress</h2>
            <p style={{ color: 'var(--text-muted)' }}>Track, analyze, and stay consistent.</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Question
          </button>
        </div>

        <StatsPanel refreshTrigger={refreshTrigger} />

        <div style={{ marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Question Board</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search by title, topic, or pattern"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </div>

        <DragDropBoard questions={questions} onRefresh={triggerRefresh} searchTerm={searchTerm} />
      </main>

      {showAddModal && <AddQuestionModal onClose={() => setShowAddModal(false)} onAdded={handleQuestionAdded} />}
    </div>
  );
};

export default Dashboard;
