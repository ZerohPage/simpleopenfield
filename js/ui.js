// UI Utilities and Components
class UIManager {
    constructor() {
        this.modals = new Map();
        this.dropdowns = new Map();
        this.tooltips = new Map();
        this.notifications = [];
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.initializeComponents();
        this.setupAccessibility();
    }

    setupGlobalEventListeners() {
        // Global click handler for dropdowns and modals
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeTopModal();
            }
        });

        // Form validation on input
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        });

        // Auto-save functionality
        document.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.handleAutoSave(e.target);
            }
        });
    }

    initializeComponents() {
        // Initialize all interactive components
        this.initializeTooltips();
        this.initializeDropdowns();
        this.initializeAccordions();
        this.initializeTabs();
        this.initializeSliders();
    }

    setupAccessibility() {
        // Add ARIA labels and keyboard navigation
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }

    // Modal Management
    showModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        // Store previous focus
        this.modals.set(modalId, {
            previousFocus: document.activeElement,
            options: options
        }); modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');

        // Focus first input or button
        const focusableElement = modal.querySelector('input, select, textarea, button');
        if (focusableElement) {
            setTimeout(() => focusableElement.focus(), 100);
        }

        // Trap focus within modal
        this.trapFocus(modal);

        // Trigger custom event
        modal.dispatchEvent(new CustomEvent('modal:shown', { detail: options }));

        return true;
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        const modalData = this.modals.get(modalId); modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            modal.style.display = 'none';

            // Restore focus
            if (modalData && modalData.previousFocus) {
                modalData.previousFocus.focus();
            }

            // Trigger custom event
            modal.dispatchEvent(new CustomEvent('modal:hidden'));
        }, 200);

        this.modals.delete(modalId);
        return true;
    } closeTopModal() {
        const visibleModals = Array.from(this.modals.keys())
            .filter(id => document.getElementById(id).classList.contains('is-active'));

        if (visibleModals.length > 0) {
            this.hideModal(visibleModals[visibleModals.length - 1]);
        }
    }

    // Dropdown Management
    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return false;

        const isOpen = dropdown.classList.contains('is-active');

        // Close all other dropdowns
        this.closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.add('is-active');
            dropdown.setAttribute('aria-expanded', 'true');

            this.dropdowns.set(dropdownId, {
                trigger: document.querySelector(`[data-dropdown="${dropdownId}"]`)
            });
        }

        return !isOpen;
    }

    closeAllDropdowns() {
        this.dropdowns.forEach((data, id) => {
            const dropdown = document.getElementById(id);
            if (dropdown) {
                dropdown.classList.remove('is-active');
                dropdown.setAttribute('aria-expanded', 'false');
            }
        });
        this.dropdowns.clear();
    }

    // Dropdown Management (Bulma Integration)
    initializeDropdowns() {
        // Initialize Bulma dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger button');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (trigger && menu) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('is-active');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdown.classList.remove('is-active');
                    }
                });

                // Close dropdown when pressing escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        dropdown.classList.remove('is-active');
                    }
                });
            }
        });
    }

    // Notification System
    showNotification(message, type = 'info', duration = 3000, actions = []) {
        const notification = {
            id: this.generateId(),
            message,
            type,
            duration,
            actions,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.renderNotification(notification);

        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification.id);
            }, duration);
        }

        return notification.id;
    }

    // Alias for showNotification for backward compatibility
    showToast(message, type = 'info', duration = 3000, actions = []) {
        return this.showNotification(message, type, duration, actions);
    }

    hideNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            this.notifications.splice(index, 1);

            const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (element) {
                element.classList.add('removing');
                setTimeout(() => element.remove(), 300);
            }
        }
    }

    renderNotification(notification) {
        const container = document.getElementById('toast-container') || this.createNotificationContainer();
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.type === 'success' ? 'is-success' : notification.type === 'error' ? 'is-danger' : notification.type === 'warning' ? 'is-warning' : 'is-info'} mb-3`;
        notificationElement.setAttribute('data-notification-id', notification.id);
        notificationElement.setAttribute('role', 'alert');
        notificationElement.setAttribute('aria-live', 'polite');

        const actionsHTML = notification.actions.map(action =>
            `<button class="button is-small ml-2" onclick="${action.handler}">${action.label}</button>`
        ).join('');

        notificationElement.innerHTML = `
            <button class="delete" onclick="uiManager.hideNotification('${notification.id}')" aria-label="Close notification"></button>
            <div class="content">
                ${notification.message}
                ${actionsHTML ? `<div class="mt-2">${actionsHTML}</div>` : ''}
            </div>
        `; container.appendChild(notificationElement);
    } createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'is-fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    // Form Validation
    validateField(field) {
        const rules = this.getValidationRules(field);
        const value = field.value.trim();
        const errors = [];

        rules.forEach(rule => {
            const result = this.applyValidationRule(rule, value, field);
            if (!result.valid) {
                errors.push(result.message);
            }
        });

        this.displayFieldValidation(field, errors);
        return errors.length === 0;
    }

    getValidationRules(field) {
        const rules = [];

        // Required validation
        if (field.hasAttribute('required')) {
            rules.push({ type: 'required' });
        }

        // Type-specific validation
        switch (field.type) {
            case 'email':
                rules.push({ type: 'email' });
                break;
            case 'tel':
                rules.push({ type: 'phone' });
                break;
            case 'url':
                rules.push({ type: 'url' });
                break;
            case 'number':
                if (field.hasAttribute('min')) {
                    rules.push({ type: 'min', value: field.getAttribute('min') });
                }
                if (field.hasAttribute('max')) {
                    rules.push({ type: 'max', value: field.getAttribute('max') });
                }
                break;
        }

        // Custom validation rules from data attributes
        if (field.hasAttribute('data-validation')) {
            const customRules = field.getAttribute('data-validation').split(',');
            customRules.forEach(rule => {
                rules.push({ type: rule.trim() });
            });
        }

        return rules;
    }

    applyValidationRule(rule, value, field) {
        switch (rule.type) {
            case 'required':
                return {
                    valid: value.length > 0,
                    message: 'This field is required'
                };

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    valid: !value || emailRegex.test(value),
                    message: 'Please enter a valid email address'
                };

            case 'phone':
                const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                return {
                    valid: !value || phoneRegex.test(value),
                    message: 'Please enter a valid phone number'
                };

            case 'url':
                try {
                    new URL(value);
                    return { valid: true };
                } catch {
                    return {
                        valid: !value,
                        message: 'Please enter a valid URL'
                    };
                }

            case 'min':
                const minValue = parseFloat(rule.value);
                const numValue = parseFloat(value);
                return {
                    valid: !value || numValue >= minValue,
                    message: `Value must be at least ${minValue}`
                };

            case 'max':
                const maxValue = parseFloat(rule.value);
                const numVal = parseFloat(value);
                return {
                    valid: !value || numVal <= maxValue,
                    message: `Value must be no more than ${maxValue}`
                };

            default:
                return { valid: true };
        }
    }

    displayFieldValidation(field, errors) {
        // Remove existing error display
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('error', 'valid');

        if (errors.length > 0) {
            field.classList.add('error');

            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errors[0]; // Show first error
            errorElement.setAttribute('role', 'alert');

            field.parentNode.appendChild(errorElement);
        } else if (field.value.trim()) {
            field.classList.add('valid');
        }
    }

    // Form Utilities
    validateForm(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    serializeForm(form) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes, etc.)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    resetForm(form) {
        form.reset();

        // Clear validation states
        form.querySelectorAll('.error, .valid').forEach(field => {
            field.classList.remove('error', 'valid');
        });

        form.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }

    // Tooltip Management
    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            this.attachTooltip(element);
        });
    }

    attachTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';

        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, tooltipText, position);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        element.addEventListener('focus', (e) => {
            this.showTooltip(e.target, tooltipText, position);
        });

        element.addEventListener('blur', () => {
            this.hideTooltip();
        });
    }

    showTooltip(element, text, position) {
        this.hideTooltip(); // Hide any existing tooltip

        const tooltip = document.createElement('div');
        tooltip.className = `tooltip-popup tooltip-${position}`;
        tooltip.textContent = text;
        tooltip.setAttribute('role', 'tooltip');

        document.body.appendChild(tooltip);

        // Position tooltip
        const elementRect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left, top;

        switch (position) {
            case 'top':
                left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
                top = elementRect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
                top = elementRect.bottom + 8;
                break;
            case 'left':
                left = elementRect.left - tooltipRect.width - 8;
                top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                left = elementRect.right + 8;
                top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
                break;
        }

        tooltip.style.left = `${Math.max(8, left)}px`;
        tooltip.style.top = `${Math.max(8, top)}px`;

        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    // Loading States
    showLoading(element, message = 'Loading...') {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');

        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        `;

        element.style.position = 'relative';
        element.appendChild(loadingOverlay);
    }

    hideLoading(element) {
        element.classList.remove('loading');
        element.removeAttribute('aria-busy');

        const overlay = element.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Accordion Implementation
    initializeAccordions() {
        document.querySelectorAll('.accordion').forEach(accordion => {
            accordion.addEventListener('click', (e) => {
                const header = e.target.closest('.accordion-header');
                if (header) {
                    this.toggleAccordion(header.parentNode);
                }
            });
        });
    }

    toggleAccordion(item) {
        const isActive = item.classList.contains('active');
        const content = item.querySelector('.accordion-content');

        if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0';
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    // Tab Implementation
    initializeTabs() {
        document.querySelectorAll('.tab-nav').forEach(nav => {
            nav.addEventListener('click', (e) => {
                const tab = e.target.closest('.tab');
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });
    }

    switchTab(activeTab) {
        const tabContainer = activeTab.closest('.tab-container');
        const tabId = activeTab.getAttribute('data-tab');

        // Update tab buttons
        tabContainer.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');

        // Update tab content
        tabContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = tabContainer.querySelector(`[data-tab-content="${tabId}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        // Arrow key navigation for tabs and menus
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('.tab, .nav-link, .dropdown-item')) {
                this.handleArrowNavigation(e);
            }
        });
    }

    handleArrowNavigation(e) {
        const items = Array.from(e.target.parentNode.children);
        const currentIndex = items.indexOf(e.target);
        let nextIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                break;
            default:
                return;
        }

        items[nextIndex].focus();
    }

    // Focus Management
    setupFocusManagement() {
        // Visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Utility Functions
    generateId() {
        return 'ui_' + Math.random().toString(36).substr(2, 9);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    handleGlobalClick(e) {
        // Close dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
            this.closeAllDropdowns();
        }

        // Handle modal backdrop clicks
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            this.hideModal(modalId);
        }
    }

    handleAutoSave(field) {
        if (window.dataManager && window.dataManager.getSetting('autoSave')) {
            // Implement auto-save logic here
            const formData = this.serializeForm(field.closest('form'));
            // Save to localStorage or send to server
        }
    }

    setupAriaLabels() {
        // Automatically add ARIA labels where missing
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    // Slider/Range Input Utilities
    initializeSliders() {
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            this.enhanceSlider(slider);
        });
    }

    enhanceSlider(slider) {
        // Add value display
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = slider.value;
        slider.parentNode.appendChild(valueDisplay);

        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });

        // Add keyboard support
        slider.addEventListener('keydown', (e) => {
            const step = parseFloat(slider.step) || 1;
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            let newValue = parseFloat(slider.value);

            switch (e.key) {
                case 'Home':
                    e.preventDefault();
                    newValue = min;
                    break;
                case 'End':
                    e.preventDefault();
                    newValue = max;
                    break;
                case 'PageUp':
                    e.preventDefault();
                    newValue = Math.min(max, newValue + step * 10);
                    break;
                case 'PageDown':
                    e.preventDefault();
                    newValue = Math.max(min, newValue - step * 10);
                    break;
            }

            if (newValue !== parseFloat(slider.value)) {
                slider.value = newValue;
                slider.dispatchEvent(new Event('input'));
            }
        });
    }
}

// Create global instance
window.uiManager = new UIManager();
