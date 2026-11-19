const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByRole('button', { text: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('väärä')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.locator('input[type="text"]').fill('mluukkai')
      await page.locator('input[type="password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()

      await page.getByPlaceholder('title').fill('Test Title')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()

      await page.getByPlaceholder('title').fill('Test Like')
      await page.getByPlaceholder('author').fill('Like Author')
      await page.getByPlaceholder('url').fill('http://like.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Like Like Author')).toBeVisible()

      await page.getByText('Test Like Like Author').click()

      await expect(page.getByText('0 likes')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('user who added blog can delete', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()

      await page.getByPlaceholder('title').fill('Test Delete')
      await page.getByPlaceholder('author').fill('Delete Author')
      await page.getByPlaceholder('url').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Delete Delete Author')).toBeVisible()

      await page.getByText('Test Delete Delete Author').click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Test Delete Delete Author')).not.toBeVisible()
    })
  })
})
