import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SideNav from './components/SideNav';
import PerfumeDetail from './pages/PerfumeDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  // Admin dashboard has its own layout
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col font-sans transition-colors duration-300">
        {children}
      </div>
    );
  }

  // Auth pages - full screen, no side nav
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] font-sans">
        {children}
      </div>
    );
  }

  // Main layout with side navigation
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <SideNav />
      <main className="md:ml-20 min-h-screen">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="petale-theme">
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
