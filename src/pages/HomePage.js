import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInFromLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const slideInFromRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const HomePage = () => {
  // Array of mental health-related images from Unsplash
  const mentalHealthImages = [
    'https://images.unsplash.com/photo-1530099486328-e021101a494a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];

  // Array of mental health-related logos
  const mentalHealthLogos = [
    'https://cdn-icons-png.flaticon.com/512/2965/2965300.png',
    'https://cdn-icons-png.flaticon.com/512/2785/2785405.png',
    'https://cdn-icons-png.flaticon.com/512/3048/3048127.png',
    'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
    'https://cdn-icons-png.flaticon.com/512/2731/2731819.png',
    'https://cdn-icons-png.flaticon.com/512/3079/3079165.png',
    'https://cdn-icons-png.flaticon.com/512/2957/2957896.png'
  ];

  // Select random images
  const randomBackground = mentalHealthImages[Math.floor(Math.random() * mentalHealthImages.length)];
  const randomLogo = mentalHealthLogos[Math.floor(Math.random() * mentalHealthLogos.length)];

  return (
    <div className="home-page">
      {/* Hero Section with animations */}
      <motion.section 
        className="hero-section py-5 text-white" 
        style={{ 
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${randomBackground}) center/cover`,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero content */}
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="display-4 fw-bold mb-4"
                  variants={itemVariants}
                >
                  Understand Your Mental Well-being
                </motion.h1>
                <motion.p 
                  className="lead mb-4"
                  variants={itemVariants}
                >
                  Our AI-powered analysis helps you gain insights into your emotional state through handwritten text analysis.
                </motion.p>
                <motion.div 
                  className="d-flex gap-3"
                  variants={itemVariants}
                >
                  <Link 
                    to="/assessment" 
                    className="btn btn-light btn-lg px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Assessment
                  </Link>
                  <Link 
                    to="/about" 
                    className="btn btn-outline-light btn-lg px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              className="col-lg-6 text-center d-none d-lg-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <img 
                src={randomLogo} 
                alt="Mental Health Logo" 
                className="img-fluid" 
                style={{ 
                  maxHeight: '300px',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  padding: '20px'
                }} 
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="how-it-works py-5 bg-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        {/* Section content */}
        <div className="container">
          <motion.h2 
            className="text-center mb-5"
            variants={slideInFromLeft}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className="row"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Cards for how it works */}
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100 shadow-sm"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="card-body text-center p-4">
                  <div className="icon-wrapper bg-primary-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-pen-fancy fa-2x text-primary"></i>
                  </div>
                  <h4 className="mb-3">Write Your Thoughts</h4>
                  <p className="text-muted">Write freely about your feelings, experiences, or anything on your mind.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100 shadow-sm"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="card-body text-center p-4">
                  <div className="icon-wrapper bg-primary-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-upload fa-2x text-primary"></i>
                  </div>
                  <h4 className="mb-3">Upload Your Writing</h4>
                  <p className="text-muted">Take a photo or scan your handwritten text and upload it to our system.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100 shadow-sm"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="card-body text-center p-4">
                  <div className="icon-wrapper bg-primary-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-chart-pie fa-2x text-primary"></i>
                  </div>
                  <h4 className="mb-3">Get Insights</h4>
                  <p className="text-muted">Receive a detailed analysis of your emotional state and mental well-being.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials py-5"
        style={{ backgroundColor: '#f8f9fa' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        {/* Testimonials content */}
        <div className="container">
          <motion.h2 
            className="text-center mb-5"
            variants={slideInFromRight}
          >
            What People Are Saying
          </motion.h2>
          <motion.div 
            className="row"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Testimonial cards */}
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-body">
                  <div className="d-flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text">"This service helped me understand my emotional patterns better than anything else I've tried."</p>
                  <div className="d-flex align-items-center mt-3">
                    <motion.img 
                      src="https://randomuser.me/api/portraits/women/32.jpg" 
                      className="rounded-circle me-3" 
                      width="50" 
                      alt="User"
                      whileHover={{ rotate: 5 }}
                    />
                    <div>
                      <h6 className="mb-0">Sarah Johnson</h6>
                      <small className="text-muted">Teacher</small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-body">
                  <div className="d-flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text">"The handwriting analysis was surprisingly accurate about my stress levels."</p>
                  <div className="d-flex align-items-center mt-3">
                    <motion.img 
                      src="https://randomuser.me/api/portraits/men/45.jpg" 
                      className="rounded-circle me-3" 
                      width="50" 
                      alt="User"
                      whileHover={{ rotate: 5 }}
                    />
                    <div>
                      <h6 className="mb-0">Michael Chen</h6>
                      <small className="text-muted">Software Developer</small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="card h-100"
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-body">
                  <div className="d-flex mb-3">
                    {[1, 2, 3, 4].map((star) => (
                      <i key={star} className="fas fa-star text-warning"></i>
                    ))}
                    <i className="fas fa-star text-muted"></i>
                  </div>
                  <p className="card-text">"Great tool for self-reflection. Helped me realize I needed to take better care of myself."</p>
                  <div className="d-flex align-items-center mt-3">
                    <motion.img 
                      src="https://randomuser.me/api/portraits/women/68.jpg" 
                      className="rounded-circle me-3" 
                      width="50" 
                      alt="User"
                      whileHover={{ rotate: 5 }}
                    />
                    <div>
                      <h6 className="mb-0">Emma Rodriguez</h6>
                      <small className="text-muted">Nurse</small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
