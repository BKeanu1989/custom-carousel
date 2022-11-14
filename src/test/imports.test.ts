import { describe, test, expect } from 'vitest'

describe('import vue components', () => {
    test('Slider import', async () => {
        // @ts-ignore
        const cmp = await import('../components/Slider.vue')
        expect(cmp).toBeDefined()
    })

    test('Slide import', async () => {
        // @ts-ignore
        const cmp = await import('../components/Slide.vue')
        expect(cmp).toBeDefined()
    })

    test('Pagination import', async () => {
        // @ts-ignore
        const cmp = await import('../components/Pagination.vue')
        expect(cmp).toBeDefined()
    })

    test('Navigation import', async () => {
        // @ts-ignore
        const cmp = await import('../components/Navigation.vue')
        expect(cmp).toBeDefined()
    })

    test('PaginationIndicator import', async () => {
        // @ts-ignore
        const cmp = await import('../components/PaginationIndicator.vue')
        expect(cmp).toBeDefined()
    })


    test('PaginationItem import', async () => {
        // @ts-ignore
        const cmp = await import('../components/PaginationItem.vue')
        expect(cmp).toBeDefined()
    })
})