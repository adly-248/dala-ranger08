import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
 
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: 68 }}>
        {children}
      </main>
      <Footer />
    </>
  )
  
}