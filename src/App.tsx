// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './Header';
// import TitlePage from './TitlePage';
// import PersonalInfoForm from './PersonalInfoForm';
// import ConfirmationPage from './ConfirmationPage';
// import DonePage from './DonePage';
// import AboutPage from './AboutPage';
// import HomePage from './HomePage';
// import SignUpPage from './SignUpPage';
// import LoginPage from './LoginPage';
// import Letter from './Letter'; // .js 拡張子は不要です
// import MyPage from './MyPage';
// import { AuthProvider } from './context/AuthContext';
// import Template from './Template'; // 正しいコンポーネント名に修正

// function App() {
//   return (
//     <Router>
//       <AuthProvider> {/* AuthProvider を Router の内側に配置 */}
//         <Header />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/title" element={<TitlePage />} />
//           <Route path="/template" element={<Template />} /> {/* 正しいコンポーネントを指定 */}
          
//           <Route path="/personal-info" element={<PersonalInfoForm />} />
//           <Route path="/confirm" element={<ConfirmationPage />} />
//           <Route path="/done" element={<DonePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/signup" element={<SignUpPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/letter" element={<Letter />} />
//           <Route path="/mypage" element={<MyPage />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

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

// コンテキストプロバイダーのインポート
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider を Router の内側に配置 */}
        <Header />
        <Routes>
          {/* 最初に表示されるコンポーネントをルートパスに設定 */}
          <Route path="/" element={<Template />} />
          
          {/* 他のルートを以下に配置 */}
          <Route path="/personal-info" element={<PersonalInfoForm />} />
          <Route path="/confirm" element={<ConfirmationPage />} />
          <Route path="/done" element={<DonePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/mypage" element={<MyPage />} />
          
          {/* 必要に応じて他のルートを追加 */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
