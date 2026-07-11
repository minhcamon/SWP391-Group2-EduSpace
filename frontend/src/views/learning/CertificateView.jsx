import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import { CertificatePage } from "@/modules/learning"

const CertificateView = () => {
  return (
    <div className='min-h-screen w-full bg-bg-base flex flex-col'>
      <Header />
      <div>
        <CertificatePage />
      </div>
      <Footer />
    </div>
  )
}

export default CertificateView
