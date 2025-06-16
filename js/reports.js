// Reports and Analytics Module
class ReportsManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize reports functionality
    }

    renderReportCharts() {
        // Placeholder for chart rendering
        const jobsChart = document.getElementById('jobs-chart');
        const revenueChart = document.getElementById('revenue-chart');
        const techPerformance = document.getElementById('technician-performance');
        const customerSatisfaction = document.getElementById('customer-satisfaction');

        if (jobsChart) {
            this.renderJobsChart(jobsChart);
        }

        if (revenueChart) {
            this.renderRevenueChart(revenueChart);
        }

        if (techPerformance) {
            this.renderTechnicianPerformance(techPerformance);
        }

        if (customerSatisfaction) {
            this.renderCustomerSatisfaction(customerSatisfaction);
        }
    }

    renderJobsChart(container) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        
        // Create simple job status breakdown
        const statusCounts = {
            pending: jobs.filter(j => j.status === 'pending').length,
            'in-progress': jobs.filter(j => j.status === 'in-progress').length,
            completed: jobs.filter(j => j.status === 'completed').length,
            cancelled: jobs.filter(j => j.status === 'cancelled').length
        };

        container.innerHTML = `
            <div class="chart-placeholder">
                <h4 class="subtitle is-5">Jobs by Status</h4>
                <div class="chart-data">
                    ${Object.entries(statusCounts).map(([status, count]) => `
                        <div class="chart-item">
                            <span class="chart-label status-${status}">${status.replace('-', ' ')}</span>
                            <span class="chart-value">${count}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="help">Chart placeholder - integrate with Chart.js or similar library</p>
            </div>
        `;
    }

    renderRevenueChart(container) {
        // Mock revenue data since we don't have pricing in jobs
        const currentMonth = new Date().getMonth();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mockRevenue = months.map((month, index) => ({
            month,
            revenue: Math.floor(Math.random() * 50000) + 10000,
            isCurrentMonth: index === currentMonth
        }));

        container.innerHTML = `
            <div class="chart-placeholder">
                <h4 class="subtitle is-5">Monthly Revenue</h4>
                <div class="chart-data">
                    ${mockRevenue.slice(-6).map(data => `
                        <div class="chart-item ${data.isCurrentMonth ? 'current' : ''}">
                            <span class="chart-label">${data.month}</span>
                            <span class="chart-value">$${data.revenue.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="help">Chart placeholder - integrate with Chart.js or similar library</p>
            </div>
        `;
    }

    renderTechnicianPerformance(container) {
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');

        container.innerHTML = `
            <div class="performance-report">
                <h4 class="subtitle is-5">Technician Performance</h4>
                ${technicians.map(tech => {
                    const techJobs = jobs.filter(j => j.technician === tech.id);
                    const completedJobs = techJobs.filter(j => j.status === 'completed');
                    const completionRate = techJobs.length > 0 ? (completedJobs.length / techJobs.length * 100).toFixed(1) : 0;

                    return `
                        <div class="performance-metric">
                            <div class="metric-header">
                                <span class="metric-label">${tech.name}</span>
                                <span class="metric-value">${completionRate}%</span>
                            </div>
                            <div class="metric-details">
                                <small>${completedJobs.length} of ${techJobs.length} jobs completed</small>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${completionRate}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderCustomerSatisfaction(container) {
        // Mock satisfaction data
        const satisfactionScore = Math.floor(Math.random() * 20) + 80; // 80-100%

        container.innerHTML = `
            <div class="satisfaction-report">
                <h4 class="subtitle is-5">Customer Satisfaction</h4>
                <div class="satisfaction-rating">
                    <div class="rating-circle">
                        <div class="rating-text">${satisfactionScore}%</div>
                    </div>
                </div>
                <div class="satisfaction-details">
                    <p class="help">Based on customer feedback surveys</p>
                </div>
            </div>
        `;
    }

    // Generate PDF report
    generatePDFReport() {
        // This would integrate with a PDF generation library like jsPDF
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        // For now, create a simple text report
        const reportData = {
            generatedDate: new Date().toLocaleDateString(),
            totalJobs: jobs.length,
            totalCustomers: customers.length,
            totalTechnicians: technicians.length,
            jobsByStatus: {
                pending: jobs.filter(j => j.status === 'pending').length,
                'in-progress': jobs.filter(j => j.status === 'in-progress').length,
                completed: jobs.filter(j => j.status === 'completed').length,
                cancelled: jobs.filter(j => j.status === 'cancelled').length
            },
            jobsByPriority: {
                low: jobs.filter(j => j.priority === 'low').length,
                medium: jobs.filter(j => j.priority === 'medium').length,
                high: jobs.filter(j => j.priority === 'high').length,
                urgent: jobs.filter(j => j.priority === 'urgent').length
            }
        };

        // Create downloadable report
        const reportText = this.generateReportText(reportData);
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();

        if (window.uiManager) {
            window.uiManager.showToast('Report generated successfully', 'success');
        }
    }

    generateReportText(data) {
        return `
SIMPLEOPENFIELD REPORT
Generated: ${data.generatedDate}

SUMMARY
=======
Total Jobs: ${data.totalJobs}
Total Customers: ${data.totalCustomers}
Total Technicians: ${data.totalTechnicians}

JOBS BY STATUS
==============
Pending: ${data.jobsByStatus.pending}
In Progress: ${data.jobsByStatus['in-progress']}
Completed: ${data.jobsByStatus.completed}
Cancelled: ${data.jobsByStatus.cancelled}

JOBS BY PRIORITY
================
Low: ${data.jobsByPriority.low}
Medium: ${data.jobsByPriority.medium}
High: ${data.jobsByPriority.high}
Urgent: ${data.jobsByPriority.urgent}

This report was generated automatically by SimpleOpenField.
        `.trim();
    }

    // Export data functions
    exportJobs() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        this.downloadJSON(jobs, 'jobs-export.json');
        
        if (window.uiManager) {
            window.uiManager.showToast('Jobs exported successfully', 'success');
        }
    }

    exportCustomers() {
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        this.downloadJSON(customers, 'customers-export.json');
        
        if (window.uiManager) {
            window.uiManager.showToast('Customers exported successfully', 'success');
        }
    }

    exportAllData() {
        const allData = {
            jobs: JSON.parse(localStorage.getItem('sof_jobs') || '[]'),
            customers: JSON.parse(localStorage.getItem('sof_customers') || '[]'),
            technicians: JSON.parse(localStorage.getItem('sof_technicians') || '[]'),
            settings: JSON.parse(localStorage.getItem('sof_settings') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        this.downloadJSON(allData, 'simpleopenfield-backup.json');
        
        if (window.uiManager) {
            window.uiManager.showToast('All data exported successfully', 'success');
        }
    }

    downloadJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Analytics helpers
    getJobsInDateRange(startDate, endDate) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return jobs.filter(job => {
            const jobDate = new Date(job.scheduledDate);
            return jobDate >= start && jobDate <= end;
        });
    }

    calculateMetrics() {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        const completedJobs = jobs.filter(j => j.status === 'completed');
        const averageJobsPerTechnician = technicians.length > 0 ? jobs.length / technicians.length : 0;
        const completionRate = jobs.length > 0 ? (completedJobs.length / jobs.length * 100).toFixed(1) : 0;

        return {
            totalJobs: jobs.length,
            totalCustomers: customers.length,
            totalTechnicians: technicians.length,
            completedJobs: completedJobs.length,
            averageJobsPerTechnician: averageJobsPerTechnician.toFixed(1),
            completionRate: parseFloat(completionRate)
        };
    }
}

// Global functions for reports
function generateReport() {
    if (window.reportsManager) {
        window.reportsManager.generatePDFReport();
    }
}

function exportJobs() {
    if (window.reportsManager) {
        window.reportsManager.exportJobs();
    }
}

function exportCustomers() {
    if (window.reportsManager) {
        window.reportsManager.exportCustomers();
    }
}

// Global reports manager instance
window.reportsManager = new ReportsManager();
