import { useState } from "react"
import { MessageSquare, Send, CheckCircle, ShieldAlert, Award, FileText } from "lucide-react"
import Button from "@/components/ui/Button"

const ResultReview = ({
  isGraded,
  peerReviewPending,
  myReviewResult,
  peerReviewTask,
  peerReviewGraded,
  submitPeerReview,
}) => {
  const [scores, setScores] = useState(() => {
    const initialScores = {}
    peerReviewTask?.rubricCriterias?.forEach((criterion) => {
      initialScores[criterion.criterionName] = criterion.score ?? 0
    })
    return initialScores
  })
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScoreChange = (criterionName, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionName]: Number(value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!peerReviewTask) return

    // Map scores state back to rubric criteria list
    const criteriaScores = peerReviewTask.rubricCriterias.map((c) => ({
      criterionName: c.criterionName,
      description: c.description,
      maxPoint: c.maxPoint,
      score: scores[c.criterionName] || 0,
    }))

    // Compute final score as the sum of all scores
    const finalScore = criteriaScores.reduce((sum, c) => sum + c.score, 0)

    setIsSubmitting(true)
    try {
      await submitPeerReview(criteriaScores, finalScore, comments)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Row 1: Grading partner's essay (Peer Review) */}
      <section className='grid grid-cols-1 lg:grid-cols-10 gap-8'>
        {/* Partner Essay Content */}
        <div className='lg:col-span-6 bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5'>
          <div className='flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0'>
            <FileText className='w-5 h-5 text-primary' />
            <div>
              <h2 className='text-base font-bold text-neutral-dark'>
                {peerReviewTask
                  ? `Bài viết của ${peerReviewTask.submitterName}`
                  : "Bài viết của bạn cùng tiến"}
              </h2>
              <p className='text-xs text-neutral-medium mt-0.5'>
                {peerReviewTask
                  ? "Bạn học đã hoàn thành nộp bài tập"
                  : "Đang chờ bạn học nộp bài..."}
              </p>
            </div>
          </div>

          {peerReviewTask ? (
            <div className='prose max-w-none text-sm leading-relaxed text-neutral-dark p-5 bg-bg-base/30 rounded-xl border border-border-light/20 min-h-75 whitespace-pre-wrap font-sans'>
              {peerReviewTask.submissionContent}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-12 text-center bg-bg-base/20 border border-dashed border-border-light/40 rounded-xl min-h-75'>
              <ShieldAlert className='w-8 h-8 text-neutral-medium/40 mb-3 animate-pulse' />
              <h4 className='text-sm font-bold text-neutral-dark'>Chưa có bài viết của bạn học</h4>
              <p className='text-xs text-neutral-medium mt-1 max-w-sm'>
                Bạn học trong nhóm chưa hoàn thành nộp bài viết. Hệ thống sẽ hiển thị bài làm tại
                đây để bạn chấm điểm ngay khi họ nộp bài.
              </p>
            </div>
          )}
        </div>

        {/* Grading Panel / Graded Scores Panel */}
        <div className='lg:col-span-4 flex flex-col'>
          {peerReviewTask ? (
            peerReviewGraded ? (
              /* Already Graded */
              <div className='bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5 h-full'>
                <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
                  <CheckCircle className='w-5 h-5 text-success' />
                  <h3 className='text-sm font-bold text-neutral-dark'>
                    Bạn đã hoàn thành chấm điểm
                  </h3>
                </div>

                <div className='flex flex-col gap-4'>
                  {peerReviewTask.rubricCriterias?.map((criterion) => (
                    <div
                      key={criterion.criterionName}
                      className='space-y-1'
                    >
                      <div className='flex justify-between items-center text-xs font-semibold'>
                        <span className='text-neutral-medium'>{criterion.criterionName}</span>
                        <span className='text-primary font-bold'>
                          {criterion.score} / {criterion.maxPoint} điểm
                        </span>
                      </div>
                      <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-success rounded-full'
                          style={{ width: `${(criterion.score / criterion.maxPoint) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Needs Grading Form */
              <form
                onSubmit={handleSubmit}
                className='bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5 h-full'
              >
                <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
                  <Award className='w-5 h-5 text-primary' />
                  <h3 className='text-sm font-bold text-neutral-dark'>
                    Đánh giá bài viết của bạn học
                  </h3>
                </div>

                <div className='flex grow flex-col gap-5 overflow-y-auto max-h-75 pr-1'>
                  {peerReviewTask.rubricCriterias?.map((criterion) => (
                    <div
                      key={criterion.criterionName}
                      className='space-y-2'
                    >
                      <div className='flex justify-between items-center text-xs font-bold'>
                        <span className='text-neutral-dark'>{criterion.criterionName}</span>
                        <span className='text-primary'>
                          {scores[criterion.criterionName] || 0} / {criterion.maxPoint} đ
                        </span>
                      </div>
                      <p className='text-[11px] text-neutral-medium leading-normal'>
                        {criterion.description}
                      </p>
                      <input
                        type='range'
                        min='0'
                        max={criterion.maxPoint}
                        step='1'
                        value={scores[criterion.criterionName] || 0}
                        onChange={(e) => handleScoreChange(criterion.criterionName, e.target.value)}
                        className='w-full accent-primary h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer'
                      />
                    </div>
                  ))}
                </div>

                <div className='flex flex-col gap-2 pt-2 border-t border-slate-100'>
                  <label
                    htmlFor='grading-comments'
                    className='text-xs font-bold text-neutral-dark flex items-center gap-1.5'
                  >
                    <MessageSquare className='w-3.5 h-3.5 text-primary' />
                    Góp ý chi tiết
                  </label>
                  <textarea
                    id='grading-comments'
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder='Nhập nhận xét xây dựng, các lỗi từ vựng/ngữ pháp và lời khuyên giúp bạn học cải thiện...'
                    rows='3'
                    required
                    className='w-full p-3 border border-border-light/60 rounded-xl bg-bg-base/30 text-xs outline-hidden focus:border-primary focus:bg-white transition-all resize-none leading-relaxed font-sans text-neutral-dark focus:ring-1 focus:ring-primary'
                  />
                </div>

                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  className='w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 shadow-xs'
                >
                  <Send className='w-3.5 h-3.5' /> Gửi điểm & nhận xét
                </Button>
              </form>
            )
          ) : (
            <div className='bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col items-center justify-center text-center h-full min-h-55'>
              <ShieldAlert className='w-8 h-8 text-neutral-medium/40 mb-3' />
              <h4 className='text-sm font-bold text-neutral-dark'>Chưa ghép cặp</h4>
              <p className='text-xs text-neutral-medium mt-1 max-w-50'>
                Vui lòng chờ bạn học nộp bài tập để bắt đầu chấm chéo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Row 2: Your Grading Results */}
      <section className='bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs'>
        <div className='flex items-center gap-2 border-b border-slate-100 pb-4 shrink-0 mb-5'>
          <Award className='w-5 h-5 text-secondary' />
          <h2 className='text-lg font-bold text-neutral-dark'>Kết quả đánh giá của bạn</h2>
        </div>

        {isGraded && myReviewResult ? (
          <div className='grid grid-cols-1 md:grid-cols-10 gap-6 items-start'>
            {/* Right: Rubric criteria scores */}
            <div className='md:col-span-6 space-y-4'>
              <h3 className='text-sm font-bold text-neutral-dark mb-3'>
                Điểm số chi tiết từ bạn cùng tiến
              </h3>
              {myReviewResult.rubricCriterias?.map((criterion) => (
                <div
                  key={criterion.criterionName}
                  className='space-y-1'
                >
                  <div className='flex justify-between items-center text-xs font-semibold'>
                    <span className='text-neutral-medium'>{criterion.criterionName}</span>
                    <span className='text-secondary font-bold'>
                      {criterion.score} / {criterion.maxPoint} điểm
                    </span>
                  </div>
                  <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-secondary rounded-full'
                      style={{ width: `${(criterion.score / criterion.maxPoint) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Left: Comments and Estimated Band Score */}
            <div className='md:col-span-4 bg-bg-base/40 rounded-xl p-5 border border-border-light/25 flex flex-col gap-4'>
              <div className='flex justify-between items-center border-b border-border-light/20 pb-3'>
                <span className='text-sm font-bold text-neutral-dark'>Tổng điểm bài làm</span>
                <span className='text-lg font-extrabold text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-xl border border-secondary/15'>
                  {myReviewResult.rubricCriterias?.reduce((sum, c) => sum + (c.score || 0), 0)} điểm
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <span className='text-xs font-bold text-neutral-medium flex items-center gap-1.5'>
                  <MessageSquare className='w-3.5 h-3.5 text-secondary' />
                  Nhận xét góp ý:
                </span>
                <p className='text-xs text-neutral-dark font-sans leading-relaxed italic bg-white p-3 rounded-lg border border-slate-100 mt-1'>
                  "{myReviewResult.comments || "Bài làm không có nhận xét"}"
                </p>
              </div>
            </div>
          </div>
        ) : peerReviewPending ? (
          <div className='flex flex-col items-center justify-center p-8 text-center bg-bg-base/20 border border-dashed border-border-light/40 rounded-xl'>
            <ShieldAlert className='w-8 h-8 text-secondary/40 mb-3 animate-pulse' />
            <h4 className='text-sm font-bold text-neutral-dark'>Đang chờ bạn học chấm điểm</h4>
            <p className='text-xs text-neutral-medium mt-1 max-w-md'>
              Bài viết của bạn đang được ghép cặp chấm chéo. Điểm số và nhận xét sẽ tự động hiển thị
              ở đây ngay sau khi bạn đồng hành chấm xong.
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-8 text-center bg-bg-base/20 border border-dashed border-border-light/40 rounded-xl'>
            <ShieldAlert className='w-8 h-8 text-neutral-medium/30 mb-3' />
            <h4 className='text-sm font-bold text-neutral-dark'>Chưa có kết quả</h4>
            <p className='text-xs text-neutral-medium mt-1 max-w-sm'>
              Vui lòng hoàn thành nộp bài làm của bạn trước để bắt đầu luồng đánh giá chéo.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default ResultReview
