export function getExamStatusInfo(status?: string | null) {
  const normalizedStatus = status?.trim().toLowerCase() ?? 'draft'

  switch (normalizedStatus) {
    case 'active':
      return { label: 'פעיל', color: 'success' as const }
    case 'closed':
      return { label: 'סגור', color: 'primary' as const }
    case 'draft':
    default:
      return { label: 'טיוטה', color: 'default' as const }
  }
}

export function isExamActive(status?: string | null) {
  return (status?.trim().toLowerCase() ?? 'draft') === 'active'
}

export function isExamClosed(status?: string | null) {
  return (status?.trim().toLowerCase() ?? 'draft') === 'closed'
}
