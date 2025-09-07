# Assignment Manager

A modern, responsive Progressive Web App (PWA) for managing academic assignments with smart priority categorization and beautiful glassmorphism design.

![Assignment Manager](https://img.shields.io/badge/Assignment%20Manager-PWA-blue)
![Version](https://img.shields.io/badge/version-1.1.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Features

### 📱 Mobile-First Design
- **Progressive Web App (PWA)** - Install on Android/iOS devices
- **Responsive Design** - Optimized for all screen sizes
- **Touch-Friendly** - Swipe gestures and large touch targets
- **Offline Support** - Works without internet connection

### 🎨 Beautiful UI/UX
- **Glassmorphism Design** - Modern frosted glass effects
- **Custom Themes** - Multiple preset themes and custom gradients
- **Dark Mode** - Automatic and manual dark mode support
- **Smooth Animations** - Fluid transitions and micro-interactions

### 📚 Assignment Management
- **Smart Priority System** - Automatic categorization (High/Medium/Low/Overdue)
- **Multiple Sources** - Manual entry, Canvas LMS, Google Classroom
- **Calendar View** - Visual assignment timeline
- **Search & Filter** - Find assignments quickly
- **Export/Import** - Backup and restore data

### 🔗 API Integrations
- **Canvas LMS** - Sync assignments from Canvas
- **Google Classroom** - Import from Google Classroom
- **OAuth Authentication** - Secure API connections

### 🔔 Notifications
- **Push Notifications** - Assignment reminders
- **Due Date Alerts** - Never miss a deadline
- **Background Sync** - Updates when back online

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your app will be available at `https://yourusername.github.io/mobile_assignment_manager`

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mobile_assignment_manager.git
   cd mobile_assignment_manager/web
   ```

2. Serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

### Option 3: Deploy to Netlify/Vercel
1. Connect your GitHub repository to Netlify or Vercel
2. Deploy with default settings
3. Your app will be live with automatic HTTPS

## 📱 Installation on Mobile

### Android
1. Open the app in Chrome
2. Tap the menu (⋮) and select "Add to Home screen"
3. The app will be installed as a native-like app

### iOS
1. Open the app in Safari
2. Tap the Share button and select "Add to Home Screen"
3. The app will be installed on your home screen

## 🛠️ Configuration

### API Keys Setup
To enable Canvas LMS and Google Classroom integration:

1. **Canvas LMS**:
   - Create an OAuth application in your Canvas instance
   - Update `YOUR_CANVAS_CLIENT_ID_HERE` in `services/canvas-api.js`

2. **Google Classroom**:
   - Create a project in Google Cloud Console
   - Enable Google Classroom API
   - Create OAuth 2.0 credentials
   - Update `YOUR_GOOGLE_CLIENT_ID_HERE` and `YOUR_GOOGLE_API_KEY_HERE` in `services/google-classroom-api.js`

### Customization
- **Themes**: Modify CSS variables in `styles.css`
- **Icons**: Replace icons in the `icons/` directory
- **Manifest**: Update `manifest.json` for app metadata

## 📁 Project Structure

```
web/
├── index.html              # Main HTML file
├── app-simple.js           # Main application logic
├── styles.css              # Styling and themes
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline support
├── icons/                  # PWA icons
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ...
├── services/               # API integrations
│   ├── canvas-api.js
│   └── google-classroom-api.js
├── oauth/                  # OAuth callback pages
│   ├── canvas.html
│   └── google.html
└── screenshots/            # App screenshots
```

## 🎯 Usage

### Adding Assignments
1. Tap the "+" button or "Add Assignment"
2. Fill in the assignment details
3. Set due date and time
4. Save to add to your list

### Managing Assignments
- **Mark Complete**: Tap the checkbox on any assignment
- **Edit**: Tap the edit icon to modify details
- **Delete**: Tap the trash icon to remove
- **Search**: Use the search bar to find specific assignments

### Calendar View
- Navigate months using arrow buttons
- View assignments by due date
- Tap on dates to see assignment details

### Settings
- **Themes**: Choose from preset themes or create custom ones
- **API Connections**: Connect to Canvas LMS or Google Classroom
- **Data Management**: Export/import your data

## 🔧 Development

### Prerequisites
- Modern web browser with PWA support
- Local web server (for development)
- Git (for version control)

### Building Icons
1. Open `icon-generator.html` in your browser
2. Right-click on each icon and save as PNG
3. Place icons in the `icons/` directory

### Testing
- Test PWA installation on mobile devices
- Verify offline functionality
- Check API integrations with test accounts

## 📊 Browser Support

| Browser | PWA Support | Service Worker | Notifications |
|---------|-------------|----------------|---------------|
| Chrome  | ✅ Full     | ✅ Yes         | ✅ Yes        |
| Firefox | ✅ Full     | ✅ Yes         | ✅ Yes        |
| Safari  | ✅ Full     | ✅ Yes         | ⚠️ Limited    |
| Edge    | ✅ Full     | ✅ Yes         | ✅ Yes        |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test on multiple devices
- Ensure PWA functionality works
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: Font Awesome for beautiful icons
- **Fonts**: Google Fonts (Inter) for typography
- **Design**: Inspired by modern glassmorphism trends
- **APIs**: Canvas LMS and Google Classroom for integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mobile_assignment_manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mobile_assignment_manager/discussions)
- **Email**: your-email@example.com

## 🗺️ Roadmap

- [ ] **v1.2.0**: Team collaboration features
- [ ] **v1.3.0**: Advanced analytics and insights
- [ ] **v1.4.0**: Mobile app (React Native/Flutter)
- [ ] **v1.5.0**: AI-powered assignment suggestions
- [ ] **v2.0.0**: Multi-language support

---

**Made with ❤️ for students everywhere**

*Star this repository if you find it helpful!*