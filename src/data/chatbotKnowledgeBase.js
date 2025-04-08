/**
 * Mental Health Chatbot Knowledge Base
 * Contains structured information for the chatbot to reference when responding to user queries
 */

const knowledgeBase = {
  // General mental health information
  mentalHealth: {
    definition: "Mental health encompasses emotional, psychological, and social well-being. It affects how we think, feel, act, handle stress, relate to others, and make choices.",
    importance: "Good mental health is essential for overall well-being and enables people to cope with life's challenges, work productively, and contribute to their communities.",
    commonIssues: [
      "Anxiety disorders",
      "Depression",
      "Stress",
      "Bipolar disorder",
      "Post-traumatic stress disorder (PTSD)",
      "Eating disorders",
      "Obsessive-compulsive disorder (OCD)",
      "Schizophrenia"
    ]
  },

  // Information about the app's assessment
  assessment: {
    purpose: "Our handwriting analysis assessment helps identify potential emotional states and mental health indicators through your handwritten text.",
    process: "You'll write or upload a sample of your handwriting, which our AI will analyze for patterns related to emotional expression.",
    benefits: "The assessment provides insights into your current emotional state, potential stress levels, and personalized recommendations.",
    disclaimer: "This assessment is not a clinical diagnosis. It's designed to provide insights and encourage self-reflection."
  },

  // Self-care strategies
  selfCare: {
    physical: [
      "Regular exercise (even short walks can help)",
      "Adequate sleep (7-9 hours for most adults)",
      "Balanced nutrition",
      "Staying hydrated",
      "Taking breaks from screens"
    ],
    mental: [
      "Mindfulness meditation",
      "Deep breathing exercises",
      "Journaling thoughts and feelings",
      "Setting realistic goals",
      "Learning new skills or hobbies"
    ],
    social: [
      "Connecting with supportive friends and family",
      "Joining community groups or classes",
      "Volunteering",
      "Setting healthy boundaries in relationships",
      "Seeking professional support when needed"
    ]
  },

  // Crisis resources
  crisisResources: {
    disclaimer: "If you're experiencing a mental health emergency, please contact emergency services or a crisis helpline immediately.",
    hotlines: [
      {
        name: "National Suicide Prevention Lifeline",
        contact: "988 or 1-800-273-8255",
        available: "24/7"
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        available: "24/7"
      },
      {
        name: "SAMHSA's National Helpline",
        contact: "1-800-662-4357",
        available: "24/7"
      }
    ]
  },

  // Information about handwriting analysis
  handwritingAnalysis: {
    overview: "Handwriting analysis, or graphology, examines handwriting patterns to identify potential personality traits and emotional states.",
    indicators: {
      pressure: "Heavy pressure may indicate high energy or tension, while light pressure might suggest sensitivity or low energy.",
      size: "Large writing can indicate extroversion or confidence, while small writing might suggest focus or introversion.",
      slant: "Right slant often indicates emotional expressiveness, left slant may suggest reserve, and vertical writing can indicate balance.",
      spacing: "Wide spacing between words might indicate a need for space, while cramped writing could suggest anxiety or intensity."
    },
    limitations: "While handwriting analysis can provide interesting insights, it should be considered alongside other assessment methods for a comprehensive understanding."
  },

  // Frequently asked questions
  faqs: [
    {
      question: "Is my data kept private?",
      answer: "Yes, all your assessment data and conversations are confidential. We don't share your information with third parties without your consent."
    },
    {
      question: "How accurate is the handwriting analysis?",
      answer: "Our AI model has been trained on thousands of samples, but it's designed to provide insights rather than clinical diagnoses. The accuracy varies based on the quality and length of the handwriting sample."
    },
    {
      question: "Can I use this instead of therapy?",
      answer: "No, this tool is meant to complement, not replace, professional mental health care. If you're struggling, we encourage you to speak with a qualified mental health professional."
    },
    {
      question: "How often should I take the assessment?",
      answer: "You can take it as often as you find helpful. Some users benefit from weekly check-ins, while others prefer monthly assessments to track changes over time."
    },
    {
      question: "What if my results indicate a serious issue?",
      answer: "If your results suggest significant distress, we'll provide resources and encourage you to connect with a mental health professional for proper evaluation and support."
    }
  ],

  // Coping strategies for specific emotions
  copingStrategies: {
    anxiety: [
      "Practice deep breathing (4-7-8 technique: inhale for 4, hold for 7, exhale for 8)",
      "Progressive muscle relaxation",
      "Grounding techniques (5-4-3-2-1 method: identify 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, 1 thing you taste)",
      "Limit caffeine and alcohol",
      "Challenge negative thought patterns"
    ],
    depression: [
      "Set small, achievable daily goals",
      "Establish a consistent routine",
      "Engage in physical activity",
      "Connect with supportive people",
      "Practice self-compassion"
    ],
    stress: [
      "Identify and address sources of stress",
      "Time management techniques",
      "Regular physical activity",
      "Mindfulness practices",
      "Setting boundaries"
    ],
    anger: [
      "Take a timeout before responding",
      "Use 'I' statements when communicating feelings",
      "Practice relaxation techniques",
      "Identify triggers and plan responses",
      "Channel energy into productive activities"
    ]
  },

  // Information about the app's features
  appFeatures: {
    handwritingAnalysis: "Upload handwritten text for emotional and mental state insights",
    personalizedRecommendations: "Receive tailored suggestions based on your assessment results",
    progressTracking: "Monitor changes in your emotional well-being over time",
    resourceLibrary: "Access articles, videos, and exercises for mental wellness",
    chatSupport: "Get immediate responses to your mental health questions"
  }
};

// Response templates for common user inputs
const responseTemplates = {
  greeting: [
    "Hello! I'm your mental health assistant. How can I help you today?",
    "Hi there! I'm here to support your mental well-being. What would you like to know?",
    "Welcome! I'm your AI mental health companion. How are you feeling today?"
  ],
  
  farewell: [
    "Take care! Remember to be kind to yourself.",
    "Goodbye for now. I'm here whenever you need support.",
    "Wishing you well. Come back anytime you need to talk."
  ],
  
  thanks: [
    "You're welcome! I'm glad I could help.",
    "Happy to assist! Is there anything else you'd like to know?",
    "My pleasure. Your mental well-being is important."
  ],
  
  unclear: [
    "I'm not sure I understood that. Could you rephrase your question?",
    "I want to help, but I'm having trouble understanding. Could you try asking in a different way?",
    "I apologize, but I'm not sure what you're asking. Could you provide more details?"
  ],
  
  emotionalSupport: [
    "It sounds like you're going through a difficult time. Remember that it's okay to feel this way, and you don't have to face it alone.",
    "I hear that you're struggling. Taking small steps toward self-care can make a difference, even on the hardest days.",
    "Your feelings are valid. Be patient and compassionate with yourself as you navigate this challenge."
  ]
};

// Function to identify user intent from message
const identifyIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))/.test(lowerMessage)) {
    return 'greeting';
  }
  
  // Check for farewells
  if (/^(bye|goodbye|see you|farewell|thanks|thank you)/.test(lowerMessage)) {
    return 'farewell';
  }
  
  // Check for gratitude
  if (/thank you|thanks|appreciate it|grateful/.test(lowerMessage)) {
    return 'thanks';
  }
  
  // Check for questions about mental health
  if (/what is (mental health|depression|anxiety|stress|therapy)/.test(lowerMessage) || 
      /tell me about (mental health|depression|anxiety|stress|therapy)/.test(lowerMessage)) {
    return 'mentalHealthInfo';
  }
  
  // Check for questions about the assessment
  if (/assessment|test|analyze|handwriting|analysis/.test(lowerMessage)) {
    return 'assessmentInfo';
  }
  
  // Check for self-care questions
  if (/self-care|self care|take care of (myself|me)|feel better/.test(lowerMessage)) {
    return 'selfCareInfo';
  }
  
  // Check for crisis-related messages
  if (/suicid|kill (myself|me)|harm (myself|me)|don't want to (live|be alive)|emergency|crisis/.test(lowerMessage)) {
    return 'crisisResponse';
  }
  
  // Check for emotional expressions
  if (/feel (sad|depressed|down|anxious|worried|stressed|angry|upset)/.test(lowerMessage) ||
      /(i am|i'm) (sad|depressed|down|anxious|worried|stressed|angry|upset)/.test(lowerMessage)) {
    return 'emotionalSupport';
  }
  
  // Default to general inquiry
  return 'generalInquiry';
};

// Function to get a response based on intent
const getResponse = (intent, message) => {
  switch (intent) {
    case 'greeting':
      return responseTemplates.greeting[Math.floor(Math.random() * responseTemplates.greeting.length)];
      
    case 'farewell':
      return responseTemplates.farewell[Math.floor(Math.random() * responseTemplates.farewell.length)];
      
    case 'thanks':
      return responseTemplates.thanks[Math.floor(Math.random() * responseTemplates.thanks.length)];
      
    case 'mentalHealthInfo':
      if (message.toLowerCase().includes('depression')) {
        return `Depression is a common but serious mood disorder that affects how you feel, think, and handle daily activities. It's more than just feeling sad temporarily. ${knowledgeBase.mentalHealth.commonIssues.includes('Depression') ? 'It\'s one of the most common mental health issues.' : ''} If you're concerned about depression, speaking with a mental health professional is recommended.`;
      } else if (message.toLowerCase().includes('anxiety')) {
        return `Anxiety disorders involve more than temporary worry or fear. For a person with an anxiety disorder, the anxiety does not go away and can get worse over time. ${knowledgeBase.mentalHealth.commonIssues.includes('Anxiety disorders') ? 'It\'s one of the most common mental health issues.' : ''} There are effective treatments available, including therapy and medication.`;
      } else if (message.toLowerCase().includes('stress')) {
        return `Stress is your body's reaction to pressure from a situation or life event. Some stress can be positive and help you avoid danger or meet a deadline, but ongoing stress can negatively affect your health. Our app can help you identify stress through handwriting analysis and suggest coping strategies.`;
      } else if (message.toLowerCase().includes('therapy')) {
        return `Therapy, or psychotherapy, is a way to help people with mental health struggles. It involves talking with a trained professional who can help you understand your feelings, thoughts, and behaviors. There are many types of therapy, and finding the right approach for you is important.`;
      } else {
        return knowledgeBase.mentalHealth.definition + " " + knowledgeBase.mentalHealth.importance;
      }
      
    case 'assessmentInfo':
      return `${knowledgeBase.assessment.purpose} ${knowledgeBase.assessment.process} ${knowledgeBase.assessment.disclaimer}`;
      
    case 'selfCareInfo':
      const physicalTips = knowledgeBase.selfCare.physical.slice(0, 3).join(", ");
      const mentalTips = knowledgeBase.selfCare.mental.slice(0, 3).join(", ");
      return `Self-care is essential for mental well-being. Some physical self-care strategies include: ${physicalTips}. For mental self-care, try: ${mentalTips}. Would you like more specific suggestions?`;
      
    case 'crisisResponse':
      return `I'm concerned about what you're sharing. ${knowledgeBase.crisisResources.disclaimer} You can reach the National Suicide Prevention Lifeline at ${knowledgeBase.crisisResources.hotlines[0].contact}, available ${knowledgeBase.crisisResources.hotlines[0].available}.`;
      
    case 'emotionalSupport':
      const supportMessage = responseTemplates.emotionalSupport[Math.floor(Math.random() * responseTemplates.emotionalSupport.length)];
      
      if (message.toLowerCase().includes('anxious') || message.toLowerCase().includes('anxiety')) {
        const anxietyTips = knowledgeBase.copingStrategies.anxiety.slice(0, 2).join(". ");
        return `${supportMessage} For anxiety, you might try: ${anxietyTips}.`;
      } else if (message.toLowerCase().includes('sad') || message.toLowerCase().includes('depress')) {
        const depressionTips = knowledgeBase.copingStrategies.depression.slice(0, 2).join(". ");
        return `${supportMessage} When feeling down, consider: ${depressionTips}.`;
      } else if (message.toLowerCase().includes('stress')) {
        const stressTips = knowledgeBase.copingStrategies.stress.slice(0, 2).join(". ");
        return `${supportMessage} To manage stress, you could: ${stressTips}.`;
      } else if (message.toLowerCase().includes('angry') || message.toLowerCase().includes('anger')) {
        const angerTips = knowledgeBase.copingStrategies.anger.slice(0, 2).join(". ");
        return `${supportMessage} When dealing with anger, try: ${angerTips}.`;
      } else {
        return supportMessage;
      }
      
    case 'generalInquiry':
    default:
      // Check for FAQ matches
      for (const faq of knowledgeBase.faqs) {
        if (message.toLowerCase().includes(faq.question.toLowerCase().replace(/\?/g, ''))) {
          return faq.answer;
        }
      }
      
      // Check for handwriting analysis questions
      if (message.toLowerCase().includes('handwriting') || message.toLowerCase().includes('analysis')) {
        return `${knowledgeBase.handwritingAnalysis.overview} Some key indicators we look at include pressure, size, slant, and spacing between words.`;
      }
      
      // Default response
      return "I'm here to help with questions about mental health, our assessment, or self-care strategies. How can I assist you today?";
  }
};

export { knowledgeBase, responseTemplates, identifyIntent, getResponse };