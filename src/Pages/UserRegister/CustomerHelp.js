import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Globe } from 'lucide-react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const faqs = [
  {
    question: "How do I sign up as a customer?",
    answer: "Click the 'Sign Up' button on the homepage, enter your details, and you're ready to start booking services."
  },
  {
    question: "How do I book a service?",
    answer: "After logging in, browse available services, select a provider, choose a time, and click 'Book Now.' You'll receive a confirmation email with the details."
  },
  {
    question: "What if I need to reschedule or cancel a booking?",
    answer: "Go to 'My Bookings,' select the booking you wish to change, and choose the option to either reschedule or cancel. Cancellations within 24 hours may incur a fee."
  },
  {
    question: "How do I rate a service provider?",
    answer: "After the service is completed, go to 'My Bookings' and click on the job to leave a rating and feedback."
  },
  {
    question: "What should I do if the service provider is late or doesn't show up?",
    answer: "Contact customer support immediately. We will help you resolve the issue or arrange for a replacement."
  }
];

const CustomerHelp = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const goBack = () => {
    if (currentUser) {
      navigate('/dashboard/Dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={goBack} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-violet-600" />
          <span className="text-xl font-bold text-gray-900">Home Care Connect</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Customer Help Center</h1>
        <p className="text-violet-100 mt-2">Find answers and guidance for using Home Care Connect</p>
      </div>

      {/* Quick Links */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📋', title: 'How to Book', desc: 'Learn the booking flow', action: () => navigate('/dashboard/Dashboard') },
            { icon: '💳', title: 'Payment Methods', desc: 'Multiple payment options', action: () => navigate('/dashboard/Dashboard') },
            { icon: '🔄', title: 'Cancel Order', desc: 'Flexible cancellation', action: () => navigate('/dashboard/Dashboard') },
            { icon: '⭐', title: 'Rate Service', desc: 'Share your experience', action: () => navigate('/dashboard/Dashboard') },
          ].map((item, i) => (
            <div key={i} onClick={item.action} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-all"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-violet-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email", value: "support@homecareconnect.com" },
            { icon: Phone, label: "Phone", value: "+1 (800) 123-4567" },
            { icon: Globe, label: "Live Chat", value: "Available 9 AM - 9 PM" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className="text-gray-900 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="px-6 pb-8 max-w-4xl mx-auto">
        <button
          onClick={goBack}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CustomerHelp;
