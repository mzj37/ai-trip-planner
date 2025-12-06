import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import TripDetail from './pages/TripDetail';
import SharedTrip from './pages/SharedTrip';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plan" element={<TripPlanner />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/share/:shareId" element={<SharedTrip />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;