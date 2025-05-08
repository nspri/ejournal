import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/utility_components/Navbar';
import Login from './components/auth_components/login';
import { Box } from '@mui/material';
import Registration from './components/auth_components/Register';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div sx={{ backgroundColor: '#c0d3d9' }}>
        <Router>
          <Navbar />
          <Box height={50}></Box>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
          {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
      </Routes> */}
        </Router>
      </div>

    </>
  )
}

export default App
