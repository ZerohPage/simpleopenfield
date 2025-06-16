# SimpleOpenField - Field Service Management SPA

A modern, responsive single-page application for field service management built with vanilla HTML, CSS, and JavaScript.

## Features

### Core Functionality
- **Dashboard**: Overview of jobs, technicians, and key metrics
- **Job Management**: Create, view, edit, and track service jobs
- **Customer Management**: Maintain customer database with contact information
- **Technician Management**: Manage technician profiles and availability
- **Schedule Management**: Calendar view of scheduled jobs and appointments
- **Reports**: Basic analytics and performance metrics

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Local Storage**: Data persistence using browser localStorage
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Data Export**: Export jobs and customers to JSON format

## Project Structure

```
simpleopenfield/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css            # Core styles and CSS variables
│   ├── components.css      # Component-specific styles
│   └── responsive.css      # Responsive design and accessibility
├── js/
│   ├── app.js             # Main application logic
│   ├── data.js            # Data management and CRUD operations
│   ├── ui.js              # UI utilities and component management
│   └── utils.js           # General utility functions
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation
1. Clone or download the project files to your local machine
2. Open the project directory
3. Serve the files using a local web server:
   
   **Option 1: Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option 2: Using Node.js (if installed)**
   ```bash
   npx serve .
   ```
   
   **Option 3: Using VS Code Live Server extension**
   - Install Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"

4. Open your browser and navigate to `http://localhost:8000` (or the port shown)

### Direct File Access
You can also open `index.html` directly in your browser, but some features may be limited due to browser security restrictions.

## Usage

### Dashboard
- View overview statistics of jobs, customers, and technicians
- See recent jobs and today's schedule
- Quick access to create new jobs

### Job Management
- Create new service jobs with customer and technician assignment
- Filter jobs by status (pending, in-progress, completed, cancelled)
- Search jobs by various criteria
- Export job data to JSON format

### Customer Management
- Add new customers with contact information
- View customer job history
- Search and filter customers
- Export customer data

### Technician Management
- Add technicians with skills and contact information
- View technician status (available, busy, off-duty)
- Track technician job assignments

### Schedule
- Calendar view of scheduled jobs
- Navigate between months
- Click on dates to see job details

### Reports
- Job statistics by status and priority
- Technician performance metrics
- Customer satisfaction ratings
- Revenue trends (placeholder for integration)

## Data Storage

The application uses browser localStorage for data persistence. Data is automatically saved when:
- Creating new jobs, customers, or technicians
- Updating existing records
- Changing job statuses

### Sample Data
The application initializes with sample data including:
- 3 sample customers
- 3 sample technicians
- 3 sample jobs with different statuses

## Customization

### Styling
- Modify CSS variables in `styles/main.css` to change colors, fonts, and spacing
- Component styles are organized in `styles/components.css`
- Responsive breakpoints and accessibility features in `styles/responsive.css`

### Functionality
- Add new job types by modifying the service type dropdown options
- Extend data validation rules in `js/data.js`
- Add new dashboard widgets by extending the dashboard loading functions

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

This is a boilerplate project. Feel free to:
- Add new features
- Improve the UI/UX
- Integrate with backend APIs
- Add real-time notifications
- Implement user authentication
- Add more comprehensive reporting

## Future Enhancements

Potential features to add:
- **Backend Integration**: Connect to REST APIs or GraphQL
- **Real-time Updates**: WebSocket support for live updates
- **File Attachments**: Support for job photos and documents
- **GPS Tracking**: Technician location tracking
- **Invoice Generation**: PDF invoice creation
- **Mobile App**: Progressive Web App (PWA) capabilities
- **User Authentication**: Login system with role-based access
- **Advanced Reporting**: Charts and analytics with Chart.js
- **Notifications**: Push notifications for job updates
- **Offline Support**: Service worker for offline functionality

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please refer to the code comments and documentation within the JavaScript files. Each major function and class is documented with purpose and usage examples.
