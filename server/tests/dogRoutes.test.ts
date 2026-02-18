import { describe, test, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'



vi.mock('../controllers/dogController', () => ({
    getDogImage: vi.fn(async (_req: any, res: any) => res.json({})),
}))

import dogRoutes from '../routes/dogRoutes'
import * as dogController from '../controllers/dogController'

describe('dogRoutes GET /api/dogs/random ', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test('should return status code 200 and mocked dog image JSON', async () => {
        const mockedImageUrl =
            'https://images.dog.ceo/breeds/terrier-tibetan/n02097474_3314.jpg';


        (dogController.getDogImage as unknown as ReturnType<typeof vi.fn>).mockImplementation(
            async (_req, res) => {
                res.status(200).json({
                    success: true,
                    data: {
                        imageUrl: mockedImageUrl,
                        status: 'success',
                    },
                })
            }
        )

        const app = express()
        app.use('/api/dogs', dogRoutes)

        const response = await request(app).get('/api/dogs/random')

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.data.imageUrl).toContain(mockedImageUrl)
    })

    test('should return status 500 and error JSON', async () => {
        (dogController.getDogImage as unknown as ReturnType<typeof vi.fn>).mockImplementation(
            async (_req, res) => {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch dog image: Network error',
                })
            }
        )

        const app = express()
        app.use('/api/dogs', dogRoutes)

        const response = await request(app).get('/api/dogs/random')

        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            success: false,
            error: 'Failed to fetch dog image: Network error',
        })
    })
})