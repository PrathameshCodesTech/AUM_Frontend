import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Blogs.css';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Real Estate Investment in India',
      excerpt: 'Discover how fractional ownership is revolutionizing the way Indians invest in real estate. Learn about the benefits, risks, and opportunities.',
      category: 'Market Insights',
      date: 'Nov 25, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Why Millennials Are Choosing Fractional Ownership',
      excerpt: 'The younger generation is embracing fractional real estate. Here\'s why this investment model resonates with millennials and Gen Z investors.',
      category: 'Trends',
      date: 'Nov 20, 2024',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2096&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Understanding REITs vs Fractional Ownership',
      excerpt: 'A comprehensive comparison between traditional REITs and modern fractional ownership platforms. Which is better for your portfolio?',
      category: 'Investment Guide',
      date: 'Nov 15, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Top 5 Cities for Real Estate Investment in 2025',
      excerpt: 'Explore the most promising cities for real estate investment in India. Market analysis, growth potential, and rental yield comparisons.',
      category: 'Market Analysis',
      date: 'Nov 10, 2024',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'How to Diversify Your Real Estate Portfolio',
      excerpt: 'Learn proven strategies to build a diversified real estate portfolio with fractional investments across different property types and locations.',
      category: 'Investment Strategy',
      date: 'Nov 5, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Tax Benefits of Real Estate Investment in India',
      excerpt: 'Complete guide to tax deductions, exemptions, and benefits available for real estate investors under Indian tax laws.',
      category: 'Tax & Legal',
      date: 'Oct 30, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const categories = ['All', 'Market Insights', 'Trends', 'Investment Guide', 'Market Analysis', 'Investment Strategy', 'Tax & Legal'];

  return (
    <div className="blogs-page">
      <Header />
      
      <main className="blogs-main">
        {/* Hero Section */}
        <section className="blogs-hero">
          <div className="blogs-hero-content">
            <h1>AssetKart Blog</h1>
            <p>Insights, trends, and guides for smart real estate investing</p>
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section">
          <div className="categories-container">
            {categories.map((category, index) => (
              <button key={index} className={`category-btn ${index === 0 ? 'active' : ''}`}>
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="blogs-grid-section">
          <div className="blogs-container">
            <div className="blogs-grid">
              {blogPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-image">
                    <img src={post.image} alt={post.title} />
                    <span className="blog-category">{post.category}</span>
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <button className="read-more-btn">Read More →</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="newsletter-container">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest insights and market updates</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blogs;