import { Calendar, Clock, User, Phone, Mail, ArrowLeft, CircleCheck } from "lucide-react";
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Doctor {
  doctor_id: string;
  name: string;
  specialties: string[];
  practice_name: string;
  practice_address: string;
  practice_city: string;
  practice_state: string;
  phone: string;
  overall_rating: number;
  telehealth_available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    reasonForVisit: '',
    insuranceProvider: ''
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    // Get doctor info from location state or fetch from API
    if (location.state?.doctor) {
      setDoctor(location.state.doctor);
    } else {
      // Mock doctor data - in real app would fetch from API
      const mockDoctor: Doctor = {
        doctor_id: doctorId || '',
        name: 'Dr. Sarah Johnson',
        specialties: ['Cardiology'],
        practice_name: 'Manhattan Heart Center',
        practice_address: '123 Medical Plaza',
        practice_city: 'New York',
        practice_state: 'NY',
        phone: '(555) 123-4567',
        overall_rating: 4.8,
        telehealth_available: true
      };
      setDoctor(mockDoctor);
    }
  }, [doctorId, location.state]);

  useEffect(() => {
    if (selectedDate) {
      // Mock available time slots - in real app would fetch from API
      const mockSlots: TimeSlot[] = [
        { time: '09:00 AM', available: true },
        { time: '09:30 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '11:30 AM', available: true },
        { time: '02:00 PM', available: true },
        { time: '02:30 PM', available: true },
        { time: '03:00 PM', available: false },
        { time: '03:30 PM', available: true },
        { time: '04:00 PM', available: true },
        { time: '04:30 PM', available: true }
      ];
      setAvailableSlots(mockSlots);
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !patientInfo.firstName || !patientInfo.lastName) {
      return;
    }

    setLoading(true);
    
    // Mock booking process - in real app would submit to API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBooked(true);
    setLoading(false);
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for this example
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CircleCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 mb-4">
              Your appointment with {doctor?.name} has been successfully scheduled.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold">Appointment Details:</p>
              <p className="text-sm text-gray-600">
                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
              </p>
              <p className="text-sm text-gray-600 capitalize">{appointmentType} appointment</p>
            </div>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/')}>
                Search for More Doctors
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(-2)}>
                Back to Doctor Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Schedule your visit with {doctor.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Appointment Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={appointmentType} onValueChange={setAppointmentType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person">In-Person Visit</Label>
                    </div>
                    {doctor.telehealth_available && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="telehealth" id="telehealth" />
                        <Label htmlFor="telehealth">Telehealth (Video Call)</Label>
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {getNextWeekDates().map((date) => (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                        className={`p-3 text-center border rounded-lg transition-colors ${
                          selectedDate === date.toISOString().split('T')[0]
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-sm">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Selection */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Select Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-2 text-sm border rounded-lg transition-colors ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : selectedTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={patientInfo.firstName}
                        onChange={(e) => setPatientInfo({...patientInfo, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={patientInfo.lastName}
                        onChange={(e) => setPatientInfo({...patientInfo, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientInfo.email}
                        onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={patientInfo.phone}
                        onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={patientInfo.dateOfBirth}
                        onChange={(e) => setPatientInfo({...patientInfo, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurance">Insurance Provider</Label>
                      <Input
                        id="insurance"
                        value={patientInfo.insuranceProvider}
                        onChange={(e) => setPatientInfo({...patientInfo, insuranceProvider: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe the reason for your visit..."
                      value={patientInfo.reasonForVisit}
                      onChange={(e) => setPatientInfo({...patientInfo, reasonForVisit: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg"
                disabled={loading || !selectedDate || !selectedTime || !patientInfo.firstName || !patientInfo.lastName}
              >
                {loading ? 'Booking Appointment...' : 'Book Appointment'}
              </Button>
            </form>
          </div>

          {/* Doctor Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.practice_name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doctor.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary" className="text-xs">{specialty}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Phone className="h-4 w-4" />
                    {doctor.phone}
                  </div>
                  <div className="text-sm text-gray-600">
                    {doctor.practice_address}, {doctor.practice_city}, {doctor.practice_state}
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Selected Appointment</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Type:</strong> <span className="capitalize">{appointmentType}</span></p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 text-xs text-gray-500">
                  <p>By booking this appointment, you agree to the practice's terms and conditions. Please arrive 15 minutes early for in-person appointments.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}