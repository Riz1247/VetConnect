import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
// Importing components
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserTypeSelect from "./components/UserTypeSelect";
import UserDashboard from "./components/UserDashboard";
import ShelterDashboard from "./components/ShelterDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PetList from "./components/PetList";
import CreatePetAdPage from "./components/CreatePetAdPage";
import ShelterList from "./components/ShelterList";
import ShelterBookingForm from "./components/ShelterBookingForm";
import ShelterPayment from "./components/ShelterPayment";
import Navbar from "./components/Navbar";
import ProfileRouter from "./components/ProfileRouter"; 
import AppointmentForm from './components/AppointmentForm';
import AppointmentSlip from './components/AppointmentSlip';
import EmergencyVet from './components/EmergencyVet';
import ChatBot from './components/ChatBot';
import Forum from './components/Forum';
import FAQ from './components/FAQ';
// Profile-specific pages (used in ProfileRouter internally)
import UserProfilePage from "./components/UserProfilePage";     
import ShelterProfilePage from "./components/ShelterProfilePage"; 

import './App.css';
import './styles.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "230127747685-97hkrk2841dsf2l0fvo9gb3tnmj44let.apps.googleusercontent.com";

function AppContent() {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => {
      setShowLoginModal(true);
      setShowSignupModal(false);
    };

    const handleOpenSignup = () => {
      setShowSignupModal(true);
      setShowLoginModal(false);
    };

    window.addEventListener('openLoginModal', handleOpenLogin);
    window.addEventListener('openSignupModal', handleOpenSignup);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLogin);
      window.removeEventListener('openSignupModal', handleOpenSignup);
    };
  }, []);

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const hideNavbar = location.pathname.includes('/medical-appointment/') || 
                    location.pathname === '/book-appointment' ||
                    location.pathname === '/emergency-vet' ||
                    location.pathname === '/admin-dashboard' ||
                    location.pathname === '/forum' ||
                    location.pathname === '/faq';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-user-type" element={<UserTypeSelect />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/create-ad" element={<CreatePetAdPage />} />
        <Route path="/shelters" element={<ShelterList />} />
        <Route path="/shelter-booking/:shelterId" element={<ShelterBookingForm />} />
        <Route path="/shelter-payment" element={<ShelterPayment />} />
        <Route path="/profile" element={<ProfileRouter />} />
        <Route path="/book-appointment" element={<AppointmentForm />} />
        <Route path="/medical-appointment/:id" element={<AppointmentSlip />} />
        <Route path="/emergency-vet" element={<EmergencyVet />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      <ChatBot />

      {showLoginModal && (
        <div className="modal show" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModals}>&times;</span>
            <h2>Login</h2>
            <Login />
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal show" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModals}>&times;</span>
            <h2>Sign Up</h2>
            <Register />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
