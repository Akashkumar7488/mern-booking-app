
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "../layouts/Layout";
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import ForgotPassword from './components/ForgotPassword';
import EnterOtp from './components/EnterOTP';

const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Layout><p>Home</p></Layout>}/>
         <Route path="/search" element={<Layout><p>Search</p></Layout>}/>
         <Route path="/register" element={<Layout><Register/></Layout>}/>
         <Route path="/sign-in" element={<Layout><SignIn/></Layout>}/>
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
         <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  );
}

export default App;
