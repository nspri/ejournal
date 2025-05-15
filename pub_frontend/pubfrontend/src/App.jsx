import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/utility_components/Navbar';
import Login from './components/auth_components/login';
import Home from './components/page_components/Home';
import { Box } from '@mui/material';
import Registration from './components/auth_components/Register';
import Submissions from './components/page_components/submit';
import Dashboard from './components/page_components/Dashboard';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Navbar />
        <Box height={50}></Box>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/submission" element={<Submissions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
        {/* <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
      </Routes> */}
      </Router>
    </>
  )
}

export default App
