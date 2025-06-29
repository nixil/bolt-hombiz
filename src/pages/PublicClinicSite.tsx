import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  CheckCircle,
  Award
} from 'lucide-react';
import { mockClinics } from '../data/mockData';

const PublicClinicSite: React.FC = () => {
  const { clinicSlug } = useParams();
  const clinic = mockClinics.find(c => c.slug === clinicSlug);

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Clinic Not Found</h1>
          <p className="text-gray-600">The clinic you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const testimonials = [
    {
      name: 'Sarah Wilson',
      rating: 5,
      comment: 'Excellent care and very professional staff. Highly recommend!',
      date: '2 weeks ago'
    },
    {
      name: 'Mike Johnson',
      rating: 5,
      comment: 'Quick appointment booking and minimal wait time. Great experience.',
      date: '1 month ago'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={clinic.logo} 
                alt={clinic.name}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <span className="text-xl font-bold text-gray-900">{clinic.name}</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <Link 
                to={`/c/${clinic.slug}/book`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">{clinic.name}</h1>
              <p className="text-xl text-blue-100 mb-8">{clinic.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={`/c/${clinic.slug}/book`}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Book Appointment Now
                </Link>
                <a 
                  href={`tel:${clinic.phone}`}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                >
                  Call {clinic.phone}
                </a>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{clinic.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{clinic.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Comprehensive healthcare services tailored to your needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clinic.services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration} min
                  </span>
                  <span className="text-lg font-bold text-blue-600">${service.price}</span>
                </div>
                <Link 
                  to={`/c/${clinic.slug}/book?service=${service.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  Book This Service
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Working Hours</h2>
              <div className="space-y-4">
                {Object.entries(clinic.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Medical Care</h3>
                    <p className="text-gray-600">Board-certified physicians with years of experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Convenient Scheduling</h3>
                    <p className="text-gray-600">Easy online booking with flexible appointment times</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Services</h3>
                    <p className="text-gray-600">Full range of medical services under one roof</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg font-medium text-gray-900">4.9/5 based on 127 reviews</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{testimonial.name}</span>
                  <span className="text-sm text-gray-500">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Schedule Your Visit?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your appointment today and experience quality healthcare
          </p>
          <Link 
            to={`/c/${clinic.slug}/book`}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={clinic.logo} 
                  alt={clinic.name}
                  className="w-8 h-8 rounded-full object-cover mr-3"
                />
                <span className="text-xl font-bold">{clinic.name}</span>
              </div>
              <p className="text-gray-400">{clinic.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{clinic.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{clinic.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><Link to={`/c/${clinic.slug}/book`} className="hover:text-white transition-colors">Book Appointment</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Patient Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {clinic.name}. All rights reserved. Powered by ClinicFlow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicClinicSite;