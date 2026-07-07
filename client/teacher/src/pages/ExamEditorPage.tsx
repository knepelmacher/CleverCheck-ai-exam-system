import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { createExam, getExamById } from '../api/exam.api'
import { getClasses } from '../api/class.api'
import type { ClassDTO } from '../api/class.api'
import type { ExamDraft, QuestionDraft, QuestionTypeValue } from '../models/ExamDraft'

const emptyDraft = (): ExamDraft => ({
  id: crypto.randomUUID(),
  name: '',
  classIds: [],
  baseScore: 100,
  startTime: '',
  endTime: '',
  duration_minutes: 60,
  subject_id: 1,
  questions: [initialQuestion()],
})

const initialQuestion = (): QuestionDraft => ({
  id: crypto.randomUUID(),
  questionType: 'american',
  text: '',
  score: 10,
  options: ['', '', '', ''],
  correctAnswer: '',
})

export default function ExamEditorPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id && id !== 'new'
  const navigate = useNavigate()
  const [classes, setClasses] = useState<ClassDTO[]>([])
  const [loading, setLoading] = useState(!!isEditing)
  const [draft, setDraft] = useState<ExamDraft>(emptyDraft())

  useEffect(() => {
    getClasses()
      .then(setClasses)
      .catch(() => console.error('Failed to load classes'))
  }, [])

  useEffect(() => {
    if (!isEditing) return

    const examId = Number(id)
    getExamById(examId)
      .then((exam) => {
        if (exam) {
          setDraft({
            id: String(exam.id),
            name: exam.examName,
            classIds: (exam as any).classIds ?? [],
            baseScore: exam.questions?.reduce((sum, q) => sum + (q.max_score ?? 10), 0) ?? 100,
            startTime: exam.startTime ? exam.startTime.slice(0, 16) : '',
            endTime: exam.endTime ? exam.endTime.slice(0, 16) : '',
            duration_minutes: exam.durationMinutes,
            subject_id: exam.subjectID,
            questions: exam.questions?.length
              ? exam.questions.map((q) => ({
                  id: String(q.id),
                  questionType: mapQuestionType(q.question_type_id),
                  text: q.question_text,
                  score: q.max_score,
                  options: q.options?.map((o: any) => o.option_text) ?? ['', '', '', ''],
                  correctAnswer: q.correct_answer ?? '',
                }))
              : [initialQuestion()],
          })
        }
      })
      .catch(() => console.error('Failed to load exam'))
      .finally(() => setLoading(false))
  }, [id])

  const mapQuestionType = (typeId: number): QuestionTypeValue => {
    const map: Record<number, QuestionTypeValue> = { 1: 'american', 2: 'open', 3: 'truefalse', 4: 'numeric' }
    return map[typeId] ?? 'american'
  }

  const updateQuestion = (questionId: string, updater: (question: QuestionDraft) => QuestionDraft) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question) => question.id === questionId ? updater(question) : question),
    }))
  }

  const handleSave = async () => {
    await createExam(draft)
    navigate('/exams')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
        <Box>
          <Typography variant="h4" fontWeight={700}>{isEditing ? 'עריכת מבחן' : 'יצירת מבחן'}</Typography>
          <Typography color="text.secondary">{isEditing ? 'ערוך את פרטי המבחן' : 'הוסף שאלות, בחר כיתות והגדר ניקוד.'}</Typography>
        </Box>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>שמור מבחן</Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="שם המבחן" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            <TextField label="ניקוד בסיסי" type="number" value={draft.baseScore} onChange={(event) => setDraft((current) => ({ ...current, baseScore: Number(event.target.value) }))} />
            <FormControl>
              <InputLabel>כיתות מקושרות</InputLabel>
              <Select
                multiple
                value={draft.classIds}
                onChange={(event) => setDraft((current) => ({ ...current, classIds: typeof event.target.value === 'string' ? [Number(event.target.value)] : event.target.value as number[] }))}
                input={<OutlinedInput label="כיתות מקושרות" />}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="מועד התחלה"
              type="datetime-local"
              value={draft.startTime}
              onChange={(event) => setDraft((current) => ({ ...current, startTime: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="מועד סיום"
              type="datetime-local"
              value={draft.endTime}
              onChange={(event) => setDraft((current) => ({ ...current, endTime: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="משך המבחן (דקות)"
              type="number"
              value={draft.duration_minutes}
              onChange={(event) => setDraft((current) => ({ ...current, duration_minutes: Number(event.target.value) }))}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {draft.questions.map((question, index) => (
        <Card key={question.id}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">שאלה {index + 1}</Typography>
                <Chip label={question.questionType} color="primary" variant="outlined" />
              </Stack>
              <TextField label="נוסח השאלה" multiline minRows={2} value={question.text} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, text: event.target.value }))} />
              <TextField label="ניקוד לשאלה" type="number" value={question.score} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, score: Number(event.target.value) }))} />
              <TextField select label="סוג שאלה" value={question.questionType} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, questionType: event.target.value as QuestionTypeValue }))}>
                <MenuItem value="american">אמריקאי</MenuItem>
                <MenuItem value="open">פתוח</MenuItem>
                <MenuItem value="truefalse">נכון/לא נכון</MenuItem>
                <MenuItem value="numeric">מספרי</MenuItem>
              </TextField>
              {question.questionType === 'american' ? (
                <Stack spacing={1}>
                  {question.options.map((option, optionIndex) => (
                    <TextField key={`${question.id}-${optionIndex}`} label={`תשובה ${optionIndex + 1}`} value={option} onChange={(event) => updateQuestion(question.id, (current) => {
                      const nextOptions = [...current.options]
                      nextOptions[optionIndex] = event.target.value
                      return { ...current, options: nextOptions }
                    })} />
                  ))}
                  <TextField label="תשובה נכונה" value={question.correctAnswer} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, correctAnswer: event.target.value }))} />
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDraft((current) => ({ ...current, questions: [...current.questions, initialQuestion()] }))}>הוסף שאלה</Button>
    </Stack>
  )
}
