import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col, ProgressBar, Modal } from 'react-bootstrap';
import axios from 'axios';

const AssessmentPage = () => {
  const navigate = useNavigate();
  
  // Nature images for prompts
  const natureImages = [
    {
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      prompt: "Describe how this peaceful landscape makes you feel"
    },
    {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      prompt: "Write about what this misty forest scene reminds you of"
    },
    {
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      prompt: "Imagine yourself in this mountain landscape. What would you do there?"
    },
    {
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      prompt: "How does this dramatic natural formation affect your mood?"
    },
    {
      url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      prompt: "Describe the emotions this waterfall evokes in you"
    }
  ];

  // State management
  const [currentImage, setCurrentImage] = useState(null);
  const [essayText, setEssayText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  // Set random image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * natureImages.length);
    setCurrentImage(natureImages[randomIndex]);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  const handleTimeUp = () => {
    setTimerActive(false);
    alert("Time's up! Please submit your response now.");
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Drag and drop for image upload
  const onDrop = useCallback(acceptedFiles => {
    if (!assessmentStarted) {
      setError('Please start the assessment first');
      return;
    }
    
    const file = acceptedFiles[0];
    if (file && file.type.match('image.*')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large (max 5MB)');
        return;
      }
      
      setUploadProgress(0);
      const reader = new FileReader();
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);
      
      reader.onload = () => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadedImage(reader.result);
          setUploadProgress(0);
        }, 300);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please upload an image file (JPEG, PNG)');
    }
  }, [assessmentStarted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // Calculate word count
  const handleEssayChange = (e) => {
    if (!assessmentStarted) {
      setError('Please start the assessment first');
      return;
    }
    
    const text = e.target.value;
    setEssayText(text);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  };

  const handleSubmit = async () => {
    if (!essayText.trim() && !uploadedImage) {
      setError('Please either write an essay or upload a handwritten image');
      return;
    }

    setTimerActive(false);
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (uploadedImage) {
        // Convert base64 to Blob
        const byteString = atob(uploadedImage.split(',')[1]);
        const mimeString = uploadedImage.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('file', blob, 'uploadedImage.png');
      } else {
        formData.append('text', essayText);
      }

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/results', { 
        state: { 
          analysisData: response.data 
        } 
      });
    } catch (error) {
      console.error('Error:', error.response || error);
      setError(error.response?.data?.error || 'Error processing your assessment');
    } finally {
      setIsLoading(false);
    }
  };


  const startAssessment = () => {
    setShowStartModal(false);
    setAssessmentStarted(true);
    setTimerActive(true);
  };

  const cancelAssessment = () => {
    navigate('/'); // Navigate to home or previous page
  };

  if (!currentImage) return <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>;

  return (
    <Container className="py-5">
      {/* Start Assessment Confirmation Modal */}
      <Modal 
        show={showStartModal} 
        onHide={() => {}} 
        backdrop="static" 
        keyboard={false}
        centered
      >
        <Modal.Header className="bg-primary text-white position-relative">
          <Modal.Title className="w-100 text-center">
            <i className="fas fa-brain me-2"></i> Mental Health Assessment
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white position-absolute end-0 me-2"
            aria-label="Close"
            onClick={cancelAssessment}
            style={{ top: '1rem' }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <i className="fas fa-clock fa-3x text-primary mb-3"></i>
            <h4>You're about to begin your assessment</h4>
          </div>
          
          <div className="assessment-instructions bg-light p-3 rounded mb-4">
            <h5 className="mb-3">Instructions:</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-stopwatch me-2 text-primary"></i>
                <strong>15 minute</strong> time limit
              </li>
              <li className="mb-2">
                <i className="fas fa-keyboard me-2 text-primary"></i>
                Type your response <strong>OR</strong> upload handwritten
              </li>
              <li className="mb-2">
                <i className="fas fa-image me-2 text-primary"></i>
                Respond to the nature image prompt
              </li>
              <li>
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                Timer <strong>cannot</strong> be paused once started
              </li>
            </ul>
          </div>

          <Alert variant="info" className="text-center">
            <i className="fas fa-info-circle me-2"></i>
            Your responses will be analyzed for emotional patterns and mental wellbeing indicators.
          </Alert>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="outline-secondary" 
            onClick={cancelAssessment}
            className="me-3 px-4"
          >
            <i className="fas fa-times me-2"></i> Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={startAssessment}
            className="px-4"
          >
            <i className="fas fa-play me-2"></i> Begin Assessment
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">
            <i className="fas fa-edit me-2"></i> Mental Health Assessment
          </h3>
          {assessmentStarted ? (
            <div className="timer bg-white text-dark px-3 py-1 rounded">
              <i className="fas fa-clock me-2"></i>
              <span className="fw-bold">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="timer bg-warning text-dark px-3 py-1 rounded">
              <i className="fas fa-pause me-2"></i>
              <span className="fw-bold">Not Started</span>
            </div>
          )}
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col className="text-center">
              <h4 className="mb-3">Observe This Image</h4>
              <img 
                src={currentImage.url} 
                alt="Nature prompt" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: '300px' }}
              />
              <div className="prompt-box bg-light p-3 rounded mt-3">
                <i className="fas fa-quote-left text-muted me-2"></i>
                <span className="lead">{currentImage.prompt}</span>
                <i className="fas fa-quote-right text-muted ms-2"></i>
              </div>
            </Col>
          </Row>

          {!assessmentStarted && (
            <Alert variant="info" className="text-center">
              <i className="fas fa-info-circle me-2"></i>
              The assessment has not started yet. Click "Begin Assessment" in the modal to start.
            </Alert>
          )}

          <Row>
            {/* Essay Writing Section */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                  <i className="fas fa-keyboard me-2"></i> Type Your Thoughts
                </h4>
                <span className={`badge ${wordCount > 0 ? 'bg-success' : 'bg-secondary'}`}>
                  {wordCount} words
                </span>
              </div>
              
              <Form.Group controlId="essayText">
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={essayText}
                  onChange={handleEssayChange}
                  placeholder={assessmentStarted ? 
                    `Write about: ${currentImage.prompt}...` : 
                    'Please start the assessment to begin writing'}
                  className="mb-3"
                  style={{ 
                    resize: 'none',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    border: '2px solid #dee2e6'
                  }}
                  disabled={!assessmentStarted}
                />
              </Form.Group>
              
              <div className="text-center text-muted mb-3">
                <div className="divider-with-text">
                  <span className="px-2 bg-white">OR</span>
                </div>
              </div>
            </Col>

            {/* Handwritten Upload Section */}
            <Col lg={6}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                  <i className="fas fa-camera me-2"></i> Upload Handwritten
                </h4>
                <span className="badge bg-secondary">Optional</span>
              </div>
              
              <div 
                {...getRootProps()}
                className={`drop-zone ${isDragActive ? 'active' : ''} ${uploadedImage ? 'has-image' : ''} ${!assessmentStarted ? 'disabled' : ''}`}
              >
                <input {...getInputProps()} disabled={!assessmentStarted} />
                
                {uploadProgress > 0 ? (
                  <div className="text-center w-100">
                    <i className="fas fa-cloud-upload-alt fa-3x mb-3 text-primary"></i>
                    <p>Uploading your image...</p>
                    <ProgressBar 
                      now={uploadProgress} 
                      label={`${uploadProgress}%`} 
                      striped 
                      animated 
                      className="mb-3"
                    />
                  </div>
                ) : uploadedImage ? (
                  <div className="upload-preview">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded essay" 
                      className="img-fluid rounded"
                    />
                    <Button 
                      variant="outline-danger"
                      size="sm"
                      className="mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                    >
                      <i className="fas fa-trash me-1"></i> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <i className={`fas fa-cloud-upload-alt fa-4x mb-3 ${isDragActive ? 'text-primary' : 'text-muted'}`}></i>
                    <h5 className={isDragActive ? 'text-primary' : 'text-muted'}>
                      {isDragActive ? 'Drop your image here' : 'Drag & drop image'}
                    </h5>
                    <p className="text-muted mb-2">or</p>
                    <Button variant="outline-primary" disabled={!assessmentStarted}>
                      <i className="fas fa-folder-open me-1"></i> Browse Files
                    </Button>
                    <p className="text-muted mt-2 small">
                      Supports JPG, PNG (max 5MB)
                    </p>
                    {!assessmentStarted && (
                      <div className="overlay-message">
                        <p className="text-danger">Start assessment to enable upload</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="tips mt-4 p-3 bg-light rounded">
                <h5 className="text-primary">
                  <i className="fas fa-lightbulb me-2"></i> Writing Tips:
                </h5>
                <ul className="text-muted">
                  <li className="mb-1">Write naturally as you would in a journal</li>
                  <li className="mb-1">Include your current feelings and thoughts</li>
                  <li className="mb-1">Aim for at least 100 words for best results</li>
                  <li>For handwritten uploads: ensure good lighting</li>
                </ul>
              </div>
            </Col>
          </Row>

          {error && (
            <Alert 
              variant="danger" 
              className="mt-4"
              dismissible
              onClose={() => setError(null)}
            >
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          {assessmentStarted && (
            <div className="text-center mt-4">
              <Button 
                variant={timeLeft === 0 ? 'warning' : 'primary'}
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading || (!essayText.trim() && !uploadedImage)}
                className="px-5 py-2"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-chart-bar me-2"></i>
                    {timeLeft === 0 ? 'Submit Now (Time Expired)' : 'Submit Assessment'}
                  </>
                )}
              </Button>
              
              {!essayText.trim() && !uploadedImage && (
                <p className="text-muted mt-2 small">
                  Please write something or upload an image to continue
                </p>
              )}

              {timeLeft < 60 && timeLeft > 0 && (
                <Alert variant="warning" className="mt-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Hurry! Only {formatTime(timeLeft)} remaining
                </Alert>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Add the missing export statement
export default AssessmentPage;