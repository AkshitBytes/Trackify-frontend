import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { ExternalLink } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface Question {
  _id: string;
  title: string;
  topic: string;
  pattern?: string;
  difficulty: string;
  status: string;
  link: string;
  order: number;
}

interface DragDropBoardProps {
  questions: Question[];
  onRefresh: () => void;
  searchTerm: string;
}

const COLUMNS = [
  { id: 'todo', title: 'Question', color: 'var(--text-secondary)' },
  { id: 'in-progress', title: 'In Progress', color: 'var(--accent-warning)' },
  { id: 'done', title: 'Completed', color: 'var(--accent-success)' },
  { id: 'revision', title: 'Revision', color: 'var(--accent-danger)' },
];

const EMPTY_COLUMN_MESSAGES: Record<string, string[]> = {
  todo: ['No pending questions yet.', 'Quiet zone. Drag one challenge here.'],
  'in-progress': ['Nothing cooking right now.', 'Pick one and start grinding.'],
  done: ['All done here. Beast mode.', 'No unfinished business.'],
  revision: ['Revision shelf is clean.', 'Memory lane is empty for now.'],
};

const DragDropBoard: React.FC<DragDropBoardProps> = ({ questions, onRefresh, searchTerm }) => {
  const [localQuestions, setLocalQuestions] = useState<Question[]>([]);
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedPatterns, setExpandedPatterns] = useState<string[]>([]);
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

  useEffect(() => {
    // Sort by order
    setLocalQuestions([...questions].sort((a, b) => a.order - b.order));
  }, [questions]);

  const toTitleCase = (value: string) => {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const filteredQuestions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return localQuestions;
    return localQuestions.filter((q) => {
      const patternText = q.pattern || '';
      return (
        q.title.toLowerCase().includes(search) ||
        q.topic.toLowerCase().includes(search) ||
        patternText.toLowerCase().includes(search)
      );
    });
  }, [localQuestions, searchTerm]);

  const groupedMap = useMemo(() => {
    const map: Record<string, Record<string, Question[]>> = {};

    filteredQuestions.forEach((question) => {
      const topic = toTitleCase(question.topic || 'Other');
      const pattern = toTitleCase((question.pattern || 'General').trim());
      if (!map[topic]) map[topic] = {};
      if (!map[topic][pattern]) map[topic][pattern] = [];
      map[topic][pattern].push(question);
    });

    return map;
  }, [filteredQuestions]);

  const groupedTopics = useMemo(
    () =>
      Object.entries(groupedMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([topic, patterns]) => ({
          topic,
          patterns: Object.entries(patterns)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([pattern, items]) => ({
              pattern,
              items: items.sort((a, b) => a.order - b.order),
            })),
        })),
    [groupedMap]
  );

  useEffect(() => {
    if (!groupedTopics.length) {
      setExpandedTopics([]);
      setExpandedPatterns([]);
      setHasAutoExpanded(false);
      return;
    }

    if (!hasAutoExpanded) {
      const firstTopic = groupedTopics[0];
      const firstPatternKey = firstTopic.patterns[0]
        ? `${firstTopic.topic}::${firstTopic.patterns[0].pattern}`
        : null;
      setExpandedTopics([firstTopic.topic]);
      setExpandedPatterns(firstPatternKey ? [firstPatternKey] : []);
      setHasAutoExpanded(true);
      return;
    }

    const validTopics = new Set(groupedTopics.map((t) => t.topic));
    setExpandedTopics((prev) => prev.filter((topic) => validTopics.has(topic)));

    const validPatternKeys = new Set(
      groupedTopics.flatMap((topic) =>
        topic.patterns.map((pattern) => `${topic.topic}::${pattern.pattern}`)
      )
    );
    setExpandedPatterns((prev) => prev.filter((key) => validPatternKeys.has(key)));
  }, [groupedTopics, hasAutoExpanded]);

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const togglePattern = (topic: string, pattern: string) => {
    const key = `${topic}::${pattern}`;
    setExpandedPatterns((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const onDragStart = (event: React.DragEvent, question: Question) => {
    setDraggedQuestion(question);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', question._id);
  };

  const onDragEnd = () => {
    setDraggedQuestion(null);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const moveQuestionToStatus = async (question: Question, nextStatus: string) => {
    if (question.status === nextStatus) return;
    const previous = localQuestions;
    setLocalQuestions((prev) =>
      prev.map((q) => (q._id === question._id ? { ...q, status: nextStatus } : q))
    );

    try {
      await api.patch(`/questions/${question._id}/status`, { status: nextStatus });
      onRefresh();
    } catch (error) {
      console.error('Failed to move question', error);
      setLocalQuestions(previous);
    }
  };

  const onDrop = async (event: React.DragEvent, status: string) => {
    event.preventDefault();
    if (!draggedQuestion) return;
    await moveQuestionToStatus(draggedQuestion, status);
    setDraggedQuestion(null);
  };

  const renderQuestionCard = (q: Question) => (
    <div
      key={q._id}
      draggable
      onDragStart={(event) => onDragStart(event, q)}
      onDragEnd={onDragEnd}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '0.75rem',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'grab',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span
            className={`diff-${q.difficulty}`}
            style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: 'auto' }}
          >
            {q.difficulty}
          </span>
        </div>
        <h4
          style={{
            fontSize: '0.95rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            textDecoration: q.status === 'done' ? 'line-through' : 'none',
            opacity: q.status === 'done' ? 0.7 : 1,
          }}
        >
          {q.title}
        </h4>
        {q.link && (
          <a
            href={q.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
            }}
          >
            Solve link <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );

  if (!groupedTopics.length) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No questions found for this search.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
      {groupedTopics.map((topicGroup) => {
        const topicIsOpen = expandedTopics.includes(topicGroup.topic);
        const topicTotal = topicGroup.patterns.reduce((acc, pattern) => acc + pattern.items.length, 0);
        const topicSolved = topicGroup.patterns.reduce(
          (acc, pattern) => acc + pattern.items.filter((q) => q.status === 'done').length,
          0
        );
        const topicProgress = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

        return (
          <div key={topicGroup.topic} className="glass-panel" style={{ padding: '0.9rem 1rem' }}>
            <button
              type="button"
              onClick={() => toggleTopic(topicGroup.topic)}
              style={{
                width: '100%',
                textAlign: 'left',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>{topicGroup.topic}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {topicSolved}/{topicTotal} solved
                </span>
              </div>
              <ProgressRing
                progress={topicProgress}
                solved={topicSolved}
                total={topicTotal}
                size={56}
                strokeWidth={6}
                color="var(--accent-primary)"
                showBreakdown={false}
                confettiEnabled
              />
            </button>

            {topicIsOpen && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topicGroup.patterns.map((patternGroup) => {
                  const key = `${topicGroup.topic}::${patternGroup.pattern}`;
                  const patternIsOpen = expandedPatterns.includes(key);
                  return (
                    <div key={key} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => togglePattern(topicGroup.topic, patternGroup.pattern)}
                        style={{ width: '100%', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}
                      >
                        {patternGroup.pattern} ({patternGroup.items.length})
                      </button>

                      {patternIsOpen && (
                        <div style={{ marginTop: '0.8rem', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
                          {COLUMNS.map((col) => {
                            const items = patternGroup.items.filter((q) => q.status === col.id);
                            return (
                              <div
                                key={`${key}-${col.id}`}
                                onDragOver={onDragOver}
                                onDrop={(event) => onDrop(event, col.id)}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: 'var(--radius-md)',
                                  minHeight: '320px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <div style={{ padding: '0.7rem 0.9rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: col.color, fontWeight: 600, fontSize: '0.85rem' }}>{col.title}</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{items.length}</span>
                                </div>
                                <div style={{ padding: '0.8rem', flex: 1, overflowY: 'auto' }}>
                                  {items.length ? (
                                    items.map(renderQuestionCard)
                                  ) : (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                      <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>
                                        {EMPTY_COLUMN_MESSAGES[col.id][0]}
                                      </div>
                                      <div>{EMPTY_COLUMN_MESSAGES[col.id][1]}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DragDropBoard;
