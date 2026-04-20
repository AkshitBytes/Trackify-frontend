import React, { useState } from 'react';
import api from '../api/axios';
import { X } from 'lucide-react';

interface AddQuestionModalProps {
  onClose: () => void;
  onAdded: () => void;
}

const TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs',
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Binary Search', 'Sorting',
  'Hashing', 'Heap', 'Trie', 'Bit Manipulation', 'Math', 'Two Pointers',
  'Sliding Window', 'Recursion', 'Other'
];

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Arrays',
    customTopic: '',
    pattern: '',
    difficulty: 'Medium',
    link: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalTopic = formData.customTopic.trim() || formData.topic;
      await api.post('/questions', {
        title: formData.title,
        topic: finalTopic,
        pattern: formData.pattern,
        difficulty: formData.difficulty,
        link: formData.link,
        notes: formData.notes,
      });
      onAdded();
    } catch (err) {
      console.error('Failed to add question', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(148, 163, 184, 0.35)', backdropFilter: 'blur(2px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add New Question</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title</label>
            <input 
              type="text" required value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Two Sum" />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Topic</label>
              <select value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Add New Topic (Optional)</label>
            <input
              type="text"
              value={formData.customTopic}
              onChange={e => setFormData({ ...formData, customTopic: e.target.value })}
              placeholder="e.g. Graph"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Pattern / Subcategory</label>
            <input
              type="text"
              value={formData.pattern}
              onChange={e => setFormData({ ...formData, pattern: e.target.value })}
              placeholder="e.g. DFS, Sliding Window, Prefix Sum"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Question Link (Optional)</label>
            <input 
              type="url" value={formData.link} 
              onChange={e => setFormData({...formData, link: e.target.value})} 
              placeholder="https://leetcode.com/problems/..." />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
