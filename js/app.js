// Main Application JavaScript - Refactored for Modular Architecture
class SimpleOpenFieldApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await this.initializeApp();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    async initializeApp() {
        // Initialize template system first
        await pageManager.init();

        // Initialize all modules in the correct order
        this.initializeModules();

        // Load initial data
        if (window.pageRenderer) {
            window.pageRenderer.loadData();
        }

        // Load initial page
        if (window.navigationManager) {
            await window.navigationManager.navigateToPage('dashboard');
        }
    }

    initializeModules() {
        // Modules are initialized by their own scripts
        // This method is for any cross-module initialization if needed
        console.log('All modules initialized successfully');

        // Verify all required modules are loaded
        const requiredModules = [
            'navigationManager',
            'pageRenderer',
            'formManager',
            'modalManager',
            'actionManager',
            'calendarManager',
            'reportsManager'
        ];

        const missingModules = requiredModules.filter(module => !window[module]);
        if (missingModules.length > 0) {
            console.warn('Missing modules:', missingModules);
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.remove('is-active');
            }
        }, 1500);
    }

    showError(message) {
        if (window.uiManager) {
            window.uiManager.showToast(message, 'danger');
        } else {
            alert(message);
        }
    }

    // Backward compatibility methods - these delegate to the appropriate modules
    async navigateToPage(page) {
        if (window.navigationManager) {
            await window.navigationManager.navigateToPage(page);
        }
    }

    async openModal(modalId) {
        if (window.modalManager) {
            await window.modalManager.openModal(modalId);
        }
    }

    closeModal(modalId) {
        if (window.modalManager) {
            window.modalManager.closeModal(modalId);
        }
    }

    updatePageContent() {
        if (window.pageRenderer) {
            window.pageRenderer.updatePageContent();
        }
    }

    showToast(message, type = 'info') {
        if (window.uiManager) {
            window.uiManager.showToast(message, type);
        }
    }

    // Action methods - delegate to actionManager
    viewJob(jobId) {
        if (window.actionManager) {
            window.actionManager.viewJob(jobId);
        }
    }

    editJob(jobId) {
        if (window.actionManager) {
            window.actionManager.editJob(jobId);
        }
    }

    deleteJob(jobId) {
        if (window.actionManager) {
            window.actionManager.deleteJob(jobId);
        }
    }

    viewCustomer(customerId) {
        if (window.actionManager) {
            window.actionManager.viewCustomer(customerId);
        }
    }

    editCustomer(customerId) {
        if (window.actionManager) {
            window.actionManager.editCustomer(customerId);
        }
    }

    deleteCustomer(customerId) {
        if (window.actionManager) {
            window.actionManager.deleteCustomer(customerId);
        }
    }

    viewTechnician(technicianId) {
        if (window.actionManager) {
            window.actionManager.viewTechnician(technicianId);
        }
    }

    // Calendar methods - delegate to calendarManager
    previousMonth() {
        if (window.calendarManager) {
            window.calendarManager.previousMonth();
        }
    }

    nextMonth() {
        if (window.calendarManager) {
            window.calendarManager.nextMonth();
        }
    }

    previousWeek() {
        if (window.calendarManager) {
            window.calendarManager.previousWeek();
        }
    }

    nextWeek() {
        if (window.calendarManager) {
            window.calendarManager.nextWeek();
        }
    }

    todayView() {
        if (window.calendarManager) {
            window.calendarManager.todayView();
        }
    }

    // Search and filter methods - delegate to actionManager
    filterJobs() {
        if (window.actionManager) {
            window.actionManager.filterJobs();
        }
    }

    searchJobs() {
        if (window.actionManager) {
            window.actionManager.searchJobs();
        }
    }

    searchCustomers() {
        if (window.actionManager) {
            window.actionManager.searchCustomers();
        }
    }

    searchTechnicians() {
        if (window.actionManager) {
            const searchTerm = document.getElementById('technician-search')?.value || '';
            window.actionManager.searchTechnicians(searchTerm);
        }
    }

    filterTechnicians() {
        if (window.actionManager) {
            const filters = {
                status: document.getElementById('status-filter')?.value || '',
                skills: document.getElementById('skills-filter')?.value || ''
            };

            // Remove empty filters
            Object.keys(filters).forEach(key => {
                if (!filters[key]) delete filters[key];
            });

            window.actionManager.filterTechnicians(filters);
        }
    }

    // Export methods - delegate to reportsManager
    exportJobs() {
        if (window.reportsManager) {
            window.reportsManager.exportJobs();
        }
    }

    exportCustomers() {
        if (window.reportsManager) {
            window.reportsManager.exportCustomers();
        }
    }

    exportTechnicians() {
        if (window.reportsManager) {
            window.reportsManager.exportTechnicians();
        }
    }

    generateReport() {
        if (window.reportsManager) {
            window.reportsManager.generatePDFReport();
        }
    }
}

// Backward compatibility global functions
async function openModal(modalId) {
    if (window.modalManager) {
        await window.modalManager.openModal(modalId);
    } else if (window.app) {
        await window.app.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.modalManager) {
        window.modalManager.closeModal(modalId);
    } else if (window.app) {
        window.app.closeModal(modalId);
    }
}

function exportJobs() {
    if (window.reportsManager) {
        window.reportsManager.exportJobs();
    } else if (window.app) {
        window.app.exportJobs();
    }
}

function exportCustomers() {
    if (window.reportsManager) {
        window.reportsManager.exportCustomers();
    } else if (window.app) {
        window.app.exportCustomers();
    }
}

function previousWeek() {
    if (window.calendarManager) {
        window.calendarManager.previousWeek();
    } else if (window.app) {
        window.app.previousWeek();
    }
}

function nextWeek() {
    if (window.calendarManager) {
        window.calendarManager.nextWeek();
    } else if (window.app) {
        window.app.nextWeek();
    }
}

function todayView() {
    if (window.calendarManager) {
        window.calendarManager.todayView();
    } else if (window.app) {
        window.app.todayView();
    }
}

function filterJobs() {
    if (window.actionManager) {
        window.actionManager.filterJobs();
    } else if (window.app) {
        window.app.filterJobs();
    }
}

function searchJobs() {
    if (window.actionManager) {
        window.actionManager.searchJobs();
    } else if (window.app) {
        window.app.searchJobs();
    }
}

function searchCustomers() {
    if (window.actionManager) {
        window.actionManager.searchCustomers();
    } else if (window.app) {
        window.app.searchCustomers();
    }
}

function generateReport() {
    if (window.reportsManager) {
        window.reportsManager.generatePDFReport();
    } else if (window.app) {
        window.app.generateReport();
    }
}

// Page initialization functions called by template system
window.initDashboardPage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadDashboardData();
    }
};

window.initJobsPage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadJobsData();
    }
};

window.initCustomersPage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadCustomersData();
    }
};

window.initTechniciansPage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadTechniciansData();
    }
};

window.initSchedulePage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadScheduleData();
    }
};

window.initReportsPage = () => {
    if (window.pageRenderer) {
        window.pageRenderer.loadReportsData();
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SimpleOpenFieldApp();
});
