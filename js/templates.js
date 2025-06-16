/**
 * Template Loader for SimpleOpenField
 * Handles dynamic loading and management of HTML templates
 */

class TemplateLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    /**
     * Load a template from the templates directory
     * @param {string} templateName - Name of the template file (without .html extension)
     * @returns {Promise<string>} - The template HTML content
     */
    async loadTemplate(templateName) {
        // Check if template is already cached
        if (this.cache.has(templateName)) {
            return this.cache.get(templateName);
        }

        // Check if template is currently being loaded
        if (this.loadingPromises.has(templateName)) {
            return this.loadingPromises.get(templateName);
        }

        // Create loading promise
        const loadingPromise = this.fetchTemplate(templateName);
        this.loadingPromises.set(templateName, loadingPromise);

        try {
            const template = await loadingPromise;
            this.cache.set(templateName, template);
            return template;
        } catch (error) {
            console.error(`Failed to load template: ${templateName}`, error);
            throw error;
        } finally {
            this.loadingPromises.delete(templateName);
        }
    }

    /**
     * Fetch template from server
     * @private
     */
    async fetchTemplate(templateName) {
        const response = await fetch(`templates/${templateName}.html`);
        if (!response.ok) {
            throw new Error(`Template not found: ${templateName} (${response.status})`);
        }
        return response.text();
    }

    /**
     * Load multiple templates in parallel
     * @param {string[]} templateNames - Array of template names
     * @returns {Promise<Object>} - Object with template names as keys and HTML as values
     */
    async loadTemplates(templateNames) {
        const promises = templateNames.map(name => 
            this.loadTemplate(name).then(html => ({ name, html }))
        );
        
        const results = await Promise.all(promises);
        return results.reduce((acc, { name, html }) => {
            acc[name] = html;
            return acc;
        }, {});
    }

    /**
     * Inject a template into a DOM element
     * @param {string} templateName - Name of the template
     * @param {string|HTMLElement} target - Target element or selector
     * @returns {Promise<void>}
     */
    async injectTemplate(templateName, target) {
        const html = await this.loadTemplate(templateName);
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        
        if (!element) {
            throw new Error(`Target element not found: ${target}`);
        }

        element.innerHTML = html;
    }

    /**
     * Append a template to a DOM element
     * @param {string} templateName - Name of the template
     * @param {string|HTMLElement} target - Target element or selector
     * @returns {Promise<HTMLElement>} - The newly created element
     */
    async appendTemplate(templateName, target) {
        const html = await this.loadTemplate(templateName);
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        
        if (!element) {
            throw new Error(`Target element not found: ${target}`);
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newElement = tempDiv.firstElementChild;
        element.appendChild(newElement);
        return newElement;
    }

    /**
     * Clear template cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Preload templates for better performance
     * @param {string[]} templateNames - Array of template names to preload
     */
    async preloadTemplates(templateNames) {
        await this.loadTemplates(templateNames);
    }
}

// Create global instance
window.templateLoader = new TemplateLoader();

/**
 * Page Manager - Handles SPA page switching with template loading
 */
class PageManager {
    constructor() {
        this.currentPage = null;
        this.pageContainer = null;
        this.modalContainer = null;
        this.pages = {
            'dashboard': 'dashboard',
            'jobs': 'jobs',
            'customers': 'customers',
            'technicians': 'technicians',
            'schedule': 'schedule',
            'reports': 'reports'
        };
        this.modals = {
            'newJobModal': 'modal-new-job',
            'newCustomerModal': 'modal-new-customer',
            'newTechnicianModal': 'modal-new-technician'
        };
    }

    /**
     * Initialize the page manager
     */
    async init() {
        this.pageContainer = document.getElementById('main-content');
        this.modalContainer = document.getElementById('modal-container');
        
        if (!this.pageContainer) {
            throw new Error('Main content container not found');
        }

        if (!this.modalContainer) {
            throw new Error('Modal container not found');
        }

        // Preload all templates
        await this.preloadAllTemplates();
        
        // Load default page (dashboard)
        await this.showPage('dashboard');
    }

    /**
     * Preload all page and modal templates
     */
    async preloadAllTemplates() {
        const allTemplates = [
            ...Object.values(this.pages),
            ...Object.values(this.modals)
        ];
        
        try {
            await templateLoader.preloadTemplates(allTemplates);
            console.log('All templates preloaded successfully');
        } catch (error) {
            console.error('Failed to preload templates:', error);
        }
    }

    /**
     * Show a specific page
     * @param {string} pageName - Name of the page to show
     */
    async showPage(pageName) {
        if (!this.pages[pageName]) {
            console.error(`Unknown page: ${pageName}`);
            return;
        }

        try {
            // Update navigation active state
            this.updateNavigation(pageName);

            // Load and inject template
            await templateLoader.injectTemplate(this.pages[pageName], this.pageContainer);
            
            this.currentPage = pageName;

            // Trigger page-specific initialization
            this.initializePage(pageName);

        } catch (error) {
            console.error(`Failed to show page: ${pageName}`, error);
            this.showErrorPage();
        }
    }

    /**
     * Load a modal template
     * @param {string} modalId - ID of the modal to load
     */
    async loadModal(modalId) {
        if (!this.modals[modalId]) {
            console.error(`Unknown modal: ${modalId}`);
            return null;
        }

        try {
            // Check if modal already exists
            let modal = document.getElementById(modalId);
            if (modal) {
                return modal;
            }

            // Load and append modal template
            modal = await templateLoader.appendTemplate(this.modals[modalId], this.modalContainer);
            return modal;
        } catch (error) {
            console.error(`Failed to load modal: ${modalId}`, error);
            return null;
        }
    }

    /**
     * Update navigation active state
     * @private
     */
    updateNavigation(pageName) {
        // Remove active class from all nav items
        document.querySelectorAll('.navbar-item').forEach(item => {
            item.classList.remove('is-active');
        });

        // Add active class to current page nav item
        const navItem = document.querySelector(`[data-page="${pageName}"]`);
        if (navItem) {
            navItem.classList.add('is-active');
        }
    }

    /**
     * Initialize page-specific functionality
     * @private
     */
    initializePage(pageName) {
        // Trigger custom page initialization events
        document.dispatchEvent(new CustomEvent('pageLoaded', { 
            detail: { pageName } 
        }));

        // Call page-specific initialization if it exists
        const initMethod = `init${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Page`;
        if (typeof window[initMethod] === 'function') {
            window[initMethod]();
        }
    }

    /**
     * Show error page
     * @private
     */
    showErrorPage() {
        this.pageContainer.innerHTML = `
            <div class="notification is-danger">
                <h1 class="title is-4">Error Loading Page</h1>
                <p>Sorry, there was an error loading the requested page. Please try again.</p>
                <button class="button is-light mt-3" onclick="pageManager.showPage('dashboard')">
                    Return to Dashboard
                </button>
            </div>
        `;
    }

    /**
     * Get current page name
     */
    getCurrentPage() {
        return this.currentPage;
    }
}

// Create global instance
window.pageManager = new PageManager();

// Modal functions are now handled by the ModalManager class in modals.js
// These global functions are maintained for backward compatibility
window.openModal = async (modalId) => {
    if (window.modalManager) {
        await window.modalManager.openModal(modalId);
    }
};

window.closeModal = (modalId) => {
    if (window.modalManager) {
        window.modalManager.closeModal(modalId);
    }
};
