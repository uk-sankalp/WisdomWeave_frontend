import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/Layout'
import { ServerWakeOverlay } from './components/ServerWakeOverlay'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PostDetail } from './pages/PostDetail'
import { NewPost } from './pages/NewPost'
import { Profile } from './pages/Profile'
import { AdminDashboard } from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <ServerWakeOverlay />
          <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
