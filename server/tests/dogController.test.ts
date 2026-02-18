import { describe, test, expect, vi, beforeEach} from 'vitest'
import { getDogImage } from '../controllers/dogController'
import * as dogService from '../services/dogService'
import { Request, Response } from 'express'

describe('dogController.getDogImage', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })


    test('should return success true and mocked dog data', async () => {
        const mockDogData = {
                imageUrl: 'https://images.dog.ceo/breeds/terrier-tibetan/n02097474_3314.jpg',
                status: 'success'
            };

        vi.spyOn(dogService,'getRandomDogImage')
            .mockResolvedValue(mockDogData)
        
        const jsonMock = vi.fn()
        const statusMock = vi.fn().mockReturnValue({ json: jsonMock})

        const res = {
            json: jsonMock,
            status: statusMock
        } as unknown as Response

        const req = {} as Request

        await getDogImage(req,res)

        expect(dogService.getRandomDogImage).toHaveBeenCalledOnce()
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: mockDogData
        })
    })
})