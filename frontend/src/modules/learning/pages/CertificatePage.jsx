import { useEffect } from "react"
import { Award, Users, Heart, Send, Download, Share2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export const CertificatePage = () => {
  const { user } = useAuth()

  const userName = user?.fullName || "Lê Hoàng Nam"
  const partnerName = "Nguyễn Văn A"
  const courseTitle = "Mastering Java Spring Boot Framework"
  const certificateId = "EDU-JSB-2023-9942"
  const completionDate = "24 tháng 10, 2023"

  // Confetti Particle Effect in React
  useEffect(() => {
    const container = document.getElementById("confetti-container")
    if (!container) return

    const colors = ["#3525cd", "#fd761a", "#4f46e5", "#ffdbca", "#6ef8e7"]

    const createConfetti = () => {
      const fragment = document.createDocumentFragment()
      for (let i = 0; i < 40; i++) {
        const confetti = document.createElement("div")
        confetti.style.position = "absolute"
        confetti.style.width = Math.random() * 8 + 4 + "px"
        confetti.style.height = Math.random() * 8 + 4 + "px"
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.left = Math.random() * 100 + "vw"
        confetti.style.top = "-10px"
        confetti.style.borderRadius = "2px"
        confetti.style.opacity = Math.random().toString()
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`

        fragment.appendChild(confetti)

        const duration = Math.random() * 3 + 2
        const destinationY = window.innerHeight + 10
        const destinationX = (Math.random() - 0.5) * 200

        confetti.animate(
          [
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            {
              transform: `translate(${destinationX}px, ${destinationY}px) rotate(${Math.random() * 1000}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: duration * 1000,
            easing: "cubic-bezier(0, .9, .57, 1)",
            fill: "forwards",
          },
        )

        setTimeout(() => confetti.remove(), duration * 1000)
      }
      container.appendChild(fragment)
    }

    createConfetti()
    const interval = setInterval(createConfetti, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleSendGratitude = () => {
    toast.success(`Đã gửi lời cảm ơn chân thành đến ${partnerName}!`)
  }

  const handleDownloadPdf = () => {
    toast.info("Đang khởi tạo tải xuống chứng chỉ PDF...")
  }

  const handleShareLinkedIn = () => {
    toast.success("Đã sao chép liên kết chứng chỉ để chia sẻ lên LinkedIn!")
  }

  return (
    <div className='relative w-full overflow-hidden bg-bg-base py-12 px-4 md:px-8 flex flex-col items-center justify-center min-h-screen text-neutral-dark'>
      {/* Background Confetti Container */}
      <div
        id='confetti-container'
        className='pointer-events-none fixed inset-0 w-full h-full z-0'
      />

      <div className='z-10 w-full max-w-4xl text-center flex flex-col items-center gap-8'>
        {/* Hero Heading */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl md:text-5xl font-extrabold text-primary leading-tight max-w-3xl'>
            Chúc mừng bạn đã chinh phục thành công <span className='text-secondary'>Java Spring Boot!</span>
          </h1>
          <p className='text-sm md:text-base text-neutral-medium max-w-2xl mx-auto'>
            Chúng tôi tự hào về nỗ lực không ngừng nghỉ của bạn trong suốt 6 tuần qua.
          </p>
        </div>

        {/* Certificate Preview */}
        <div className='w-full bg-white rounded-2xl p-6 md:p-12 relative border border-border-light/45 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl'>
          {/* Inner Decorative Border */}
          <div className='absolute inset-4 border border-border-light/20 pointer-events-none'></div>

          <div className='relative flex flex-col items-center gap-6'>
            <div className='flex items-center gap-2 mb-2'>
              <Award className='text-primary w-10 h-10 animate-bounce-slow' />
              <span className='text-xs font-bold tracking-widest text-neutral-medium uppercase'>
                Certificate of Completion
              </span>
            </div>

            <p className='text-sm italic text-neutral-medium'>This is to certify that</p>
            <h2 className='text-2xl md:text-4xl font-extrabold text-neutral-dark border-b-2 border-primary/20 px-8 pb-2'>
              {userName}
            </h2>
            <p className='text-sm text-neutral-medium'>has successfully completed the intensive course</p>
            <h3 className='text-xl md:text-2xl font-bold text-primary'>{courseTitle}</h3>

            <div className='flex flex-col md:flex-row justify-between w-full mt-10 items-center md:items-end gap-6 md:gap-0'>
              <div className='text-center md:text-left text-xs text-neutral-medium space-y-1 font-semibold'>
                <p>Date: {completionDate}</p>
                <p>ID: {certificateId}</p>
              </div>

              {/* Pair Learning Model Badge */}
              <div className='bg-primary/5 px-4 py-3 rounded-xl flex items-center gap-3 border border-primary/10 shadow-xs animate-pulse-slow shrink-0'>
                <Users className='text-primary w-7 h-7' />
                <div className='text-left'>
                  <p className='text-[10px] font-bold text-primary leading-none mb-1 uppercase tracking-wider'>
                    Pair Learning Model
                  </p>
                  <p className='text-xs font-bold text-neutral-dark'>
                    Bạn đồng hành: {partnerName}
                  </p>
                </div>
              </div>

              <div className='text-center md:text-right text-xs text-neutral-dark font-semibold'>
                <div className='w-24 h-12 bg-slate-50 border border-slate-100 rounded flex items-center justify-center mb-1 mx-auto md:ml-auto'>
                  <span className='text-xs italic text-neutral-light font-medium'>Signature</span>
                </div>
                <p className='text-neutral-medium'>Course Instructor</p>
              </div>
            </div>
          </div>

          {/* Subtle Radial Pattern Background */}
          <div
            className='absolute inset-0 opacity-[0.03] pointer-events-none'
            style={{
              backgroundImage: "radial-gradient(#3525cd 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Kudos Section */}
        <div className='flex flex-col md:flex-row items-center gap-4 bg-slate-50/70 p-5 rounded-2xl w-full max-w-2xl border border-border-light/35 shadow-xs'>
          <div className='relative shrink-0'>
            <img
              alt='Partner Avatar'
              className='w-16 h-16 rounded-full border-4 border-white shadow-md object-cover'
              src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'
            />
            <div className='absolute -bottom-1 -right-1 bg-secondary text-white p-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm'>
              <Heart className='w-3 h-3 fill-white' />
            </div>
          </div>

          <div className='grow text-center md:text-left space-y-1'>
            <p className='text-sm text-neutral-dark leading-relaxed font-medium'>
              <span className='font-bold text-primary'>{partnerName}</span> đã cùng bạn vượt qua mọi thử thách.
            </p>
            <p className='text-xs text-neutral-medium leading-relaxed font-semibold'>
              Thành công này có một phần đóng góp lớn từ người bạn đồng hành của bạn.
            </p>
          </div>

          <button
            onClick={handleSendGratitude}
            className='px-5 py-2.5 bg-primary hover:bg-[#3f38c9] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer'
          >
            <Send className='w-3.5 h-3.5' />
            Gửi lời cảm ơn
          </button>
        </div>

        {/* Primary Actions */}
        <div className='flex flex-col sm:flex-row gap-4 w-full justify-center mt-2'>
          <button
            onClick={handleDownloadPdf}
            className='px-8 py-3.5 bg-secondary hover:bg-secondary/95 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer'
          >
            <Download className='w-4 h-4' />
            Tải xuống Chứng chỉ (PDF)
          </button>
          <button
            onClick={handleShareLinkedIn}
            className='px-8 py-3.5 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer'
          >
            <Share2 className='w-4 h-4' />
            Chia sẻ lên LinkedIn
          </button>
        </div>
      </div>
    </div>
  )
}

export default CertificatePage
