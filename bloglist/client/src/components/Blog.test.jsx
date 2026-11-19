import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'
import OneBlog from './OneBlog'

test('form calls event with details when a new blog is made', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing forms')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing forms')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
})

const blog = {
  id: 999999,
  title: 'Testing Title',
  author: 'Test Author',
  url: 'http://test.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

test('blog info and likes shown but buttons not to not logged in user', () => {
  render(<OneBlog blog={blog} user={null} />)

  expect(screen.getByText('Testing Title')).toBeDefined()
  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText('Added by testuser')).toBeDefined()

  expect(screen.queryByText('remove')).toBeNull()
  expect(screen.queryByText('like')).toBeNull()
})



test('logged in but not creator sees only like button', () => {
  render(<OneBlog blog={blog} user={{ username: 'notcreator', name: 'Not Creator' }} />)

  expect(screen.getByText('Testing Title')).toBeDefined()
  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText('Added by testuser')).toBeDefined()
  expect(screen.getByText('like')).toBeDefined()

  expect(screen.queryByText('remove')).toBeNull()
})

test('blog creator also sees remove button', () => {
  render(<OneBlog blog={blog} user={{ username: 'testuser', name: 'Test User' }} />)

  expect(screen.getByText('Testing Title')).toBeDefined()
  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText('Added by testuser')).toBeDefined()
  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})
