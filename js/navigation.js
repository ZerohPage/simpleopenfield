// Navigation and Routing Module
class NavigationManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveNavLink();
        this.setupMobileNav();
    }

    setupEventListeners() {
        // Navigation links - Updated for Bulma navbar
        document.querySelectorAll('.navbar-item[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                
                // Close mobile menu when clicking on a link
                const navbarBurger = document.querySelector('.navbar-burger');
                const navbarMenu = document.querySelector('.navbar-menu');
                if (navbarBurger && navbarMenu) {
                    navbarBurger.classList.remove('is-active');
                    navbarMenu.classList.remove('is-active');
                }
            });
        });

        // Bulma navbar burger menu
        const navbarBurger = document.querySelector('.navbar-burger');
        const navbarMenu = document.querySelector('.navbar-menu');
        
        if (navbarBurger && navbarMenu) {
            navbarBurger.addEventListener('click', () => {
                navbarBurger.classList.toggle('is-active');
                navbarMenu.classList.toggle('is-active');
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    async navigateToPage(page) {
        this.currentPage = page;
        await pageManager.showPage(page);
        this.updateActiveNavLink();
        
        // Trigger page-specific data loading
        if (window.pageRenderer) {
            window.pageRenderer.updatePageContent(page);
        }
    }

    updateActiveNavLink() {
        document.querySelectorAll('.navbar-item[data-page]').forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('is-active');
            }
        });
    }

    setupMobileNav() {
        // Bulma navbar burger functionality is handled in setupEventListeners
        // This method is kept for backward compatibility
        console.log('Mobile navigation setup complete (using Bulma)');
    }

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 767) {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Global navigation instance
window.navigationManager = new NavigationManager();
