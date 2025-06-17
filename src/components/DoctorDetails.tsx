import { Star, MapPin, Phone, Clock, Calendar, Award, Users, ArrowLeft, Check, MessageCircle, Bot } from "lucide-react";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DoctorChatbot } from './DoctorChatbot';

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
  total_reviews: number;
  years_in_practice: number;
  new_patient_accepting: boolean;
  telehealth_available: boolean;
  insurance_networks: string[];
  next_available_appointment: string;
  education: string[];
  certifications: string[];
  languages: string[];
  hospital_affiliations: string[];
}

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - in real app would fetch from API
    const mockDoctor: Doctor = {
      doctor_id: doctorId || '',
      name: 'Dr. Sarah Johnson',
      specialties: ['Cardiology', 'Internal Medicine'],
      practice_name: 'Manhattan Heart Center',
      practice_address: '123 Medical Plaza',
      practice_city: 'New York',
      practice_state: 'NY',
      phone: '(555) 123-4567',
      overall_rating: 4.8,
      total_reviews: 127,
      years_in_practice: 15,
      new_patient_accepting: true,
      telehealth_available: true,
      insurance_networks: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'United Healthcare'],
      next_available_appointment: '2024-01-15T09:00:00',
      education: ['MD, Harvard Medical School', 'Residency, Johns Hopkins Hospital', 'Fellowship, Mayo Clinic'],
      certifications: ['Board Certified in Cardiology', 'Board Certified in Internal Medicine', 'Advanced Cardiac Life Support'],
      languages: ['English', 'Spanish', 'French'],
      hospital_affiliations: ['NewYork-Presbyterian Hospital', 'Mount Sinai Hospital']
    };

    const mockReviews: Review[] = [
      {
        id: '1',
        patient_name: 'John D.',
        rating: 5,
        comment: 'Dr. Johnson is exceptional. She took the time to explain my condition thoroughly and made me feel comfortable throughout the entire process.',
        date: '2024-01-10',
        verified: true
      },
      {
        id: '2',
        patient_name: 'Maria S.',
        rating: 5,
        comment: 'Highly recommend! Very knowledgeable and caring doctor. The office staff is also wonderful.',
        date: '2024-01-08',
        verified: true
      },
      {
        id: '3',
        patient_name: 'Robert K.',
        rating: 4,
        comment: 'Great experience overall. Dr. Johnson was thorough in her examination and provided clear treatment options.',
        date: '2024-01-05',
        verified: true
      }
    ];

    setDoctor(mockDoctor);
    setReviews(mockReviews);
    setLoading(false);
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <Button onClick={() => navigate('/')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Doctor Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    <p className="text-xl text-gray-600 mb-2">{doctor.practice_name}</p>
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.practice_address}, {doctor.practice_city}, {doctor.practice_state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.specialties.map(specialty => (
                    <Badge key={specialty} variant="default" className="text-sm">{specialty}</Badge>
                  ))}
                  {doctor.new_patient_accepting && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <Check className="h-3 w-3 mr-1" />
                      Accepting New Patients
                    </Badge>
                  )}
                  {doctor.telehealth_available && (
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Telehealth Available
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {renderStars(doctor.overall_rating)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{doctor.overall_rating}</p>
                    <p className="text-sm text-gray-500">{doctor.total_reviews} reviews</p>
                  </div>
                  <div>
                    <Award className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-gray-900">{doctor.years_in_practice}</p>
                    <p className="text-sm text-gray-500">Years Experience</p>
                  </div>
                  <div>
                    <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-gray-900">{doctor.insurance_networks.length}</p>
                    <p className="text-sm text-gray-500">Insurance Plans</p>
                  </div>
                  <div>
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-bold text-gray-900">Next Available</p>
                    <p className="text-sm text-gray-500">{new Date(doctor.next_available_appointment).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full py-3 text-lg"
                  onClick={() => navigate(`/book/${doctor.doctor_id}`, { 
                    state: { doctor } 
                  })}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="w-full py-3">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Office
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <Bot className="w-4 h-4" />
              Ask AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Specialties & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Medical Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map(specialty => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Board Certifications</h4>
                    <ul className="space-y-1">
                      {doctor.certifications.map((cert, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Practice Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Languages Spoken</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map(language => (
                        <Badge key={language} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Hospital Affiliations</h4>
                    <ul className="space-y-1">
                      {doctor.hospital_affiliations.map((hospital, index) => (
                        <li key={index} className="text-sm text-gray-600">{hospital}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Available Services</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        In-person consultations
                      </div>
                      {doctor.telehealth_available && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Telehealth appointments
                        </div>
                      )}
                      {doctor.new_patient_accepting && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Accepting new patients
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{edu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Reviews</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(doctor.overall_rating)}
                      <span className="ml-2 text-2xl font-bold">{doctor.overall_rating}</span>
                    </div>
                    <span className="text-gray-500">Based on {doctor.total_reviews} reviews</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.patient_name}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Accepted Insurance Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctor.insurance_networks.map((insurance, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{insurance}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Insurance coverage may vary. Please contact the office to verify your specific plan is accepted and to understand any out-of-pocket costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <DoctorChatbot 
                doctorId={doctor.doctor_id}
                doctorName={doctor.name}
                doctorSpecialty={doctor.specialties[0]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}