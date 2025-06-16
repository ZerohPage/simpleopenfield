# GitHub Copilot Instructions for SimpleOpenField

## Project Overview
SimpleOpenField is a field service management Single Page Application (SPA) built with vanilla HTML, CSS, and JavaScript. It provides job management, customer tracking, technician scheduling, and basic reporting capabilities.

## Core Principles

### 1. Technology Stack
- **Frontend Only**: Pure HTML5, CSS3, and ES6+ JavaScript
- **No Frameworks**: Avoid React, Vue, Angular, or other frameworks
- **No Build Tools**: Keep it simple - no Webpack, Vite, or bundlers
- **Progressive Enhancement**: Ensure basic functionality works without JavaScript
- **Modern Standards**: Use latest web standards and APIs

### 2. Architecture Guidelines
- **Modular Design**: Keep functionality separated into logical modules
- **Class-based Structure**: Use ES6 classes for major components
- **Event-driven**: Implement event-driven programming patterns
- **Data Layer**: Maintain clear separation between data and presentation
- **Component Reusability**: Create reusable UI components

## File Structure Rules

### HTML (index.html)
- **Single Page**: Keep everything in one HTML file for simplicity
- **Semantic HTML**: Use proper semantic elements (nav, main, section, article)
- **Accessibility**: Include ARIA labels, roles, and proper heading hierarchy
- **Modal Structure**: Keep modals at the bottom of the document
- **Data Attributes**: Use data-* attributes for JavaScript hooks

### CSS Organization
- **styles/main.css**: Core styles, CSS variables, typography, layout
- **styles/components.css**: Component-specific styles (modals, forms, cards)
- **styles/responsive.css**: Media queries, accessibility, print styles
- **CSS Custom Properties**: Use CSS variables for consistent theming
- **Mobile First**: Write mobile-first responsive CSS

### JavaScript Structure
- **js/app.js**: Main application logic, SPA routing, page management
- **js/data.js**: Data management, CRUD operations, localStorage handling
- **js/ui.js**: UI utilities, component management, accessibility
- **js/utils.js**: General utility functions, helpers, formatters

## Coding Standards

### JavaScript
```javascript
// Use ES6+ features
class ExampleClass {
    constructor() {
        this.property = 'value';
    }
    
    // Use arrow functions for callbacks
    method() {
        this.items.forEach(item => this.processItem(item));
    }
    
    // Use async/await for promises
    async loadData() {
        try {
            const data = await this.fetchData();
            return data;
        } catch (error) {
            this.handleError(error);
        }
    }
}

// Use const/let, never var
const config = { setting: 'value' };
let mutableVariable = 'initial';

// Use template literals
const message = `Hello ${name}, you have ${count} items`;

// Use destructuring
const { id, name, status } = user;
const [first, second] = array;
```

### CSS
```css
/* Use CSS custom properties */
:root {
    --primary-color: #2563eb;
    --spacing-4: 1rem;
    --border-radius: 0.5rem;
}

/* Use logical properties */
.element {
    margin-block-start: var(--spacing-4);
    padding-inline: var(--spacing-2);
}

/* Use modern layout methods */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-4);
}

.flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
```

## Data Management Rules

### Local Storage
- **Consistent Keys**: Use 'sof_' prefix for all localStorage keys
- **JSON Serialization**: Always serialize/deserialize objects
- **Error Handling**: Wrap localStorage operations in try-catch
- **Data Validation**: Validate data before saving
- **Backup Strategy**: Implement export/import for data backup

### Data Models
```javascript
// Standard data models
const jobModel = {
    id: 'JOB001',
    customer: 'CUST001',
    serviceType: 'maintenance|repair|installation|inspection',
    description: 'string',
    technician: 'TECH001',
    scheduledDate: 'ISO 8601 string',
    status: 'pending|in-progress|completed|cancelled',
    priority: 'low|medium|high|urgent',
    createdAt: 'ISO 8601 string',
    updatedAt: 'ISO 8601 string'
};
```

## UI/UX Guidelines

### Design System
- **Consistent Spacing**: Use CSS custom properties for spacing
- **Color Palette**: Stick to defined color variables
- **Typography**: Use system font stack for performance
- **Icons**: Use Font Awesome icons consistently
- **Animation**: Smooth transitions under 300ms

### Accessibility
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Maintain WCAG AA compliance
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Use proper semantic elements

### Responsive Design
- **Mobile First**: Design for mobile, enhance for desktop
- **Breakpoints**: Use consistent breakpoint system
- **Touch Targets**: Minimum 44px touch targets
- **Viewport**: Proper viewport meta tag
- **Performance**: Optimize for mobile networks

## Feature Development

### New Features
1. **Plan First**: Document the feature requirements
2. **Data Model**: Define any new data structures
3. **UI Design**: Sketch the user interface
4. **Implementation**: Code in small, testable chunks
5. **Testing**: Test across devices and browsers
6. **Documentation**: Update README and comments

### Code Reviews
- **Functionality**: Does it work as expected?
- **Standards**: Follows project coding standards?
- **Performance**: No unnecessary DOM manipulation?
- **Accessibility**: Keyboard and screen reader accessible?
- **Responsive**: Works on all screen sizes?

## Performance Guidelines

### JavaScript Performance
- **DOM Queries**: Cache DOM elements, avoid repeated queries
- **Event Delegation**: Use event delegation for dynamic content
- **Debouncing**: Debounce search and resize handlers
- **Memory Management**: Clean up event listeners and references

### CSS Performance
- **Selector Efficiency**: Use efficient CSS selectors
- **Animations**: Use transform and opacity for animations
- **Critical CSS**: Inline critical CSS for faster rendering
- **Font Loading**: Optimize font loading strategy

### Data Performance
- **Lazy Loading**: Load data on demand when possible
- **Pagination**: Implement pagination for large datasets
- **Caching**: Cache frequently accessed data
- **Compression**: Minimize data storage size

## Security Considerations

### Input Validation
- **Sanitization**: Sanitize all user inputs
- **XSS Prevention**: Escape HTML content
- **Data Validation**: Validate data types and formats
- **Length Limits**: Implement input length restrictions

### Data Protection
- **Local Storage**: Don't store sensitive information
- **URL Parameters**: Avoid sensitive data in URLs
- **Error Messages**: Don't expose system information
- **Content Security**: Implement CSP headers when hosting

## Testing Strategy

### Manual Testing
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
- **Device Testing**: Test on mobile, tablet, desktop
- **Accessibility**: Test with keyboard only and screen readers
- **Edge Cases**: Test with empty data, large datasets, errors

### Code Quality
- **Linting**: Follow consistent code formatting
- **Comments**: Document complex logic and business rules
- **Error Handling**: Graceful error handling throughout
- **Validation**: Input validation on all forms

## Deployment Guidelines

### Production Readiness
- **Minification**: Minify CSS and JavaScript for production
- **Image Optimization**: Optimize images for web
- **Caching**: Implement proper caching headers
- **HTTPS**: Always serve over HTTPS
- **Monitoring**: Implement error tracking

### GitHub Pages
- **Branch Strategy**: Use main/master for production
- **Custom Domain**: Configure custom domain if needed
- **SEO**: Basic SEO meta tags
- **Analytics**: Google Analytics or similar

## Documentation

### Code Documentation
- **JSDoc**: Use JSDoc comments for functions and classes
- **README**: Keep README.md up to date
- **CHANGELOG**: Maintain a changelog for releases
- **API Docs**: Document any external integrations

### User Documentation
- **Feature Guides**: Document how to use features
- **Troubleshooting**: Common issues and solutions
- **Screenshots**: Include screenshots in documentation
- **Video Guides**: Consider video walkthroughs

## Future Considerations

### Scalability
- **Backend Integration**: Plan for future API integration
- **Database Migration**: Consider data migration strategies
- **User Management**: Authentication and authorization
- **Multi-tenancy**: Support for multiple organizations

### Advanced Features
- **PWA**: Progressive Web App capabilities
- **Offline Support**: Service worker implementation
- **Real-time**: WebSocket integration
- **Mobile App**: React Native or Cordova wrapper

## Common Patterns

### Error Handling
```javascript
try {
    const result = await this.performOperation();
    this.showSuccess('Operation completed successfully');
    return result;
} catch (error) {
    console.error('Operation failed:', error);
    this.showError('Operation failed. Please try again.');
    return null;
}
```

### Event Management
```javascript
// Use event delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
        this.handleDelete(e.target.closest('[data-id]').dataset.id);
    }
});
```

### Data Operations
```javascript
// Consistent CRUD pattern
class DataManager {
    create(type, data) {
        // Validate, save, return result
    }
    
    read(type, id) {
        // Fetch, validate, return data
    }
    
    update(type, id, data) {
        // Validate, update, return result
    }
    
    delete(type, id) {
        // Validate, remove, return result
    }
}
```

Remember: Keep it simple, maintainable, and user-focused. The goal is to create a robust field service management tool that's easy to use and extend.
