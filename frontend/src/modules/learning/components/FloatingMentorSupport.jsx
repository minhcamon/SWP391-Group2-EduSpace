import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { LifeBuoy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import learnService from '@/services/learnService'
import MentorSupportRequestModal from './MentorSupportRequestModal'

const FloatingMentorSupport = ({ shiftLeft = false }) => {
    const { courseId: routeCourseId, classId: routeClassId } = useParams()
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [resolvedIds, setResolvedIds] = useState({ courseId: null, classId: null })
    const [studyGroup, setStudyGroup] = useState([])
    const [studyGroupId, setStudyGroupId] = useState(null)

    useEffect(() => {
        const resolveDetails = async () => {
            try {
                let courseId = routeCourseId ? Number(routeCourseId) : null
                let classId = routeClassId ? Number(routeClassId) : null

                // 1. Resolve courseId and classId using getMyLearningCourses
                const myCourses = await learnService.getMyLearningCourses()

                if (courseId && !classId) {
                    const current = myCourses.find(c => c.courseId === courseId)
                    if (current) classId = current.classId
                } else if (classId && !courseId) {
                    const current = myCourses.find(c => c.classId === classId)
                    if (current) courseId = current.courseId
                }

                setResolvedIds({ courseId, classId })

                if (classId) {
                    // 2. Fetch progress dashboard to resolve study group details
                    const dashboard = await learnService.getProgressDashboard(classId)

                    // Find first module containing partner or use the first module's studyGroupId
                    const activeMod = dashboard?.modules?.find(m => m.partner) || dashboard?.modules?.[0]
                    if (activeMod?.studyGroupId) {
                        setStudyGroupId(activeMod.studyGroupId)
                    }

                    // Build studyGroup list for the dropdown in the modal
                    const groupList = []
                    if (user) {
                        groupList.push({
                            id: user.id,
                            name: user.fullName || user.username
                        })
                    }
                    if (activeMod?.partner) {
                        groupList.push({
                            id: activeMod.partner.partnerId,
                            name: activeMod.partner.name
                        })
                    }
                    setStudyGroup(groupList)
                }
            } catch (error) {
                console.warn("FloatingMentorSupport failed to resolve learning context:", error)
            }
        }

        if (user && (routeCourseId || routeClassId)) {
            resolveDetails()
        }
    }, [routeCourseId, routeClassId, user])

    // Don't render if we couldn't resolve a valid classId
    if (!resolvedIds.classId) return null

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 transition-all duration-300 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:scale-105 active:scale-95 cursor-pointer group ${shiftLeft ? 'right-80 sm:right-[370px]' : 'right-6'
                    }`}
                title="Yêu cầu Mentor hỗ trợ"
            >
                <LifeBuoy size={24} className="text-white group-hover:rotate-45 transition-transform duration-300" />

                {/* Tooltip Label */}
                <span className="absolute right-16 scale-0 transition-all duration-200 origin-right rounded bg-neutral-dark px-3 py-1.5 text-xs text-white group-hover:scale-100 whitespace-nowrap font-bold shadow-md">
                    Yêu cầu Mentor hỗ trợ
                </span>
            </button>

            <MentorSupportRequestModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                courseId={resolvedIds.courseId}
                classId={resolvedIds.classId}
                studyGroupId={studyGroupId}
                studyGroup={studyGroup}
            />
        </>
    )
}

export default FloatingMentorSupport
