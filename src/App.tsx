import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import TitlePage from './TitlePage';
import PersonalInfoForm from './PersonalInfoForm';
import ConfirmationPage from './ConfirmationPage';
import DonePage from './DonePage';
import AboutPage from './AboutPage';
import HomePage from './HomePage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import Letter from './Letter.js';
import MyPage from './MyPage';
import { AuthProvider } from './context/AuthContext'; // AuthProvider をインポート

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider を Router の内側に配置 */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/title" element={<TitlePage />} />
          <Route path="/personal-info" element={<PersonalInfoForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/done" element={<DonePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </AuthProvider> {/* AuthProvider を Router の内側に配置 */}
    </Router>
  );
}

export default App;