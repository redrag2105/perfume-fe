import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import Footer from './components/footer';
import PerfumeDetail from './pages/PerfumeDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="aura-theme">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Toaster />
          <Routes>
            <Route path="/admin" element={
              <RootLayout>
                <AdminDashboard />
              </RootLayout>
            } />
            <Route path="*" element={
              <RootLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/perfumes/:id" element={<PerfumeDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RootLayout>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;