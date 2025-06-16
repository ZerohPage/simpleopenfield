// Form Handling Module
class FormManager {
    constructor() {
        this.init();
    }    init() {
        this.setupEventListeners();
        this.setupEventDelegation();
    }

    setupEventListeners() {
        // New Job Form
        const newJobForm = document.getElementById('newJobForm');
        if (newJobForm) {
            newJobForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewJob();
            });
        }

        // New Customer Form
        const newCustomerForm = document.getElementById('newCustomerForm');
        if (newCustomerForm) {
            newCustomerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewCustomer();
            });
        }

        // New Technician Form
        const newTechnicianForm = document.getElementById('newTechnicianForm');
        if (newTechnicianForm) {
            newTechnicianForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewTechnician();
            });
        }
    }

    setupEventDelegation() {
        // Use event delegation to handle form submissions for dynamically loaded content
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'newJobForm') {
                e.preventDefault();
                this.handleNewJob();
            } else if (e.target.id === 'newCustomerForm') {
                e.preventDefault();
                this.handleNewCustomer();
            } else if (e.target.id === 'newTechnicianForm') {
                e.preventDefault();
                this.handleNewTechnician();
            }
        });
    }

    // Method to reinitialize form listeners after modals are loaded
    reinitializeFormListeners() {
        this.setupEventListeners();
    }

    handleNewJob() {
        const formData = new FormData(document.getElementById('newJobForm'));
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        
        const newJob = {
            id: `JOB${String(jobs.length + 1).padStart(3, '0')}`,
            customer: formData.get('customer') || document.getElementById('job-customer').value,
            serviceType: formData.get('serviceType') || document.getElementById('job-service-type').value,
            description: formData.get('description') || document.getElementById('job-description').value,
            technician: formData.get('technician') || document.getElementById('job-technician').value,
            scheduledDate: formData.get('scheduledDate') || document.getElementById('job-date').value,
            priority: formData.get('priority') || document.getElementById('job-priority').value,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        jobs.push(newJob);
        localStorage.setItem('sof_jobs', JSON.stringify(jobs));
        
        if (window.modalManager) {
            window.modalManager.closeModal('newJobModal');
        }
        if (window.uiManager) {
            window.uiManager.showToast('Job created successfully!', 'success');
        }
        if (window.pageRenderer) {
            window.pageRenderer.updatePageContent();
        }
        document.getElementById('newJobForm').reset();
    }

    handleNewCustomer() {
        const formData = new FormData(document.getElementById('newCustomerForm'));
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        
        const newCustomer = {
            id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
            name: formData.get('name') || document.getElementById('customer-name').value,
            email: formData.get('email') || document.getElementById('customer-email').value,
            phone: formData.get('phone') || document.getElementById('customer-phone').value,
            address: formData.get('address') || document.getElementById('customer-address').value
        };

        customers.push(newCustomer);
        localStorage.setItem('sof_customers', JSON.stringify(customers));
        
        if (window.modalManager) {
            window.modalManager.closeModal('newCustomerModal');
        }
        if (window.uiManager) {
            window.uiManager.showToast('Customer added successfully!', 'success');
        }
        if (window.pageRenderer) {
            window.pageRenderer.updatePageContent();
        }
        this.populateCustomerDropdowns();
        document.getElementById('newCustomerForm').reset();
    }    handleNewTechnician() {
        const form = document.getElementById('newTechnicianForm');
        const editId = form.getAttribute('data-edit-id');
        const isEdit = !!editId;
        
        // Get form values
        const name = document.getElementById('technician-name').value.trim();
        const email = document.getElementById('technician-email').value.trim();
        const phone = document.getElementById('technician-phone').value.trim();
        const skills = document.getElementById('technician-skills').value.trim();
        const status = document.getElementById('technician-status').value;

        // Basic validation
        if (!name || !email || !phone || !status) {
            if (window.uiManager) {
                window.uiManager.showToast('Please fill in all required fields', 'danger');
            }
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (window.uiManager) {
                window.uiManager.showToast('Please enter a valid email address', 'danger');
            }
            return;
        }

        // Phone validation
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(phone)) {
            if (window.uiManager) {
                window.uiManager.showToast('Please enter a valid phone number', 'danger');
            }
            return;
        }

        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        // Check for duplicate email (exclude current technician when editing)
        const duplicateEmail = technicians.find(t => 
            t.email.toLowerCase() === email.toLowerCase() && 
            (!isEdit || t.id !== editId)
        );
        if (duplicateEmail) {
            if (window.uiManager) {
                window.uiManager.showToast('A technician with this email already exists', 'danger');
            }
            return;
        }

        if (isEdit) {
            // Edit existing technician
            const technicianIndex = technicians.findIndex(t => t.id === editId);
            if (technicianIndex !== -1) {
                technicians[technicianIndex] = {
                    ...technicians[technicianIndex],
                    name,
                    email,
                    phone,
                    skills,
                    status,
                    updatedAt: new Date().toISOString()
                };
                
                localStorage.setItem('sof_technicians', JSON.stringify(technicians));
                
                if (window.uiManager) {
                    window.uiManager.showToast('Technician updated successfully!', 'success');
                }
            }
        } else {
            // Create new technician
            const newTechnician = {
                id: `TECH${String(technicians.length + 1).padStart(3, '0')}`,
                name,
                email,
                phone,
                skills,
                status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            technicians.push(newTechnician);
            localStorage.setItem('sof_technicians', JSON.stringify(technicians));
            
            if (window.uiManager) {
                window.uiManager.showToast('Technician added successfully!', 'success');
            }
        }
        
        // Close modal and reset form
        if (window.closeModal) {
            window.closeModal('newTechnicianModal');
        }
        
        // Reset form to add mode
        this.resetTechnicianForm();
        
        // Update the page content and dropdowns
        if (window.pageRenderer) {
            window.pageRenderer.updatePageContent();
        }
        this.populateTechnicianDropdowns();
    }

    resetTechnicianForm() {
        const form = document.getElementById('newTechnicianForm');
        const submitButton = form.querySelector('button[type="submit"]');
        const modalTitle = document.querySelector('#newTechnicianModal .title');
        
        if (form) {
            form.reset();
            form.removeAttribute('data-edit-id');
            if (submitButton) submitButton.textContent = 'Add Technician';
            if (modalTitle) modalTitle.textContent = 'Add New Technician';
        }
    }

    populateCustomerDropdowns() {
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const select = document.getElementById('job-customer');
        
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Customer</option>';
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.name;
                if (customer.id === currentValue) option.selected = true;
                select.appendChild(option);
            });
        }
    }

    populateTechnicianDropdowns() {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const select = document.getElementById('job-technician');
        
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Technician</option>';
            technicians.forEach(technician => {
                const option = document.createElement('option');
                option.value = technician.id;
                option.textContent = technician.name;
                if (technician.id === currentValue) option.selected = true;
                select.appendChild(option);
            });
        }
    }

    // Validation helper methods
    validateField(field) {
        // Basic field validation
        const value = field.value.trim();
        const required = field.hasAttribute('required');
        
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('is-danger');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.help.is-danger');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('p');
        errorElement.className = 'help is-danger';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('is-danger');
        const errorElement = field.parentNode.querySelector('.help.is-danger');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Global form manager instance
window.formManager = new FormManager();
