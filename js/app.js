// Main Application JavaScript
class SimpleOpenFieldApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentWeek = new Date();
        this.init();
    }

    init() {
        this.initializeApp();
        this.setupEventListeners();
        this.loadData();
        this.hideLoadingScreen();
    }

    initializeApp() {
        // Initialize navigation
        this.updateActiveNavLink();
        
        // Set up mobile navigation
        this.setupMobileNav();
        
        // Initialize forms
        this.setupForms();
        
        // Load initial page
        this.showPage(this.currentPage);
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile nav when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    setupForms() {
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

    navigateToPage(page) {
        this.currentPage = page;
        this.showPage(page);
        this.updateActiveNavLink();
        this.updatePageContent();
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    updatePageContent() {
        switch (this.currentPage) {
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

    loadData() {
        // Load data from localStorage or initialize with sample data
        if (!localStorage.getItem('sof_jobs')) {
            this.initializeSampleData();
        }
        this.loadDashboardData();
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
                createdAt: new Date().toISOString()
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
                createdAt: new Date(Date.now() - 86400000).toISOString()
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
                createdAt: new Date(Date.now() - 259200000).toISOString()
            }
        ];

        localStorage.setItem('sof_customers', JSON.stringify(sampleCustomers));
        localStorage.setItem('sof_technicians', JSON.stringify(sampleTechnicians));
        localStorage.setItem('sof_jobs', JSON.stringify(sampleJobs));
    }

    loadDashboardData() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');

        // Update stats
        document.getElementById('total-jobs').textContent = jobs.length;
        document.getElementById('pending-jobs').textContent = jobs.filter(j => j.status === 'pending').length;
        document.getElementById('completed-jobs').textContent = jobs.filter(j => j.status === 'completed').length;
        document.getElementById('total-customers').textContent = customers.length;

        // Load recent jobs
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
                    <span class="recent-item-badge status-badge status-${job.status}">${job.status}</span>
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
                    <td><span class="status-badge status-${job.status}">${job.status}</span></td>
                    <td>${technician ? technician.name : 'Unassigned'}</td>
                    <td>${scheduledDate}</td>
                    <td><span class="status-badge priority-${job.priority}">${job.priority}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn action-btn-view" onclick="app.viewJob('${job.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn action-btn-edit" onclick="app.editJob('${job.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn action-btn-delete" onclick="app.deleteJob('${job.id}')">
                                <i class="fas fa-trash"></i>
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
                        <div class="action-buttons">
                            <button class="action-btn action-btn-view" onclick="app.viewCustomer('${customer.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn action-btn-edit" onclick="app.editCustomer('${customer.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn action-btn-delete" onclick="app.deleteCustomer('${customer.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadTechniciansData() {
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
                <div class="technician-card">
                    <div class="technician-avatar">${initials}</div>
                    <div class="technician-name">${tech.name}</div>
                    <div class="technician-skills">${tech.skills}</div>
                    <div class="technician-status status-${tech.status}">
                        <i class="fas fa-circle"></i>
                        ${tech.status.replace('-', ' ')}
                    </div>
                    <div class="mt-4">
                        <button class="btn btn-sm btn-secondary" onclick="app.viewTechnician('${tech.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadScheduleData() {
        this.renderCalendar();
    }

    loadReportsData() {
        // This would integrate with a charting library like Chart.js
        // For now, we'll show placeholder content
        this.renderReportCharts();
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
            createdAt: new Date().toISOString()
        };

        jobs.push(newJob);
        localStorage.setItem('sof_jobs', JSON.stringify(jobs));
        
        this.closeModal('newJobModal');
        this.showToast('Job created successfully!', 'success');
        this.updatePageContent();
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
        
        this.closeModal('newCustomerModal');
        this.showToast('Customer added successfully!', 'success');
        this.updatePageContent();
        this.populateCustomerDropdowns();
        document.getElementById('newCustomerForm').reset();
    }

    handleNewTechnician() {
        const formData = new FormData(document.getElementById('newTechnicianForm'));
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        
        const newTechnician = {
            id: `TECH${String(technicians.length + 1).padStart(3, '0')}`,
            name: formData.get('name') || document.getElementById('technician-name').value,
            email: formData.get('email') || document.getElementById('technician-email').value,
            phone: formData.get('phone') || document.getElementById('technician-phone').value,
            skills: formData.get('skills') || document.getElementById('technician-skills').value,
            status: formData.get('status') || document.getElementById('technician-status').value
        };

        technicians.push(newTechnician);
        localStorage.setItem('sof_technicians', JSON.stringify(technicians));
        
        this.closeModal('newTechnicianModal');
        this.showToast('Technician added successfully!', 'success');
        this.updatePageContent();
        this.populateTechnicianDropdowns();
        document.getElementById('newTechnicianForm').reset();
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

    renderCalendar() {
        const container = document.getElementById('calendar-container');
        if (!container) return;

        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');

        // Simple calendar implementation
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = `
            <div class="calendar-header">
                <h3 class="calendar-title">${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <div class="calendar-nav">
                    <button class="calendar-nav-btn" onclick="app.previousMonth()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="calendar-nav-btn" onclick="app.nextMonth()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
        `;

        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayJobs = jobs.filter(job => {
                const jobDate = new Date(job.scheduledDate);
                return jobDate.toDateString() === currentDate.toDateString();
            });

            const isToday = currentDate.toDateString() === today.toDateString();
            const isOtherMonth = currentDate.getMonth() !== today.getMonth();

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}">
                    <div class="calendar-day-number">${currentDate.getDate()}</div>
                    ${dayJobs.map(job => {
                        const customer = customers.find(c => c.id === job.customer);
                        return `<div class="calendar-event">${customer ? customer.name : 'Unknown'} - ${job.serviceType}</div>`;
                    }).join('')}
                </div>
            `;
        }

        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
    }

    renderReportCharts() {
        // Placeholder for chart rendering
        const jobsChart = document.getElementById('jobs-chart');
        const revenueChart = document.getElementById('revenue-chart');
        const techPerformance = document.getElementById('technician-performance');
        const customerSatisfaction = document.getElementById('customer-satisfaction');

        if (jobsChart) {
            jobsChart.innerHTML = '<p>Chart placeholder - integrate with Chart.js or similar library</p>';
        }

        if (revenueChart) {
            revenueChart.innerHTML = '<p>Chart placeholder - integrate with Chart.js or similar library</p>';
        }

        if (techPerformance) {
            const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
            const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');

            techPerformance.innerHTML = technicians.map(tech => {
                const techJobs = jobs.filter(j => j.technician === tech.id);
                const completedJobs = techJobs.filter(j => j.status === 'completed');
                const completionRate = techJobs.length > 0 ? (completedJobs.length / techJobs.length * 100).toFixed(1) : 0;

                return `
                    <div class="performance-metric">
                        <span class="metric-label">${tech.name}</span>
                        <span class="metric-value">${completionRate}%</span>
                    </div>
                `;
            }).join('');
        }

        if (customerSatisfaction) {
            customerSatisfaction.innerHTML = `
                <div class="satisfaction-rating">
                    <div class="rating-circle">
                        <div class="rating-text">87%</div>
                    </div>
                </div>
            `;
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

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 1500);
    }

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 767) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    // Modal functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            
            // Populate dropdowns when opening job modal
            if (modalId === 'newJobModal') {
                this.populateCustomerDropdowns();
                this.populateTechnicianDropdowns();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 200);
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div>${message}</div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Action handlers (placeholder implementations)
    viewJob(jobId) {
        this.showToast(`Viewing job ${jobId}`, 'info');
    }

    editJob(jobId) {
        this.showToast(`Editing job ${jobId}`, 'info');
    }

    deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
            const updatedJobs = jobs.filter(job => job.id !== jobId);
            localStorage.setItem('sof_jobs', JSON.stringify(updatedJobs));
            this.updatePageContent();
            this.showToast('Job deleted successfully', 'success');
        }
    }

    viewCustomer(customerId) {
        this.showToast(`Viewing customer ${customerId}`, 'info');
    }

    editCustomer(customerId) {
        this.showToast(`Editing customer ${customerId}`, 'info');
    }

    deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
            const updatedCustomers = customers.filter(customer => customer.id !== customerId);
            localStorage.setItem('sof_customers', JSON.stringify(updatedCustomers));
            this.updatePageContent();
            this.showToast('Customer deleted successfully', 'success');
        }
    }

    viewTechnician(technicianId) {
        this.showToast(`Viewing technician ${technicianId}`, 'info');
    }

    // Export functions
    exportJobs() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const dataStr = JSON.stringify(jobs, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'jobs-export.json';
        link.click();
        this.showToast('Jobs exported successfully', 'success');
    }

    exportCustomers() {
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const dataStr = JSON.stringify(customers, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'customers-export.json';
        link.click();
        this.showToast('Customers exported successfully', 'success');
    }

    // Calendar navigation
    previousMonth() {
        this.currentWeek.setMonth(this.currentWeek.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentWeek.setMonth(this.currentWeek.getMonth() + 1);
        this.renderCalendar();
    }

    // Schedule navigation
    previousWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.renderCalendar();
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.renderCalendar();
    }

    todayView() {
        this.currentWeek = new Date();
        this.renderCalendar();
    }

    // Filter and search functions
    filterJobs() {
        // Implementation for job filtering
        this.loadJobsData();
    }

    searchJobs() {
        // Implementation for job search
        this.loadJobsData();
    }

    searchCustomers() {
        // Implementation for customer search
        this.loadCustomersData();
    }

    generateReport() {
        this.showToast('PDF report generation would be implemented here', 'info');
    }
}

// Global functions for onclick handlers
function openModal(modalId) {
    if (window.app) {
        window.app.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.app) {
        window.app.closeModal(modalId);
    }
}

function exportJobs() {
    if (window.app) {
        window.app.exportJobs();
    }
}

function exportCustomers() {
    if (window.app) {
        window.app.exportCustomers();
    }
}

function previousWeek() {
    if (window.app) {
        window.app.previousWeek();
    }
}

function nextWeek() {
    if (window.app) {
        window.app.nextWeek();
    }
}

function todayView() {
    if (window.app) {
        window.app.todayView();
    }
}

function filterJobs() {
    if (window.app) {
        window.app.filterJobs();
    }
}

function searchJobs() {
    if (window.app) {
        window.app.searchJobs();
    }
}

function searchCustomers() {
    if (window.app) {
        window.app.searchCustomers();
    }
}

function generateReport() {
    if (window.app) {
        window.app.generateReport();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SimpleOpenFieldApp();
});
