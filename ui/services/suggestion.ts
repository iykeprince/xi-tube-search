import axiosClient from './client'

export const getSuggestions = async (query: string) => {
    const result = await axiosClient.get(`api/v1/search?query=${query}`)
    console.log('result', result)
    return result.data;
}

export const getSummary = async (videoId: string) => {
    const result = await axiosClient.get(`/api/v1/transcript?video_id=${videoId}`)
    return result.data;
}
