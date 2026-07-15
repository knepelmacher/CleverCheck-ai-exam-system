import { Link } from 'react-router-dom';
import type { ExamCardModel } from '../../types';

type Props = {
  exam: ExamCardModel;
};

const statusLabel = (status: ExamCardModel['status']) => {
  const labels: Record<ExamCardModel['status'], string> = {
    Active: 'פעיל',
    Draft: 'עתידי',
    Closed: 'סגור',
  };
  return labels[status] ?? 'Closed';
};

export const ExamCard = ({ exam }: Props) => {
  const actionText =
    exam.status === 'Closed'
      ? 'צפייה בתוצאות'
      : exam.status === 'Active'
        ? 'המשך מבחן'
        : 'התחל מבחן';

  const destination =
    exam.status === 'Closed'
      ? `/results/${exam.examId}`
      : `/exam/${exam.examId}`;

  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'grid', gap: 8 }}>
      <h3 style={{ margin: 0 }}>{exam.name}</h3>
      <div>מקצוע: {exam.subject}</div>
      <div>סטטוס: {statusLabel(exam.status)}</div>
      <div>משך: {exam.durationMinutes} דקות</div>
      <Link to={destination} style={{ justifySelf: 'start', padding: '8px 12px', background: '#2563eb', color: 'white', borderRadius: 8, textDecoration: 'none' }}>
        {actionText}
      </Link>
    </article>
  );
};

