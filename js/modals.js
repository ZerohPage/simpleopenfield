// Modal Management Module
class ModalManager {
    constructor() {
        this.activeModals = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
            
            // Close button clicks
            if (e.target.classList.contains('modal-close') || 
                e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }    async openModal(modalId) {
        try {
            // Load modal template if not already loaded
            const modal = await pageManager.loadModal(modalId);
            if (modal) {
                modal.classList.add('is-active');
                document.body.classList.add('is-clipped');
                
                // Add to active modals stack
                if (!this.activeModals.includes(modalId)) {
                    this.activeModals.push(modalId);
                }
                
                // Reinitialize form listeners for dynamically loaded modals
                if (window.formManager) {
                    window.formManager.reinitializeFormListeners();
                }
                
                // Populate dropdowns when opening job modal
                if (modalId === 'newJobModal' && window.formManager) {
                    window.formManager.populateCustomerDropdowns();
                    window.formManager.populateTechnicianDropdowns();
                }
                
                // Focus management for accessibility
                const firstInput = modal.querySelector('input, select, textarea, button');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }

                // Trigger modal opened event
                this.onModalOpened(modalId);
            }
        } catch (error) {
            console.error('Error opening modal:', error);
            if (window.uiManager) {
                window.uiManager.showToast('Error opening modal', 'danger');
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-active');
            
            // Remove from active modals stack
            const index = this.activeModals.indexOf(modalId);
            if (index > -1) {
                this.activeModals.splice(index, 1);
            }
            
            // Only remove body clipping if no modals are open
            if (this.activeModals.length === 0) {
                document.body.classList.remove('is-clipped');
            }

            // Clear any form data
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());

            // Trigger modal closed event
            this.onModalClosed(modalId);
        }
    }

    closeAllModals() {
        // Close all active modals
        [...this.activeModals].forEach(modalId => {
            this.closeModal(modalId);
        });
        
        // Ensure body clipping is removed
        document.body.classList.remove('is-clipped');
        this.activeModals = [];
    }

    isModalOpen(modalId) {
        return this.activeModals.includes(modalId);
    }

    getActiveModals() {
        return [...this.activeModals];
    }

    // Modal event handlers
    onModalOpened(modalId) {
        // Trigger custom events or callbacks
        const event = new CustomEvent('modalOpened', { 
            detail: { modalId } 
        });
        document.dispatchEvent(event);

        // Modal-specific initialization
        switch (modalId) {
            case 'newJobModal':
                this.initializeJobModal();
                break;
            case 'newCustomerModal':
                this.initializeCustomerModal();
                break;
            case 'newTechnicianModal':
                this.initializeTechnicianModal();
                break;
        }
    }

    onModalClosed(modalId) {
        // Trigger custom events or callbacks
        const event = new CustomEvent('modalClosed', { 
            detail: { modalId } 
        });
        document.dispatchEvent(event);
    }

    // Modal initialization methods
    initializeJobModal() {
        // Set default date to today
        const dateField = document.getElementById('job-date');
        if (dateField && !dateField.value) {
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            dateField.value = dateString;
        }

        // Set default time if there's a time field
        const timeField = document.getElementById('job-time');
        if (timeField && !timeField.value) {
            const now = new Date();
            const timeString = now.toTimeString().slice(0, 5);
            timeField.value = timeString;
        }
    }

    initializeCustomerModal() {
        // Focus on the name field
        const nameField = document.getElementById('customer-name');
        if (nameField) {
            setTimeout(() => nameField.focus(), 100);
        }
    }

    initializeTechnicianModal() {
        // Set default status to available
        const statusField = document.getElementById('technician-status');
        if (statusField && !statusField.value) {
            statusField.value = 'available';
        }
    }

    // Confirmation modals
    showConfirmation(title, message, onConfirm, onCancel = null) {
        const confirmModal = this.createConfirmationModal(title, message, onConfirm, onCancel);
        document.body.appendChild(confirmModal);
        this.openModal(confirmModal.id);
    }

    createConfirmationModal(title, message, onConfirm, onCancel) {
        const modalId = `confirm-modal-${Date.now()}`;
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">${title}</p>
                    <button class="delete modal-close" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <p>${message}</p>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-danger confirm-btn">Confirm</button>
                    <button class="button cancel-btn">Cancel</button>
                </footer>
            </div>
        `;

        // Add event listeners
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            this.closeModal(modalId);
            modal.remove();
        });

        cancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            this.closeModal(modalId);
            modal.remove();
        });

        return modal;
    }

    // Alert modals
    showAlert(title, message, type = 'info') {
        const alertModal = this.createAlertModal(title, message, type);
        document.body.appendChild(alertModal);
        this.openModal(alertModal.id);
    }

    createAlertModal(title, message, type) {
        const modalId = `alert-modal-${Date.now()}`;
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        const typeClass = type === 'danger' ? 'is-danger' : 
                         type === 'warning' ? 'is-warning' : 
                         type === 'success' ? 'is-success' : 'is-info';
        
        modal.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">${title}</p>
                    <button class="delete modal-close" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="notification ${typeClass}">
                        ${message}
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button ${typeClass} ok-btn">OK</button>
                </footer>
            </div>
        `;

        // Add event listener
        const okBtn = modal.querySelector('.ok-btn');
        okBtn.addEventListener('click', () => {
            this.closeModal(modalId);
            modal.remove();
        });

        return modal;
    }
}

// Global functions for modal management
async function openModal(modalId) {
    if (window.modalManager) {
        await window.modalManager.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.modalManager) {
        window.modalManager.closeModal(modalId);
    }
}

function showConfirmation(title, message, onConfirm, onCancel) {
    if (window.modalManager) {
        window.modalManager.showConfirmation(title, message, onConfirm, onCancel);
    }
}

function showAlert(title, message, type = 'info') {
    if (window.modalManager) {
        window.modalManager.showAlert(title, message, type);
    }
}

// Global modal manager instance
window.modalManager = new ModalManager();
