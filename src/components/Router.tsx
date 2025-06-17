import { Routes, Route } from 'react-router-dom';
import DoctorSearch from './DoctorSearch';
import DoctorDetails from './DoctorDetails';
import BookAppointment from './BookAppointment';
import { DoctorChatbot } from './DoctorChatbot';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DoctorSearch />} />
      <Route path="/doctor/:doctorId" element={<DoctorDetails />} />
      <Route path="/book/:doctorId" element={<BookAppointment />} />
      <Route path="/chat" element={<DoctorChatbot />} />
    </Routes>
  );
}