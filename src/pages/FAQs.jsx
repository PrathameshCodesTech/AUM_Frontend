import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/FAQs.css';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is fractional ownership in real estate?',
          answer: 'Fractional ownership allows multiple investors to own a share of a high-value property. Each investor owns a fraction of the property and receives proportional returns from rental income and capital appreciation.'
        },
        {
          question: 'How do I start investing with AssetKart?',
          answer: 'Simply sign up on our platform, complete your KYC verification, browse available properties, and invest in the ones you like. You can start with as low as ₹5,000.'
        },
        {
          question: 'What is the minimum investment amount?',
          answer: 'The minimum investment amount varies by property but typically starts from ₹5,000, making premium real estate accessible to everyone.'
        }
      ]
    },
    {
      category: 'Investment & Returns',
      questions: [
        {
          question: 'How do I earn returns on my investment?',
          answer: 'You earn returns in two ways: (1) Regular rental income distributed quarterly or monthly, and (2) Capital appreciation when the property value increases over time.'
        },
        {
          question: 'What is the expected return on investment (ROI)?',
          answer: 'Expected returns vary by property but typically range from 12-15% annually, combining rental yield and capital appreciation. Past performance is not indicative of future results.'
        },
        {
          question: 'Can I sell my investment before the property is sold?',
          answer: 'Yes! AssetKart offers a secondary marketplace where you can list and sell your property tokens to other investors, providing liquidity to your investments.'
        }
      ]
    },
    {
      category: 'Safety & Security',
      questions: [
        {
          question: 'Is my investment safe and secure?',
          answer: 'Yes, all investments are backed by legal documentation and registered property ownership. We conduct thorough due diligence on every property and provide complete transparency.'
        },
        {
          question: 'How is my ownership verified?',
          answer: 'Your ownership is recorded through blockchain-based digital tokens, which are legally binding and provide indisputable proof of your fractional ownership in the property.'
        },
        {
          question: 'What happens if the property value decreases?',
          answer: 'Real estate is a long-term investment. While short-term fluctuations may occur, historically, real estate has shown consistent appreciation. We carefully select properties with strong growth potential.'
        }
      ]
    },
    {
      category: 'Legal & Compliance',
      questions: [
        {
          question: 'Is fractional ownership legal in India?',
          answer: 'Yes, fractional ownership is completely legal in India. All investments are structured through legally compliant Special Purpose Vehicles (SPVs) and registered property ownership.'
        },
        {
          question: 'What documents do I receive after investing?',
          answer: 'You receive digital ownership certificates, investment agreements, property documents, and regular financial statements detailing your returns and property performance.'
        },
        {
          question: 'How are taxes handled on my returns?',
          answer: 'Rental income is taxed as per your income tax slab. Capital gains are taxed based on the holding period. We provide detailed tax statements to help you file your returns accurately.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqs-page">
      <Header />
      
      <main className="faqs-main">
        {/* Hero Section */}
        <section className="faqs-hero">
          <div className="faqs-hero-content">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about AssetKart and fractional real estate investing</p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="faqs-content-section">
          <div className="faqs-container">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <h2 className="category-title">{category.category}</h2>
                <div className="faq-list">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div key={questionIndex} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button
                          className="faq-question"
                          onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        >
                          <span>{faq.question}</span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`faq-icon ${isOpen ? 'rotate' : ''}`}
                          >
                            <path
                              d="M19 9L12 16L5 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="contact-cta-section">
          <div className="contact-cta-content">
            <h2>Still have questions?</h2>
            <p>Can't find the answer you're looking for? Our support team is here to help.</p>
            <button className="contact-cta-btn" onClick={() => window.location.href = '/contact'}>
              Contact Support
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;