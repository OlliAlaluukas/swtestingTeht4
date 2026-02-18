import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { getRandomDogImage } from '../services/dogService'


describe('dogService.getRandomImage' , () => {

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('imageUrl should be equal to message in mocked data and status success', async () => {
        const mockDogApiResponse = {
            message: 'https://images.dog.ceo/breeds/terrier-tibetan/n02097474_3314.jpg',
            status: 'success'
        };

        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            json: async () => mockDogApiResponse
        })

        const result = await getRandomDogImage()

        expect(result.imageUrl).toBe(mockDogApiResponse.message)
        expect(result.status).toBe('success')
        expect(fetch).toHaveBeenCalledOnce()
    })

    test ('should reject when API returns ok:false, status: 500 ', async () => {
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: false,
            status: 500
        })
        
        await expect(getRandomDogImage()).rejects.toThrow(
            'Failed to fetch dog image: Dog API returned status 500'
        )
        expect(fetch).toHaveBeenCalledOnce()
    })
})