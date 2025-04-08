// Fix imports by combining React hooks
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Alert, Row, Col, Card, Button } from 'react-bootstrap';
// We don't need to import ChatBot here since it's handled by ChatButton component

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // No need for chatbot state here anymore

  useEffect(() => {
    // Redirect to assessment if no data is present
    if (!location.state?.analysisData) {
      navigate('/assessment', { 
        replace: true,
        state: { error: 'No analysis data found. Please complete the assessment first.' }
      });
    }
  }, [location.state, navigate]);

  // Use real data passed via navigation state with default values
  const analysisData = location.state?.analysisData || {
    emotion_scores: {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      love: 0,
      surprise: 0
    },
    mental_health_score: 0,
    mental_state: "Unknown",
    emotion_chart: ""
  };

  const getAlertVariant = () => {
    if (analysisData.mental_state.includes('Good')) return 'success';
    if (analysisData.mental_state.includes('Moderate')) return 'warning';
    return 'danger';
  };

  return (
    <>
      <Container className="py-5">
        <Card className="shadow mb-4">
          <Card.Header className={`bg-${getAlertVariant()} text-white`}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Your Results: {analysisData.mental_state}</h3>
              <span className="badge bg-light text-dark fs-6">
                Score: {analysisData.mental_health_score}/100
              </span>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4 className="mb-4">Emotion Analysis</h4>
                <div className="text-center">
                  <div className="mt-3">
                    {Object.entries(analysisData.emotion_scores).map(([emotion, score]) => (
                      <div key={emotion} className="d-flex justify-content-between mb-2">
                        <span className="text-capitalize">{emotion}</span>
                        <span>{Math.round(score * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-light rounded text-start">
                    <h6 className="text-primary mb-3"><i className="fas fa-chart-line me-2"></i>Emotional Insights:</h6>
                    <div className="mb-3">
                      <p className="mb-2"><strong>Primary Emotion:</strong></p>
                      <div className="alert alert-info py-2">
                        {Object.entries(analysisData.emotion_scores)
                          .reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                        <small className="d-block text-muted mt-1">This is your dominant emotional state</small>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2"><strong>What This Means:</strong></p>
                      <ul className="list-unstyled">
                        <li><i className="fas fa-info-circle text-primary me-2"></i>Your emotional pattern shows your current mental state</li>
                        <li><i className="fas fa-lightbulb text-warning me-2"></i>These emotions can change with proper support and care</li>
                        <li><i className="fas fa-heart text-danger me-2"></i>It's normal to experience various emotions</li>
                      </ul>
                      <div className="mt-3 border-top pt-3">
                        <p className="mb-2"><strong>Next Steps:</strong></p>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-calendar-check text-success me-2"></i>
                            <span>Track your emotions daily for better awareness</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-users text-info me-2"></i>
                            <span>Share your feelings with trusted friends or family</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-book text-primary me-2"></i>
                            <span>Keep a journal to understand your emotional triggers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <h4 className="mb-3">Recommendations</h4>
                <Alert variant={getAlertVariant()}>
                  {analysisData.mental_state === "Good Mental Health" ? (
                    <>
                      <h5><i className="fas fa-smile-beam me-2"></i>You're doing great!</h5>
                      <p>Your emotional balance appears positive. Keep up with these healthy habits:</p>
                      <ul>
                        <li>Continue journaling regularly</li>
                        <li>Maintain your social connections</li>
                        <li>Practice gratitude daily</li>
                      </ul>
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6 className="text-primary mb-3"><i className="fas fa-video me-2"></i>Recommended Videos:</h6>
                        <div className="list-group">
                          <a href="https://www.youtube.com/watch?v=ZToicYcHIOU" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Morning Routine for Mental Wellness</strong>
                              <small className="d-block text-muted">Start your day positively</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=wfDTp2GogaQ" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Gratitude Meditation Practice</strong>
                              <small className="d-block text-muted">Enhance your positive mindset</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=SEfs5TJZ6Nk" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Habits of Mentally Strong People</strong>
                              <small className="d-block text-muted">Maintain your mental wellbeing</small>
                            </div>
                          </a>
                        </div>
                      </div>
                    </>
                  ) : analysisData.mental_state === "Moderate Mental Health" ? (
                    <>
                      <h5><i className="fas fa-meh me-2"></i>Some areas to work on</h5>
                      <p>Consider these strategies to improve your emotional well-being:</p>
                      <ul>
                        <li>Practice mindfulness or meditation</li>
                        <li>Engage in regular physical activity</li>
                        <li>Maintain a consistent sleep schedule</li>
                      </ul>
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6 className="text-primary mb-3"><i className="fas fa-video me-2"></i>Recommended Videos:</h6>
                        <div className="list-group">
                          <a href="https://www.youtube.com/watch?v=cyEdZ23Cp1E" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>10-Minute Mindfulness Exercise</strong>
                              <small className="d-block text-muted">Simple daily practice for mental clarity</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=q6jO8qnW9bQ" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Stress Management Techniques</strong>
                              <small className="d-block text-muted">Practical ways to reduce daily stress</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=sG7DBA-mgFY" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Better Sleep Habits</strong>
                              <small className="d-block text-muted">Improve your sleep quality</small>
                            </div>
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5><i className="fas fa-sad-tear me-2"></i>Consider seeking support</h5>
                      <p>Your assessment suggests you may be struggling with difficult emotions:</p>
                      <ul>
                        <li>Reach out to a mental health professional</li>
                        <li>Connect with supportive friends or family</li>
                        <li>Practice self-care activities</li>
                      </ul>
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6 className="text-primary mb-3"><i className="fas fa-video me-2"></i>Recommended Videos:</h6>
                        <div className="list-group">
                          <a href="https://www.youtube.com/watch?v=3QIfkeA6HBY" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>5-Minute Meditation for Anxiety</strong>
                              <small className="d-block text-muted">Quick relief techniques</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=Wdbbtgf05Ek" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Simple Breathing Exercises</strong>
                              <small className="d-block text-muted">Calm your mind instantly</small>
                            </div>
                          </a>
                          <a href="https://www.youtube.com/watch?v=inpok4MKVLM" 
                             className="list-group-item list-group-item-action d-flex align-items-center"
                             target="_blank" 
                             rel="noopener noreferrer">
                            <i className="fab fa-youtube text-danger me-2 fa-lg"></i>
                            <div>
                              <strong>Guided Relaxation Techniques</strong>
                              <small className="d-block text-muted">Professional-guided session</small>
                            </div>
                          </a>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-primary mb-2"><i className="fas fa-phone me-2"></i>Emergency Contacts:</h6>
                          <div className="bg-white p-2 rounded">
                            <p className="mb-1"><strong>National Crisis Hotline:</strong> 1800-599-0019</p>
                            <p className="mb-1"><strong>Crisis Text Line:</strong> Text SHOUT to 85258</p>
                            <small className="text-muted">Available 24/7, free and confidential</small>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Alert>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <Button 
                variant="primary" 
                onClick={() => navigate('/assessment')}
                size="lg"
              >
                <i className="fas fa-redo me-2"></i>Take Another Assessment
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Remove all ChatBot related code here - it's now handled by the ChatButton component */}
    </>
  );
};

export default ResultsPage;