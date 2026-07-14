import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import classService from '@/services/classService'
import { toast } from 'sonner'

export const useClassDetails = (classId) => {
  const [searchParams] = useSearchParams()
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setIsLoading(true)
        const classDetailRes = await classService.getClassById(classId)
        const classInfo = classDetailRes.data

        if (classInfo) {
          const updatedClassData = {
            classId: classInfo.classId,
            cohortName: classInfo.cohortName,
            courseId: classInfo.courseId,
            courseTitle: classInfo.courseTitle,
            status: classInfo.status,
            totalStudents: classInfo.totalStudents,
            activePersonnel: [],
            leaderboard: {
              individual: [],
              pairs: []
            }
          }

          // 1. Fetch community groups (pairs)
          try {
            const communityResponse = await classService.getCommunity(classId)
            const communityData = communityResponse?.data
            if (communityData) {
              const mappedPersonnel = communityData.map((group, idx) => {
                const members = (group.members || []).map((member) => ({
                  id: member.userId,
                  name: member.fullName || member.username || 'Học viên',
                  avatar:
                    member.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'
                }))

                const memberNames = members.map(m => m.name)
                let pairName = `Nhóm ${String(idx + 1).padStart(2, '0')}`
                if (memberNames.length === 1) {
                  pairName = `${memberNames[0]} (Độc hành)`
                } else if (memberNames.length >= 2) {
                  pairName = memberNames.join(' & ')
                }

                return {
                  id: group.studyGroupId || idx,
                  pairName,
                  status:
                    group.status === 'ACTIVE' || group.status === 'OPENING'
                      ? 'ACTIVE'
                      : 'IN BREAK',
                  members
                }
              })
              updatedClassData.activePersonnel = mappedPersonnel
            }
          } catch (communityErr) {
            console.warn(
              'Failed to fetch community groups for class details:',
              communityErr
            )
          }

          // 2. Fetch Leaderboard ranking
          try {
            const leaderboardRes = await classService.getClassLeaderboard(classId)
            if (leaderboardRes && leaderboardRes.data) {
              updatedClassData.leaderboard = {
                individual: leaderboardRes.data.individual || [],
                pairs: leaderboardRes.data.pairs || []
              }
            }
          } catch (leaderboardErr) {
            console.warn('Failed to fetch class leaderboard:', leaderboardErr)
          }

          setClassData(updatedClassData)
        } else {
          setError('Không tìm thấy thông tin lớp học.')
        }
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin lớp học.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassDetails()
  }, [classId, searchParams])

  const findStudyBuddy = () => {
    toast.info('Đang tìm kiếm bạn học đồng hành...')
  }

  return {
    classData,
    isLoading,
    error,
    findStudyBuddy
  }
}

export default useClassDetails
