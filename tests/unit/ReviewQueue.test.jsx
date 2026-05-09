import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ReviewQueue from '../../src/components/ReviewQueue'

vi.mock('../../src/logic/db', () => ({
  storage: {
    getAllChallenges: vi.fn().mockResolvedValue([
      { id: 1, title: 'Two Sum' },
      { id: 2, title: 'Reverse String' },
    ]),
    getCardsByUser: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('../../src/logic/scheduler', () => ({
  scheduler: {
    getDueCards: vi.fn().mockResolvedValue([{ challengeId: 1 }]),
  },
}))

const mockProblems = [
  { title: 'Two Sum', difficulty: 'Easy' },
  { title: 'Reverse String', difficulty: 'Medium' },
]

test('shows loading state before data arrives', () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  expect(screen.getByText('Loading queue...')).toBeInTheDocument()
})

test('renders Review Queue heading after data loads', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Review Queue' })).toBeInTheDocument()
  })
})

test('renders the Back button', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })
})

test('renders the Due for Review stat label', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  // appears in both the stat card and the queue section title
  await waitFor(() => {
    expect(screen.getAllByText('Due for Review').length).toBeGreaterThanOrEqual(1)
  })
})

test('renders the New Problems stat label', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  // appears in both the stat card and the queue section title
  await waitFor(() => {
    expect(screen.getAllByText('New Problems').length).toBeGreaterThanOrEqual(1)
  })
})

test('renders a DUE badge next to due problems', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByText('DUE')).toBeInTheDocument()
  })
})

test('renders a NEW badge next to new problems', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })
})

test('renders the title of a due problem', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
  })
})

test('renders the title of a new problem', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByText('Reverse String')).toBeInTheDocument()
  })
})

test('renders difficulty labels for all listed problems', async () => {
  render(<ReviewQueue userId={1} problems={mockProblems} onSelectProblem={vi.fn()} onBack={vi.fn()} />)
  await waitFor(() => {
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })
})
