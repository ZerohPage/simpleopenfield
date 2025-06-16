// Actions Module - CRUD operations and user actions
class ActionManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize action handlers
    }

    // Job Actions
    viewJob(jobId) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const job = jobs.find(j => j.id === jobId);
        
        if (job) {
            const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
            const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
            const customer = customers.find(c => c.id === job.customer);
            const technician = technicians.find(t => t.id === job.technician);
            
            const jobDetails = `
                <strong>Job ID:</strong> ${job.id}<br>
                <strong>Customer:</strong> ${customer ? customer.name : 'Unknown'}<br>
                <strong>Service Type:</strong> ${job.serviceType}<br>
                <strong>Description:</strong> ${job.description}<br>
                <strong>Technician:</strong> ${technician ? technician.name : 'Unassigned'}<br>
                <strong>Scheduled Date:</strong> ${new Date(job.scheduledDate).toLocaleDateString()}<br>
                <strong>Status:</strong> ${job.status}<br>
                <strong>Priority:</strong> ${job.priority}<br>
                <strong>Created:</strong> ${new Date(job.createdAt).toLocaleDateString()}
            `;
            
            if (window.modalManager) {
                window.modalManager.showAlert('Job Details', jobDetails, 'info');
            } else if (window.uiManager) {
                window.uiManager.showToast(`Viewing job ${jobId}`, 'info');
            }
        } else {
            if (window.uiManager) {
                window.uiManager.showToast('Job not found', 'danger');
            }
        }
    }

    editJob(jobId) {
        // For now, show a placeholder message
        // In a full implementation, this would open an edit modal
        if (window.uiManager) {
            window.uiManager.showToast(`Edit functionality for job ${jobId} would be implemented here`, 'info');
        }
    }

    deleteJob(jobId) {
        if (window.modalManager) {
            window.modalManager.showConfirmation(
                'Delete Job',
                'Are you sure you want to delete this job?',
                () => {
                    const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
                    const updatedJobs = jobs.filter(job => job.id !== jobId);
                    localStorage.setItem('sof_jobs', JSON.stringify(updatedJobs));
                    
                    if (window.pageRenderer) {
                        window.pageRenderer.updatePageContent();
                    }
                    if (window.uiManager) {
                        window.uiManager.showToast('Job deleted successfully', 'success');
                    }
                }
            );
        } else {
            // Fallback for browsers without modal support
            if (confirm('Are you sure you want to delete this job?')) {
                const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
                const updatedJobs = jobs.filter(job => job.id !== jobId);
                localStorage.setItem('sof_jobs', JSON.stringify(updatedJobs));
                
                if (window.pageRenderer) {
                    window.pageRenderer.updatePageContent();
                }
                if (window.uiManager) {
                    window.uiManager.showToast('Job deleted successfully', 'success');
                }
            }
        }
    }

    updateJobStatus(jobId, newStatus) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex !== -1) {
            jobs[jobIndex].status = newStatus;
            jobs[jobIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('sof_jobs', JSON.stringify(jobs));
            
            if (window.pageRenderer) {
                window.pageRenderer.updatePageContent();
            }
            if (window.uiManager) {
                window.uiManager.showToast(`Job status updated to ${newStatus}`, 'success');
            }
        }
    }

    // Customer Actions
    viewCustomer(customerId) {
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const customer = customers.find(c => c.id === customerId);
        
        if (customer) {
            const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
            const customerJobs = jobs.filter(j => j.customer === customerId);
            
            const customerDetails = `
                <strong>Customer ID:</strong> ${customer.id}<br>
                <strong>Name:</strong> ${customer.name}<br>
                <strong>Email:</strong> ${customer.email}<br>
                <strong>Phone:</strong> ${customer.phone}<br>
                <strong>Address:</strong> ${customer.address}<br>
                <strong>Total Jobs:</strong> ${customerJobs.length}
            `;
            
            if (window.modalManager) {
                window.modalManager.showAlert('Customer Details', customerDetails, 'info');
            } else if (window.uiManager) {
                window.uiManager.showToast(`Viewing customer ${customerId}`, 'info');
            }
        } else {
            if (window.uiManager) {
                window.uiManager.showToast('Customer not found', 'danger');
            }
        }
    }

    editCustomer(customerId) {
        // For now, show a placeholder message
        // In a full implementation, this would open an edit modal
        if (window.uiManager) {
            window.uiManager.showToast(`Edit functionality for customer ${customerId} would be implemented here`, 'info');
        }
    }

    deleteCustomer(customerId) {
        // Check if customer has jobs
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customerJobs = jobs.filter(j => j.customer === customerId);
        
        if (customerJobs.length > 0) {
            if (window.modalManager) {
                window.modalManager.showAlert(
                    'Cannot Delete Customer',
                    `This customer has ${customerJobs.length} job(s) assigned. Please reassign or delete these jobs first.`,
                    'warning'
                );
            } else if (window.uiManager) {
                window.uiManager.showToast('Cannot delete customer with assigned jobs', 'warning');
            }
            return;
        }

        if (window.modalManager) {
            window.modalManager.showConfirmation(
                'Delete Customer',
                'Are you sure you want to delete this customer?',
                () => {
                    const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
                    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
                    localStorage.setItem('sof_customers', JSON.stringify(updatedCustomers));
                    
                    if (window.pageRenderer) {
                        window.pageRenderer.updatePageContent();
                    }
                    if (window.uiManager) {
                        window.uiManager.showToast('Customer deleted successfully', 'success');
                    }
                }
            );
        } else {
            // Fallback for browsers without modal support
            if (confirm('Are you sure you want to delete this customer?')) {
                const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
                const updatedCustomers = customers.filter(customer => customer.id !== customerId);
                localStorage.setItem('sof_customers', JSON.stringify(updatedCustomers));
                
                if (window.pageRenderer) {
                    window.pageRenderer.updatePageContent();
                }
                if (window.uiManager) {
                    window.uiManager.showToast('Customer deleted successfully', 'success');
                }
            }
        }
    }

    // Technician Actions
    viewTechnician(technicianId) {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const technician = technicians.find(t => t.id === technicianId);
        
        if (technician) {
            const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
            const technicianJobs = jobs.filter(j => j.technician === technicianId);
            const completedJobs = technicianJobs.filter(j => j.status === 'completed');
            const pendingJobs = technicianJobs.filter(j => j.status === 'pending');
            const inProgressJobs = technicianJobs.filter(j => j.status === 'in-progress');
            
            const technicianDetails = `
                <div class="technician-details">
                    <div class="columns">
                        <div class="column is-half">
                            <strong>Technician ID:</strong> ${technician.id}<br>
                            <strong>Name:</strong> ${technician.name}<br>
                            <strong>Email:</strong> ${technician.email}<br>
                            <strong>Phone:</strong> ${technician.phone}<br>
                            <strong>Skills:</strong> ${technician.skills || 'Not specified'}<br>
                            <strong>Status:</strong> <span class="tag ${technician.status === 'available' ? 'is-success' : technician.status === 'busy' ? 'is-warning' : 'is-light'}">${technician.status.replace('-', ' ')}</span>
                        </div>
                        <div class="column is-half">
                            <h6 class="subtitle is-6">Job Statistics</h6>
                            <strong>Total Jobs:</strong> ${technicianJobs.length}<br>
                            <strong>Completed:</strong> ${completedJobs.length}<br>
                            <strong>In Progress:</strong> ${inProgressJobs.length}<br>
                            <strong>Pending:</strong> ${pendingJobs.length}<br>
                            <strong>Created:</strong> ${new Date(technician.createdAt).toLocaleDateString()}<br>
                            <strong>Last Updated:</strong> ${new Date(technician.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            `;
            
            if (window.modalManager) {
                window.modalManager.showAlert('Technician Details', technicianDetails, 'info');
            } else if (window.uiManager) {
                window.uiManager.showToast('Technician details loaded', 'info');
            }
        } else {
            if (window.uiManager) {
                window.uiManager.showToast('Technician not found', 'danger');
            }
        }
    }

    editTechnician(technicianId) {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const technician = technicians.find(t => t.id === technicianId);
        
        if (technician) {
            // Populate the form with existing data
            document.getElementById('technician-name').value = technician.name;
            document.getElementById('technician-email').value = technician.email;
            document.getElementById('technician-phone').value = technician.phone;
            document.getElementById('technician-skills').value = technician.skills || '';
            document.getElementById('technician-status').value = technician.status;
            
            // Change the form to edit mode
            const form = document.getElementById('newTechnicianForm');
            const submitButton = form.querySelector('button[type="submit"]');
            const modalTitle = document.querySelector('#newTechnicianModal .title');
            
            if (form) {
                form.setAttribute('data-edit-id', technicianId);
                if (submitButton) submitButton.textContent = 'Update Technician';
                if (modalTitle) modalTitle.textContent = 'Edit Technician';
            }
            
            // Open the modal
            if (window.openModal) {
                window.openModal('newTechnicianModal');
            }
        } else {
            if (window.uiManager) {
                window.uiManager.showToast('Technician not found', 'danger');
            }
        }
    }

    deleteTechnician(technicianId) {
        // Check if technician has assigned jobs
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const technicianJobs = jobs.filter(j => j.technician === technicianId);
        
        if (technicianJobs.length > 0) {
            const activeJobs = technicianJobs.filter(j => j.status === 'pending' || j.status === 'in-progress');
            if (activeJobs.length > 0) {
                if (window.uiManager) {
                    window.uiManager.showToast(`Cannot delete technician with ${activeJobs.length} active jobs`, 'danger');
                }
                return;
            }
        }

        if (window.modalManager) {
            window.modalManager.showConfirm(
                'Delete Technician',
                `Are you sure you want to delete this technician? This action cannot be undone.`,
                () => {
                    const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
                    const updatedTechnicians = technicians.filter(technician => technician.id !== technicianId);
                    localStorage.setItem('sof_technicians', JSON.stringify(updatedTechnicians));
                    
                    if (window.pageRenderer) {
                        window.pageRenderer.updatePageContent();
                    }
                    if (window.uiManager) {
                        window.uiManager.showToast('Technician deleted successfully', 'success');
                    }
                }
            );
        } else {
            // Fallback for browsers without modal support
            if (confirm('Are you sure you want to delete this technician?')) {
                const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
                const updatedTechnicians = technicians.filter(technician => technician.id !== technicianId);
                localStorage.setItem('sof_technicians', JSON.stringify(updatedTechnicians));
                
                if (window.pageRenderer) {
                    window.pageRenderer.updatePageContent();
                }
                if (window.uiManager) {
                    window.uiManager.showToast('Technician deleted successfully', 'success');
                }
            }
        }
    }

    searchTechnicians(searchTerm = '') {
        if (!searchTerm.trim()) {
            if (window.pageRenderer) {
                window.pageRenderer.loadTechniciansData();
            }
            return;
        }

        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const searchTermLower = searchTerm.toLowerCase();
        
        const filteredTechnicians = technicians.filter(technician => 
            technician.name.toLowerCase().includes(searchTermLower) ||
            technician.email.toLowerCase().includes(searchTermLower) ||
            technician.phone.includes(searchTerm) ||
            (technician.skills && technician.skills.toLowerCase().includes(searchTermLower)) ||
            technician.status.toLowerCase().includes(searchTermLower)
        );

        this.displayFilteredTechnicians(filteredTechnicians);
        
        if (window.uiManager) {
            window.uiManager.showToast(`${filteredTechnicians.length} technicians found`, 'info');
        }
    }

    filterTechnicians(filters = {}) {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        
        let filteredTechnicians = technicians.filter(technician => {
            // Filter by status
            if (filters.status && filters.status !== '' && technician.status !== filters.status) {
                return false;
            }
            
            // Filter by skills (if technician has any of the specified skills)
            if (filters.skills && filters.skills !== '') {
                const filterSkills = filters.skills.toLowerCase().split(',').map(s => s.trim());
                const technicianSkills = (technician.skills || '').toLowerCase();
                if (!filterSkills.some(skill => technicianSkills.includes(skill))) {
                    return false;
                }
            }
            
            return true;
        });

        this.displayFilteredTechnicians(filteredTechnicians);
        
        if (window.uiManager) {
            window.uiManager.showToast(`${filteredTechnicians.length} technicians match your filters`, 'info');
        }
    }

    // Helper method for displaying filtered technicians results
    displayFilteredTechnicians(technicians) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const container = document.getElementById('technicians-grid');
        if (!container) return;

        if (technicians.length === 0) {
            container.innerHTML = `
                <div class="column is-full">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No technicians match your search</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = technicians.map(tech => {
            const techJobs = jobs.filter(j => j.technician === tech.id);
            const initials = tech.name.split(' ').map(n => n[0]).join('');

            return `
                <div class="column is-one-third">
                    <div class="card">
                        <div class="card-content has-text-centered">
                            <div class="media">
                                <div class="media-content">
                                    <div class="has-text-weight-bold has-text-primary mb-2" style="font-size: 2rem; background: #f0f0f0; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; margin: 0 auto;">${initials}</div>
                                    <p class="title is-5">${tech.name}</p>
                                    <p class="subtitle is-6">${tech.skills || 'No specialization'}</p>
                                </div>
                            </div>
                            <div class="content">
                                <span class="tag ${tech.status === 'available' ? 'is-success' : tech.status === 'busy' ? 'is-warning' : 'is-light'}">
                                    ${tech.status.replace('-', ' ')}
                                </span>
                                <br><br>
                                <div class="field is-grouped is-grouped-centered">
                                    <div class="control">
                                        <button class="button is-small is-info" onclick="window.actionManager.viewTechnician('${tech.id}')" title="View Details">
                                            <span class="icon is-small">
                                                <i class="fas fa-eye"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="control">
                                        <button class="button is-small is-warning" onclick="window.actionManager.editTechnician('${tech.id}')" title="Edit Technician">
                                            <span class="icon is-small">
                                                <i class="fas fa-edit"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="control">
                                        <button class="button is-small is-danger" onclick="window.actionManager.deleteTechnician('${tech.id}')" title="Delete Technician">
                                            <span class="icon is-small">
                                                <i class="fas fa-trash"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <small class="has-text-grey">Jobs: ${techJobs.length}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Search and Filter Actions
    filterJobs(criteria = {}) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        let filteredJobs = [...jobs];

        // Apply filters
        if (criteria.status) {
            filteredJobs = filteredJobs.filter(job => job.status === criteria.status);
        }
        if (criteria.priority) {
            filteredJobs = filteredJobs.filter(job => job.priority === criteria.priority);
        }
        if (criteria.technician) {
            filteredJobs = filteredJobs.filter(job => job.technician === criteria.technician);
        }
        if (criteria.customer) {
            filteredJobs = filteredJobs.filter(job => job.customer === criteria.customer);
        }
        if (criteria.dateFrom) {
            const fromDate = new Date(criteria.dateFrom);
            filteredJobs = filteredJobs.filter(job => new Date(job.scheduledDate) >= fromDate);
        }
        if (criteria.dateTo) {
            const toDate = new Date(criteria.dateTo);
            filteredJobs = filteredJobs.filter(job => new Date(job.scheduledDate) <= toDate);
        }

        // Update the display with filtered results
        this.displayFilteredJobs(filteredJobs);
        
        if (window.uiManager) {
            window.uiManager.showToast(`${filteredJobs.length} jobs found`, 'info');
        }
    }

    searchJobs(searchTerm = '') {
        if (!searchTerm.trim()) {
            if (window.pageRenderer) {
                window.pageRenderer.loadJobsData();
            }
            return;
        }

        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        
        const searchTermLower = searchTerm.toLowerCase();
        
        const filteredJobs = jobs.filter(job => {
            const customer = customers.find(c => c.id === job.customer);
            const technician = technicians.find(t => t.id === job.technician);
            
            return (
                job.id.toLowerCase().includes(searchTermLower) ||
                job.serviceType.toLowerCase().includes(searchTermLower) ||
                job.description.toLowerCase().includes(searchTermLower) ||
                job.status.toLowerCase().includes(searchTermLower) ||
                job.priority.toLowerCase().includes(searchTermLower) ||
                (customer && customer.name.toLowerCase().includes(searchTermLower)) ||
                (technician && technician.name.toLowerCase().includes(searchTermLower))
            );
        });

        this.displayFilteredJobs(filteredJobs);
        
        if (window.uiManager) {
            window.uiManager.showToast(`${filteredJobs.length} jobs found`, 'info');
        }
    }

    searchCustomers(searchTerm = '') {
        if (!searchTerm.trim()) {
            if (window.pageRenderer) {
                window.pageRenderer.loadCustomersData();
            }
            return;
        }

        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const searchTermLower = searchTerm.toLowerCase();
        
        const filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTermLower) ||
            customer.email.toLowerCase().includes(searchTermLower) ||
            customer.phone.includes(searchTerm) ||
            customer.address.toLowerCase().includes(searchTermLower)
        );

        this.displayFilteredCustomers(filteredCustomers);
        
        if (window.uiManager) {
            window.uiManager.showToast(`${filteredCustomers.length} customers found`, 'info');
        }
    }

    // Helper methods for displaying filtered results
    displayFilteredJobs(jobs) {
        // This would update the jobs table with filtered results
        // For now, we'll use the existing loadJobsData method as a base
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        const tbody = document.getElementById('jobs-table-body');
        if (!tbody) return;

        if (jobs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h3>No jobs match your search</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = jobs.map(job => {
            const customer = customers.find(c => c.id === job.customer);
            const technician = technicians.find(t => t.id === job.technician);
            const scheduledDate = new Date(job.scheduledDate).toLocaleDateString();

            return `
                <tr>
                    <td>${job.id}</td>
                    <td>${customer ? customer.name : 'Unknown'}</td>
                    <td>${job.serviceType}</td>
                    <td><span class="tag status-${job.status}">${job.status}</span></td>
                    <td>${technician ? technician.name : 'Unassigned'}</td>
                    <td>${scheduledDate}</td>
                    <td><span class="tag priority-${job.priority}">${job.priority}</span></td>
                    <td>
                        <div class="buttons">
                            <button class="button is-small is-info" onclick="window.actionManager.viewJob('${job.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-eye"></i>
                                </span>
                            </button>
                            <button class="button is-small is-warning" onclick="window.actionManager.editJob('${job.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                            <button class="button is-small is-danger" onclick="window.actionManager.deleteJob('${job.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-trash"></i>
                                </span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    displayFilteredCustomers(customers) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const tbody = document.getElementById('customers-table-body');
        if (!tbody) return;

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h3>No customers match your search</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = customers.map(customer => {
            const customerJobs = jobs.filter(j => j.customer === customer.id);

            return `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td>${customerJobs.length}</td>
                    <td>
                        <div class="buttons">
                            <button class="button is-small is-info" onclick="window.actionManager.viewCustomer('${customer.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-eye"></i>
                                </span>
                            </button>
                            <button class="button is-small is-warning" onclick="window.actionManager.editCustomer('${customer.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                            <button class="button is-small is-danger" onclick="window.actionManager.deleteCustomer('${customer.id}')">
                                <span class="icon is-small">
                                    <i class="fas fa-trash"></i>
                                </span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Global functions for search and filter
function filterJobs() {
    if (window.actionManager) {
        // Get filter criteria from form elements
        const criteria = {
            status: document.getElementById('filter-status')?.value || '',
            priority: document.getElementById('filter-priority')?.value || '',
            technician: document.getElementById('filter-technician')?.value || '',
            customer: document.getElementById('filter-customer')?.value || '',
            dateFrom: document.getElementById('filter-date-from')?.value || '',
            dateTo: document.getElementById('filter-date-to')?.value || ''
        };
        
        // Remove empty criteria
        Object.keys(criteria).forEach(key => {
            if (!criteria[key]) delete criteria[key];
        });
        
        window.actionManager.filterJobs(criteria);
    }
}

function searchJobs() {
    if (window.actionManager) {
        const searchTerm = document.getElementById('job-search')?.value || '';
        window.actionManager.searchJobs(searchTerm);
    }
}

function searchCustomers() {
    if (window.actionManager) {
        const searchTerm = document.getElementById('customer-search')?.value || '';
        window.actionManager.searchCustomers(searchTerm);
    }
}

function searchTechnicians() {
    if (window.actionManager) {
        const searchTerm = document.getElementById('technician-search')?.value || '';
        window.actionManager.searchTechnicians(searchTerm);
    }
}

function filterTechnicians() {
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

function exportTechnicians() {
    if (window.reportsManager) {
        window.reportsManager.exportTechnicians();
    } else if (window.uiManager) {
        window.uiManager.showToast('Export functionality not yet implemented', 'info');
    }
}

// Global action manager instance
window.actionManager = new ActionManager();
