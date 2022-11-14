import { describe, it, expect } from 'vitest'
import { plainGetPhotoCredits } from '../src/utils/misc'


// http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Steffen-Roth-7-optimized.jpg
// http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-optimized.jpg
// http://localhost:4444/wp-content/uploads/2022/05/Franz-Xaver-Zeller©-Elena-Zaucke-18.jpg
// 


describe('PhotoCredits', () => {
    it('resolves on normal input name', () => {
        expect(plainGetPhotoCredits('http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Steffen-Roth-7-optimized.jpg')).toBe('Steffen Roth')
        expect(plainGetPhotoCredits('http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-7-optimized.jpg')).toBe('Christian Van Dalen')
        expect(plainGetPhotoCredits('http://localhost:4444/wp-content/uploads/2022/07/Helen-Woigk%C2%A9Christian-van-dalen-optimized.jpg')).toBe('Christian Van Dalen')
        expect(plainGetPhotoCredits('http://localhost:4444/wp-content/uploads/2022/05/Franz-Xaver-Zeller©-Elena-Zaucke-18.jpg')).toBe('Elena Zaucke')
    })

    it('resolves on somewhat normal input name', () => {
        expect(plainGetPhotoCredits('Christian A. Koch_© Jan Merkle (29).jpg')).toBe('Jan Merkle')
        expect(plainGetPhotoCredits('http://localhost:4444/wp-content/uploads/2022/08/Ausschnitt_Christian_A._Koch__c__Jan_Merkle__12_.jpg')).toBe('Jan Merkle')
    })

    it('resolves on normal input name', () => {
        expect(plainGetPhotoCredits('Jutta_Fastian_2021_©Marlene_Rahmann_High_Res_78-scaled.jpg')).toBe('Marlene Rahmann')
    })
})