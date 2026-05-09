import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ReviewQueue from '../../src/components/ReviewQueue'
import { storage } from '../../src/logic/db'
import { scheduler } from '../../src/logic/scheduler'

vi.mock('../../src/logic/db', () => ({
  storage: {
    getAllChallenges: vi.fn(),
    getCardsByUser: vi.fn(),
  },
}))

vi.mock('../../src/logic/scheduler', () => ({
  scheduler: {
    getDueCards: vi.fn(),
  },
}))

const mockProblems = [
  { title: 'Two Sum', difficulty: 'Easy' },
  { title: 'Reverse String', difficulty: 'Medium' },
]

beforeEach(() => {
  storage.getAllChallenges.mockResolvedValue([
    { id: 1, title: 'Two Sum' },
    { id: 2, title: 'Reverse String' },
  ])
  storage.getCardsByUser.mockResolvedValue([])
  scheduler.getDueCards.mockResolvedValue([{ challengeId: 1 }])
})

test('clicking Back calls onBack', async () => {
  const onBack = vi.fn()

  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={onBack} />)

  await waitFor(() => screen.getByRole('button', { name: 'Back' }))
  await userEvent.click(screen.getByRole('button', { name: 'Back' }))

  expect(onBack).toHaveBeenCalled()
})

test('clicking a due problem calls onSelectProblem with that problem', async () => {
  const onSelectProblem = vi.fn()

  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={onSelectProblem} onBack={vi.fn()} />)

  await waitFor(() => screen.getByText('DUE'))
  await userEvent.click(screen.getByText('Two Sum'))

  expect(onSelectProblem).toHaveBeenCalledWith(mockProblems[0])
})

test('clicking a new problem calls onSelectProblem with that problem', async () => {
  const onSelectProblem = vi.fn()

  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={onSelectProblem} onBack={vi.fn()} />)

  await waitFor(() => screen.getByText('NEW'))
  await userEvent.click(screen.getByText('Reverse String'))

  expect(onSelectProblem).toHaveBeenCalledWith(mockProblems[1])
})

test('stat counts show 1 due and 1 new with mixed queue', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)

  await waitFor(() => {
    // both stat-value divs render "1"
    expect(screen.getAllByText('1')).toHaveLength(2)
  })
})

test('shows empty state when no problems are due or new', async () => {
  storage.getAllChallenges.mockResolvedValue([{ id: 1, title: 'Two Sum' }])
  // a card with reps defined means it has been reviewed and has a future due date
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { reps: 3 } },
  ])
  scheduler.getDueCards.mockResolvedValue([])

  render(
    <ReviewQueue
      userId={1}
      problems={[{ title: 'Two Sum', difficulty: 'Easy' }]}
      onSelectProblem={vi.fn()}
      onBack={vi.fn()}
    />
  )

  await waitFor(() => {
    expect(screen.getByText("You're all caught up! No problems due right now.")).toBeInTheDocument()
  })
})

test('scheduled problems with a future due date are not shown in the list', async () => {
  // both cards have reps defined (reviewed) but are not in dueCards (future scheduled)
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { reps: 3 } },
    { challengeId: 2, fsrsCard: { reps: 1 } },
  ])
  scheduler.getDueCards.mockResolvedValue([])

  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)

  await waitFor(() => {
    expect(screen.queryByText('Two Sum')).not.toBeInTheDocument()
    expect(screen.queryByText('Reverse String')).not.toBeInTheDocument()
  })
})

test('stat counts show 0 due and 0 new for empty queue', async () => {
  storage.getCardsByUser.mockResolvedValue([
    { challengeId: 1, fsrsCard: { reps: 2 } },
    { challengeId: 2, fsrsCard: { reps: 4 } },
  ])
  scheduler.getDueCards.mockResolvedValue([])

  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)

  await waitFor(() => {
    expect(screen.getAllByText('0')).toHaveLength(2)
  })
})
