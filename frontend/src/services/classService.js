import axiosClient from '@/lib/axios'

const classService = {
  getClasses: async () => {
    const response = await axiosClient.get('/classes')
    return response.data
  },

  getCommunity: async (classId) => {
    const response = await axiosClient.get(`/class/community/${classId}`)
    return response.data
  },

  getClassById: async (classId) => {
    const response = await axiosClient.get(`/class/${classId}`)
    return response.data
  },

  getClassLeaderboard: async (classId) => {
    const response = await axiosClient.get(`/class/${classId}/leaderboard`)
    return response.data
  }
}

export default classService
