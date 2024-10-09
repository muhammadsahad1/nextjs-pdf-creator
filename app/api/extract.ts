import axios from 'axios'

export const fetchExtractPage = async (fileId: string | null, pages: number[]) => {
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/extract`, { fileId, pages })
        return response.data
    } catch (error: any) {
        console.error('Error fetching extracted pages:', error);
    }
}