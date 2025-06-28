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
//import FileViewer from './components/page_components/view_article';
import ArticleReviewList from './components/page_components/article_review';
import ReviewPage from './components/page_components/reviewpage';
import DocumentViewer from './components/page_components/view_article';
import ArticleList from './components/page_components/article_list';
import EditProfilePage from './components/page_components/edit_profile';
import PasswordResetRequest from './components/auth_components/pass_reset';
import PasswordResetConfirm from './components/auth_components/passrescon';
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
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/submission" element={<Submissions />} />
          <Route path="/articles_list" element={<ArticleList/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<ArticleReviewList />} />
          <Route path="/review/:articleId" element={<ReviewPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/fileviewer" element={<DocumentViewer />} />
          <Route path="/passresetreq" element={<PasswordResetRequest />} />
          <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
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
