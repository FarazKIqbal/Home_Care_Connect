import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowRight, Star, Shield, Clock, CheckCircle, Zap, Wrench, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { icon: <Wrench className="h-8 w-8" />, title: "Plumbing", desc: "Fix leaks, install fixtures, and maintain your plumbing system" },
    { icon: <Zap className="h-8 w-8" />, title: "Electrical", desc: "Safe wiring, installations, and electrical repairs" },
    { icon: <Sparkles className="h-8 w-8" />, title: "Cleaning", desc: "Deep cleaning, organization, and housekeeping services" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="relative">
                <HomeIcon className="h-8 w-8 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Home Care Connect
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {['About', 'Services', 'How It Works', 'Testimonials', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    const sectionId = item.toLowerCase().replace(/\s/g, '');
                    const element = document.getElementById(sectionId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:underline"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:scale-105 transition-transform duration-200 shadow-lg" onClick={() => navigate('/login')}>
              <HomeIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
                Trusted Platform Since 2023
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900" aria-hidden="true">
              Find Your Perfect Home Service
            </h2>
            <h1 className="sr-only">Home Care Connect - Find Trusted Home Service Professionals</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Connect with top-rated, verified service professionals for cleaning, plumbing, and electrical work. Schedule, book, and enjoy quality service at your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/choose')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button onClick={() => {
                const element = document.getElementById('services');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }} className="px-8 py-4 text-lg font-semibold text-indigo-700 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border-2 border-indigo-100">
                How It Works
              </button>
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">About Home Care Connect</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Founded in 2023, we recognized the need for a reliable, transparent platform that connects
                  homeowners with skilled service professionals. We've grown to become a trusted name in
                  home services across India.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <Shield className="h-8 w-8" />, title: "Verified Professionals", desc: "All our service providers undergo rigorous verification to ensure quality and trustworthiness." },
                  { icon: <Clock className="h-8 w-8" />, title: "On-time Guarantee", desc: "We guarantee that your service will be scheduled as promised, or you'll receive compensation." },
                  { icon: <CheckCircle className="h-8 w-8" />, title: "Quality Assured", desc: "Every service comes with our quality assurance guarantee for your peace of mind." }
                ].map((badge) => (
                  <div key={badge.title} className="text-center p-6 bg-indigo-50 rounded-2xl">
                    <div className="text-indigo-600 flex justify-center mb-4">{badge.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{badge.title}</h3>
                    <p className="text-gray-600 text-sm">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-indigo-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Statistics with Visual Appeal */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "500K+", label: "Happy Customers", icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
                { value: "10,000+", label: "Service Providers", icon: <Wrench className="h-6 w-6 text-blue-500" /> },
                { value: "4.9", label: "Average Rating", icon: <Star className="h-6 w-6 text-yellow-400 fill-current" /> }
              ].map((stat, index) => (
                <div key={stat.label} className="border-none">
                  <div className="flex items-center justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div id="howitworks" className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Choose Your Service", desc: "Select from cleaning, plumbing, or electrical services" },
                { step: "2", title: "Book a Provider", desc: "Compare ratings and book your preferred service professional" },
                { step: "3", title: "Enjoy Quality Service", desc: "Relax while your home gets taken care of professionally" }
              ].map((item, index) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div id="testimonials" className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">What Our Customers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Priya Sharma", role: "Homeowner", rating: 5, text: "Excellent service! The plumber arrived on time and fixed the issue quickly. Highly recommended!" },
                  { name: "Rahul Verma", role: "Business Owner", rating: 5, text: "I've been using Home Care Connect for months. Their cleaning service is top-notch every time." },
                  { name: "Ananya Patel", role: "Customer", rating: 5, text: "Easy booking process and reliable professionals. The electrical work was done perfectly." }
                ].map((testimonial) => (
                  <div key={testimonial.name} className="bg-indigo-50 rounded-2xl p-6">
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="mb-20">
            <div className="bg-indigo-600 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Get In Touch</h2>
              <p className="text-indigo-100 mb-8">Have questions? We'd love to hear from you.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div>
                  <p className="font-semibold mb-2">Email</p>
                  <p className="text-indigo-100">support@homecareconnect.com</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Phone</p>
                  <p className="text-indigo-100">+1 (800) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Address</p>
                  <p className="text-indigo-100">123 Service Street, Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Trusted by Homeowners Across India</h3>
                <p className="text-gray-600 text-sm">Verified professionals, guaranteed satisfaction, secure payments</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { name: "Verified Pros", icon: <Shield className="h-8 w-8 text-green-500" /> },
                  { name: "On-time Guarantee", icon: <Clock className="h-8 w-8 text-blue-500" /> },
                  { name: "100% Satisfaction", icon: <CheckCircle className="h-8 w-8 text-purple-500" /> }
                ].map((badge) => (
                  <div key={badge.name} className="text-center">
                    <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      {badge.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Home Care Connect</h4>
              <p className="text-indigo-100 text-sm">
                Your trusted platform for professional home services.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Services</h5>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">Cleaning</button></li>
                <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">Plumbing</button></li>
                <li><button onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">Electrical</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">About Us</button></li>
                <li><button onClick={() => document.getElementById('howitworks')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">How It Works</button></li>
                <li><button onClick={() => navigate('/choose')} className="text-indigo-100 hover:text-white text-sm cursor-pointer">Careers</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Contact</h5>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="text-indigo-100 hover:text-white text-sm cursor-pointer">support@homecareconnect.com</button>
              <p className="text-indigo-100 text-sm">+1 (800) 123-4567</p>
            </div>
          </div>
          <hr className="border-indigo-400 mt-8 mb-6" />
          <p className="text-center text-indigo-200 text-sm">
            &copy; 2024 Home Care Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}