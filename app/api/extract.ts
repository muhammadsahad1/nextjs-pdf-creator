import axios from 'axios'

export const fetchExtractPage = async (fileId: string | null, pages: number[]) => {
    try {
        const pagesparam = pages.join(',')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/extract/${fileId}/${pagesparam}`, {
            responseType: 'blob',
        })
        console.log("response ==>", response)
        return response.data
    } catch (error: any) {
        console.error('Error fetching extracted pages:', error);
    }
}