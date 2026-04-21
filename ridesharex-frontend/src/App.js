// import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import NoPage from './pages/NoPage';
import UserProfile from './pages/UserProfile';
import CreateRide from './pages/CreateRide';
import Register from './pages/Register';
import Header from './components/Header';
import MyRequests from './pages/MyRequests';
import DriverRequests from './pages/DriverRequests';
import FareEstimator from './pages/FareEstimator';
import DriverMap from './pages/DriverMap';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/rides" element={<Home />} />
        <Route path='/profile' element={<UserProfile />} />
      
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create-ride' element={<CreateRide />} />
        <Route path='/my-requests' element={<MyRequests />} />
        <Route path="/driver" element={<DriverRequests />} />
        <Route path="/fare" element={<FareEstimator />} />
       <Route path="/driver-map/:username" element={<DriverMap />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
