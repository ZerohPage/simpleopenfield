// Page Rendering Module
class PageRenderer {
    constructor() {
        this.init();
    }

    init() {
        // Initialize with sample data if needed
        this.loadData();
    }

    loadData() {
        // Load data from localStorage or initialize with sample data
        if (!localStorage.getItem('sof_jobs')) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        const sampleCustomers = [
            {
                id: 'CUST001',
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '(555) 123-4567',
                address: '123 Main St, Anytown, ST 12345'
            },
            {
                id: 'CUST002',
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '(555) 987-6543',
                address: '456 Oak Ave, Somewhere, ST 54321'
            },
            {
                id: 'CUST003',
                name: 'Mike Wilson',
                email: 'mike.wilson@email.com',
                phone: '(555) 456-7890',
                address: '789 Pine Rd, Elsewhere, ST 67890'
            }
        ];

        const sampleTechnicians = [
            {
                id: 'TECH001',
                name: 'Alex Rodriguez',
                email: 'alex.r@company.com',
                phone: '(555) 111-2222',
                skills: 'HVAC, Electrical',
                status: 'available'
            },
            {
                id: 'TECH002',
                name: 'Maria Garcia',
                email: 'maria.g@company.com',
                phone: '(555) 333-4444',
                skills: 'Plumbing, General Maintenance',
                status: 'busy'
            },
            {
                id: 'TECH003',
                name: 'David Chen',
                email: 'david.c@company.com',
                phone: '(555) 555-6666',
                skills: 'Electrical, Solar Installation',
                status: 'available'
            }
        ];

        const sampleJobs = [
            {
                id: 'JOB001',
                customer: 'CUST001',
                serviceType: 'maintenance',
                description: 'Annual HVAC maintenance and filter replacement',
                technician: 'TECH001',
                scheduledDate: new Date(Date.now() + 86400000).toISOString(),
                status: 'pending',
                priority: 'medium',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'JOB002',
                customer: 'CUST002',
                serviceType: 'repair',
                description: 'Fix leaking kitchen faucet',
                technician: 'TECH002',
                scheduledDate: new Date().toISOString(),
                status: 'in-progress',
                priority: 'high',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'JOB003',
                customer: 'CUST003',
                serviceType: 'installation',
                description: 'Install new ceiling fan in living room',
                technician: 'TECH003',
                scheduledDate: new Date(Date.now() - 172800000).toISOString(),
                status: 'completed',
                priority: 'low',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('sof_customers', JSON.stringify(sampleCustomers));
        localStorage.setItem('sof_technicians', JSON.stringify(sampleTechnicians));
        localStorage.setItem('sof_jobs', JSON.stringify(sampleJobs));
    }

    updatePageContent(page = null) {
        const currentPage = page || (window.navigationManager ? window.navigationManager.getCurrentPage() : 'dashboard');
        
        switch (currentPage) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'jobs':
                this.loadJobsData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'technicians':
                this.loadTechniciansData();
                break;
            case 'schedule':
                this.loadScheduleData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
        }
    }

    loadDashboardData() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');

        // Update stats
        const totalJobsEl = document.getElementById('total-jobs');
        const pendingJobsEl = document.getElementById('pending-jobs');
        const completedJobsEl = document.getElementById('completed-jobs');
        const totalCustomersEl = document.getElementById('total-customers');

        if (totalJobsEl) totalJobsEl.textContent = jobs.length;
        if (pendingJobsEl) pendingJobsEl.textContent = jobs.filter(j => j.status === 'pending').length;
        if (completedJobsEl) completedJobsEl.textContent = jobs.filter(j => j.status === 'completed').length;
        if (totalCustomersEl) totalCustomersEl.textContent = customers.length;

        // Load recent jobs and today's schedule
        this.loadRecentJobs();
        this.loadTodaysSchedule();
    }

    loadRecentJobs() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        
        const recentJobs = jobs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const container = document.getElementById('recent-jobs');
        if (!container) return;

        if (recentJobs.length === 0) {
            container.innerHTML = this.getEmptyState('No recent jobs', 'briefcase');
            return;
        }

        container.innerHTML = recentJobs.map(job => {
            const customer = customers.find(c => c.id === job.customer);
            return `
                <div class="recent-item">
                    <div class="recent-item-info">
                        <div class="recent-item-title">${job.id} - ${job.serviceType}</div>
                        <div class="recent-item-subtitle">${customer ? customer.name : 'Unknown Customer'}</div>
                    </div>
                    <span class="tag status-${job.status}">${job.status}</span>
                </div>
            `;
        }).join('');
    }

    loadTodaysSchedule() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        
        const today = new Date();
        const todaysJobs = jobs.filter(job => {
            const jobDate = new Date(job.scheduledDate);
            return jobDate.toDateString() === today.toDateString();
        });

        const container = document.getElementById('todays-schedule');
        if (!container) return;

        if (todaysJobs.length === 0) {
            container.innerHTML = this.getEmptyState('No jobs scheduled for today', 'calendar-alt');
            return;
        }

        container.innerHTML = todaysJobs.map(job => {
            const customer = customers.find(c => c.id === job.customer);
            const technician = technicians.find(t => t.id === job.technician);
            const time = new Date(job.scheduledDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            return `
                <div class="schedule-item">
                    <div class="schedule-time">${time}</div>
                    <div class="schedule-details">
                        <div class="schedule-title">${job.serviceType} - ${customer ? customer.name : 'Unknown'}</div>
                        <div class="schedule-subtitle">${technician ? technician.name : 'Unassigned'}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadJobsData() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        const tbody = document.getElementById('jobs-table-body');
        if (!tbody) return;

        if (jobs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">${this.getEmptyState('No jobs found', 'briefcase')}</td>
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

    loadCustomersData() {
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');

        const tbody = document.getElementById('customers-table-body');
        if (!tbody) return;

        if (customers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">${this.getEmptyState('No customers found', 'users')}</td>
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
    }    loadTechniciansData() {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');

        const container = document.getElementById('technicians-grid');
        if (!container) return;

        if (technicians.length === 0) {
            container.innerHTML = this.getEmptyState('No technicians found', 'user-hard-hat');
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

    loadScheduleData() {
        if (window.calendarManager) {
            window.calendarManager.renderCalendar();
        }
    }

    loadReportsData() {
        if (window.reportsManager) {
            window.reportsManager.renderReportCharts();
        }
    }

    getEmptyState(message, icon) {
        return `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <h3>No Data Found</h3>
                <p>${message}</p>
            </div>
        `;
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

// Global page renderer instance
window.pageRenderer = new PageRenderer();
