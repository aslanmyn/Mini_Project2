import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import PasswordResetRequest from './PasswordResetRequest';
import PasswordResetConfirm from './PasswordResetConfirm';
import ResumeUpload from './ResumeUpload';
import JobMatch from './JobMatch';
import Navbar from "./Navbar";
import About from "./About";
import Vacancy from "./Vacancy";
import Profile from './Profile';
import ResumeMatch from './ResumeMatch';
import VacancyCreate from './VacancyCreate';
import VacancyEdit from './VacancyEdit';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordResetRequest />} />
        <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/match" element={<JobMatch />} />
        <Route path="/about" element={<About />} />
        <Route path="/vacancies" element={<Vacancy />} />
        <Route path="/vacancies/create" element={<VacancyCreate />} />
        <Route path="/vacancies/edit/:id" element={<VacancyEdit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match-resume" element={<ResumeMatch />} />
      </Routes>
    </Router>
  );
};

export default App;

