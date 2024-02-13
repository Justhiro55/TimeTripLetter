import React from 'react';
// React Routerからのインポート
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// カスタムコンポーネントのインポート
import Header from './Header';
import Template from './Template';
import PersonalInfoForm from './PersonalInfoForm';
import ConfirmationPage from './ConfirmationPage';
import DonePage from './DonePage';
import AboutPage from './AboutPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import Letter from './Letter';
import MyPage from './MyPage';
import AnalogPage from './AnalogPage';
import { AuthProvider } from './context/AuthContext';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider を Router の内側に配置 */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />          
          <Route path="/template" element={<Template />} />          
          <Route path="/personal-info" element={<PersonalInfoForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/done" element={<DonePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/analog" element={<AnalogPage />} />
          {/* <Route path="/digital" element={<DigitalPage />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
