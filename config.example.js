// Configuration file for API keys and settings
// Copy this file to config.js and fill in your actual values

const CONFIG = {
  // Canvas LMS Configuration
  CANVAS: {
    CLIENT_ID: 'YOUR_CANVAS_CLIENT_ID_HERE',
    // Add your Canvas OAuth client ID from your Canvas instance
    // Instructions: https://canvas.instructure.com/doc/api/file.oauth.html
  },
  
  // Google Classroom Configuration
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',
    API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    // Get these from Google Cloud Console
    // Instructions: https://developers.google.com/classroom/quickstart/js
  },
  
  // App Configuration
  APP: {
    NAME: 'Assignment Manager',
    VERSION: '1.1.0',
    DESCRIPTION: 'A modern assignment manager with smart priority categorization',
    AUTHOR: 'Your Name',
    REPOSITORY: 'https://github.com/yourusername/mobile_assignment_manager',
  },
  
  // Feature Flags
  FEATURES: {
    CANVAS_INTEGRATION: true,
    GOOGLE_CLASSROOM_INTEGRATION: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_SUPPORT: true,
    THEME_CUSTOMIZATION: true,
  },
  
  // Development Settings
  DEVELOPMENT: {
    DEBUG_MODE: false,
    MOCK_API: false,
    LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
