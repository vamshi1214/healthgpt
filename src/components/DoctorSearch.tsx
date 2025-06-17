import { Star, MapPin, Phone, Users, Stethoscope, Send, Sparkles, ArrowRight, Zap, Clock, Check, AlertTriangle, ListFilter } from "lucide-react";
import React, { useState } from 'react';
import { doctorFinderServiceFindDoctors } from '@/lib/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  practice_name: string;
  practice_city: string;
  practice_state: string;
  overall_rating: number;
  total_reviews: number;
  new_patient_accepting: boolean;
  telehealth_available: boolean;
  match_score: number;
  match_reasons: string[];
  distance_miles?: number;
}

interface SearchAnalysis {
  urgency_level: string;
  specialties: string[];
  symptoms: string[];
  emergency_indicators?: string[];
  confidence_score: number;
  reasoning: string;
  extracted_location?: string;
  extracted_insurance?: string;
  extracted_preferences?: string[];
}

interface SearchResult {
  doctors: Doctor[];
  analysis: SearchAnalysis;
  total_results: number;
  original_query: string;
}

const DoctorSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [rankingCriteria, setRankingCriteria] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setShowRanking(false);
    
    try {
      const response = await doctorFinderServiceFindDoctors({
        body: {
          query: query.trim(),
          user_location: undefined,
          user_latitude: undefined,
          user_longitude: undefined,
          max_distance_miles: 50,
          insurance_provider: undefined
        }
      });
      
      if (response.data) {
        setResults(response.data as SearchResult);
      }
    } catch (err) {
      setError('Failed to search for doctors. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const getDetectedCriteria = () => {
    if (!results?.analysis) return [];
    
    const criteria = [];
    
    // Extract location from query (simple pattern matching)
    const locationMatch = query.match(/in ([A-Z][a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/i);
    if (locationMatch) criteria.push({ label: 'Location', value: locationMatch[1] });
    
    // Extract insurance from query
    const insuranceMatch = query.match(/(blue cross|aetna|cigna|united healthcare|kaiser|anthem|humana)/i);
    if (insuranceMatch) criteria.push({ label: 'Insurance', value: insuranceMatch[1] });
    
    if (results.analysis.specialties?.length) criteria.push({ label: 'Specialty', value: results.analysis.specialties.join(', ') });
    if (results.analysis.urgency_level) criteria.push({ label: 'Urgency', value: results.analysis.urgency_level });
    if (results.analysis.symptoms?.length) criteria.push({ label: 'Symptoms', value: results.analysis.symptoms.join(', ') });
    
    return criteria;
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'urgent': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'routine': return <Check className="w-4 h-4 text-green-500" />;
      default: return <Stethoscope className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            HealthGPT
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 ml-2">
              by Juicebox
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Find exactly the right doctor for you, in seconds.
          </p>
          <p className="text-blue-600 font-medium mt-2 cursor-pointer hover:underline">
            See how it works →
          </p>
          <Link 
            to="/chat" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="mr-2">✨</span>
            Chat with HealthGPT
          </Link>
        </div>

        {/* Main Search Interface */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">What health issue can I help you with?</span>
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="I need a cardiologist in NYC who takes Blue Cross, available this week for chest pain..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg p-6 pr-16 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </Button>
              </div>

              {/* Detected Criteria Pills */}
              {results && (
                <div className="mt-6 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getDetectedCriteria().map((criterion, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{criterion.label}</span>
                        <span className="text-sm text-green-600">·</span>
                        <span className="text-sm text-green-700">{criterion.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* AI Analysis Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">
                    {(results.analysis.confidence_score * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    {getUrgencyIcon(results.analysis.urgency_level)}
                    <div>
                      <p className="text-sm text-gray-600">Urgency Level</p>
                      <p className="font-semibold text-gray-900 capitalize">{results.analysis.urgency_level}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recommended Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {results.analysis.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Detected Symptoms</p>
                    <p className="text-sm text-gray-900">{results.analysis.symptoms.join(', ')}</p>
                  </div>
                </div>

                {results.analysis.emergency_indicators && results.analysis.emergency_indicators.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      Emergency Indicators Detected
                    </div>
                    <p className="text-red-700 text-sm">
                      ⚠️ Consider seeking immediate medical attention or calling emergency services.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Header with Ranking Option */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {results.total_results} Doctor{results.total_results !== 1 ? 's' : ''}
                </h2>
                <p className="text-gray-600 mt-1">Showing all matching doctors in your area</p>
              </div>
              
              {!showRanking && (
                <Button
                  onClick={() => setShowRanking(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <ListFilter className="w-4 h-4" />
                  Rank by my priorities
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Custom Ranking Interface */}
            {showRanking && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What matters most to you? (Select up to 3 priorities)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {['Highest Rating', 'Closest Distance', 'Accepting New Patients', 'Telehealth Available', 'Years of Experience', 'Insurance Coverage'].map((criterion) => (
                      <div
                        key={criterion}
                        onClick={() => {
                          if (rankingCriteria.includes(criterion)) {
                            setRankingCriteria(prev => prev.filter(c => c !== criterion));
                          } else if (rankingCriteria.length < 3) {
                            setRankingCriteria(prev => [...prev, criterion]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          rankingCriteria.includes(criterion)
                            ? 'border-blue-500 bg-blue-100 text-blue-800'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {rankingCriteria.includes(criterion) && <Check className="w-4 h-4" />}
                          <span className="text-sm font-medium">{criterion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={rankingCriteria.length === 0}
                    >
                      Rank Doctors
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowRanking(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Doctor Results Grid */}
            <div className="grid gap-6">
              {results.doctors.map((doctor, index) => (
                <Card 
                  key={doctor.id} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white"
                  onClick={() => navigate(`/doctor/${doctor.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {doctor.name}
                          </h3>
                          <Badge className="bg-green-100 text-green-800 px-2 py-1">
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 font-medium mb-3">{doctor.practice_name}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {doctor.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {(doctor.match_score * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Match Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{doctor.overall_rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-500">({doctor.total_reviews})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{doctor.practice_city}, {doctor.practice_state}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm font-medium ${doctor.new_patient_accepting ? 'text-green-600' : 'text-red-600'}`}>
                          {doctor.new_patient_accepting ? 'Accepting' : 'Full'}
                        </span>
                      </div>
                      
                      {doctor.telehealth_available && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-blue-600 font-medium">Telehealth</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Why this is a great match:</p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.match_reasons.slice(0, 3).map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            ✓ {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;