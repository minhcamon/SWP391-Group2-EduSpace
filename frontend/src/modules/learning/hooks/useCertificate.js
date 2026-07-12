import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { toast } from "sonner"
import learnService from "@/services/learnService"
import { runWithLoading } from "@/utils/utils"

export const useCertificate = () => {
  const { classId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [certificateData, setCertificateData] = useState(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      await runWithLoading(setIsLoading, async () => {
        try {
          const data = await learnService.getCertificateDetails(classId)
          setCertificateData(data)
        } catch (error) {
          toast.error(error.message || "Không thể tải thông tin chứng chỉ.")
        }
      })
    }

    if (classId) {
      fetchCertificate()
    }
  }, [classId])

  return {
    isLoading,
    classId,
    certificateData,
    navigate,
  }
}

export default useCertificate
