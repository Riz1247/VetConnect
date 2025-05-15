import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What services does VetConnect provide?",
      answer: "VetConnect offers a comprehensive platform connecting pet owners with veterinarians, enabling online consultations, appointment scheduling, and emergency veterinary services. We also provide pet care tips and a community forum for pet owners."
    },
    {
      question: "How do I schedule an appointment?",
      answer: "Simply log in to your account, browse available veterinarians, select your preferred time slot, and book your appointment. You'll receive a confirmation email with all the details and any pre-appointment instructions."
    },
    {
      question: "Is VetConnect available 24/7?",
      answer: "Yes! Our platform is accessible 24/7, and we have emergency veterinary services available around the clock. Regular appointment bookings can be made at any time, while consultations are available during specified veterinarian hours."
    },
    {
      question: "What should I do in case of a pet emergency?",
      answer: "In case of a pet emergency, immediately access our emergency services section, which will connect you with available emergency veterinarians. You can also call our 24/7 helpline for immediate assistance and guidance."
    },
    {
      question: "Are the veterinarians on VetConnect certified?",
      answer: "Absolutely! All veterinarians on our platform are fully certified and licensed professionals. We verify their credentials thoroughly before they can join our network to ensure the highest quality of care for your pets."
    },
    {
      question: "Can I get medication prescriptions through VetConnect?",
      answer: "Yes, veterinarians can prescribe medications when necessary following a consultation. These prescriptions can be sent directly to your preferred pharmacy or our partner pet pharmacies."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">Find answers to common questions about VetConnect</p>
        
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <div className="faq-icon">
                  {activeIndex === index ? '−' : '+'}
                </div>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
