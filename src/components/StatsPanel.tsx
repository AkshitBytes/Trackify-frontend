import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProgressRing from './ProgressRing';
import { Target, CheckCircle2, Clock, BookOpen } from 'lucide-react';

interface StatsData {
  overview: {
    total: number;
    done: number;
    solvedToday: number;
    inProgress: number;
    todo: number;
    revision: number;
    progress: number;
  };
}

const StatsPanel: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  if (!stats) return <div className="glass-panel" style={{ height: '200px' }}></div>;

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
      
      {/* Overall Progress */}
      <div style={{ flexShrink: 0 }}>
        <ProgressRing
          progress={stats.overview.progress}
          solved={stats.overview.done}
          total={stats.overview.total}
          size={140}
          strokeWidth={12}
          color="var(--accent-success)"
          confettiMode="fireworks"
        />
      </div>

      {/* Stats Grid */}
      <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Target size={18} /> <span>Total Questions Solved</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.overview.done}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)' }}>
            <CheckCircle2 size={18} /> <span>Done</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.overview.done}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warning)' }}>
            <Clock size={18} /> <span>In Progress</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.overview.inProgress}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)' }}>
            <BookOpen size={18} /> <span>Revision</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.overview.revision}</span>
        </div>

      </div>

      {/* Solved Today Summary */}
      <div style={{ 
        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: '1.5rem', minWidth: '180px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={18} color="var(--accent-success)" /> <span>Solved Today</span>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>
          {stats.overview.solvedToday} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>questions</span>
        </div>
      </div>

    </div>
  );
};

export default StatsPanel;
