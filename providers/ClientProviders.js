// app/ClientProviders.js






import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import TopNav from "@/components/Navbar/TopNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { NewsProvider } from "@/contexts/NewsContext";
import { BulletProvider } from "@/contexts/BulletContext";



const ClientProviders = ({ children, initialNews }) => {
  return (
    
        <AuthProvider>
          <NewsProvider initialNews={initialNews}>
            <BulletProvider>

              <Navbar />
              <TopNav />

              <main>{children}</main>
              <footer>
                <Footer />
              </footer>
            </BulletProvider>
          </NewsProvider>
        </AuthProvider>
      
  );
};

export default ClientProviders;
