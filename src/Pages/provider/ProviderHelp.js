import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Globe } from 'lucide-react';

const faqs = [
  {
    question: "How do I become a registered service provider?",
    answer: "Click the 'Join as Provider' link, fill in your details, and upload the necessary documents for verification. Once approved, you can start accepting jobs."
  },
  {
    question: "How do I update my availability?",
    answer: "Go to your profile, click on the 'Availability' tab, and update your schedule. Make sure to regularly update your availability to avoid job conflicts."
  },
  {
    question: "How do I accept or decline job requests?",
    answer: "Once a customer requests your service, you'll receive a notification. You can either accept or decline the job from the job requests section in your dashboard."
  },
  {
    question: "How will I receive payments?",
    answer: "Payments will be credited to your registered account within 48 hours after the job is completed and approved by the customer."
  },
  {
    question: "What should I do if a customer cancels at the last minute?",
    answer: "Last-minute cancellations may incur a cancellation fee, which will be credited to your account. Check the cancellation policy for more details."
  }
];

const ProviderHelp = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={goBack} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-violet-600" />
          <span className="text-xl font-bold text-gray-900">Home Care Connect</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Provider Help Center</h1>
        <p className="text-violet-100 mt-2">Find answers and guidance for managing your services</p>
      </div>

      {/* Introduction Section */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
        <p className="text-gray-600 leading-relaxed">
          Home Care Connect is a platform that connects service providers with customers
          seeking home services like cleaning, plumbing, and electrical work. Our mission
          is to make it easy for customers to find reliable service professionals and for
          providers to grow their business by offering quality services.
        </p>
      </section>

      {/* Getting Started Section */}
      <section className="px-6 py-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "How to Register as a Provider", desc: "Sign up by filling out the registration form, create your profile, and verify your credentials to begin accepting jobs." },
            { title: "Managing Availability", desc: "Update your availability by going to your profile and marking the dates and times you're available for jobs." },
            { title: "Handling Jobs", desc: "View job requests from the dashboard, communicate with customers, and mark jobs as completed after they're done." },
            { title: "Payment Process", desc: "Payments are processed within 48 hours of job completion. You can withdraw your earnings through your linked account." },
            { title: "Feedback and Reviews", desc: "You can view customer feedback in your dashboard. Keep a high rating by providing excellent service." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-all"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-violet-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-5 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email", value: "support@homecareconnect.com", color: "text-violet-600" },
            { icon: Phone, label: "Phone", value: "+1 (800) 123-4567", color: "text-violet-600" },
            { icon: Globe, label: "Live Chat", value: "Available 9 AM - 5 PM", color: "text-violet-600" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className="text-gray-900 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProviderHelp;
