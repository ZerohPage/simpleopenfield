// Calendar and Scheduling Module
class CalendarManager {
    constructor() {
        this.currentWeek = new Date();
        this.init();
    }

    init() {
        // Calendar is initialized when needed
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
                    <button class="calendar-nav-btn" onclick="window.calendarManager.previousMonth()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="calendar-nav-btn" onclick="window.calendarManager.nextMonth()">
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

    // Calendar navigation methods
    previousMonth() {
        this.currentWeek.setMonth(this.currentWeek.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentWeek.setMonth(this.currentWeek.getMonth() + 1);
        this.renderCalendar();
    }

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

    // Week view rendering (for schedule page)
    renderWeekView() {
        const container = document.getElementById('week-view-container');
        if (!container) return;

        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const customers = JSON.parse(localStorage.getItem('sof_customers') || '[]');
        const technicians = JSON.parse(localStorage.getItem('sof_technicians') || '[]');

        // Get the start of the current week (Sunday)
        const startOfWeek = new Date(this.currentWeek);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        let weekHTML = `
            <div class="week-header">
                <div class="week-navigation">
                    <button class="button is-small" onclick="window.calendarManager.previousWeek()">
                        <span class="icon">
                            <i class="fas fa-chevron-left"></i>
                        </span>
                    </button>
                    <h3 class="week-title">Week of ${startOfWeek.toLocaleDateString()}</h3>
                    <button class="button is-small" onclick="window.calendarManager.nextWeek()">
                        <span class="icon">
                            <i class="fas fa-chevron-right"></i>
                        </span>
                    </button>
                    <button class="button is-small is-primary" onclick="window.calendarManager.todayView()">
                        Today
                    </button>
                </div>
            </div>
            <div class="week-grid">
        `;

        // Generate 7 days
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            
            const dayJobs = jobs.filter(job => {
                const jobDate = new Date(job.scheduledDate);
                return jobDate.toDateString() === currentDate.toDateString();
            });

            const isToday = currentDate.toDateString() === new Date().toDateString();

            weekHTML += `
                <div class="week-day ${isToday ? 'today' : ''}">
                    <div class="week-day-header">
                        <div class="week-day-name">${currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div class="week-day-date">${currentDate.getDate()}</div>
                    </div>
                    <div class="week-day-jobs">
                        ${dayJobs.map(job => {
                            const customer = customers.find(c => c.id === job.customer);
                            const technician = technicians.find(t => t.id === job.technician);
                            const time = new Date(job.scheduledDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });

                            return `
                                <div class="week-job status-${job.status}" onclick="window.actionManager.viewJob('${job.id}')">
                                    <div class="job-time">${time}</div>
                                    <div class="job-title">${job.serviceType}</div>
                                    <div class="job-customer">${customer ? customer.name : 'Unknown'}</div>
                                    <div class="job-technician">${technician ? technician.name : 'Unassigned'}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        weekHTML += '</div>';
        container.innerHTML = weekHTML;
    }

    // Get jobs for a specific date
    getJobsForDate(date) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        return jobs.filter(job => {
            const jobDate = new Date(job.scheduledDate);
            return jobDate.toDateString() === date.toDateString();
        });
    }

    // Add job to calendar (drag and drop support)
    addJobToDate(jobId, newDate) {
        const jobs = JSON.parse(localStorage.getItem('sof_jobs') || '[]');
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex !== -1) {
            jobs[jobIndex].scheduledDate = newDate.toISOString();
            jobs[jobIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('sof_jobs', JSON.stringify(jobs));
            
            this.renderCalendar();
            
            if (window.uiManager) {
                window.uiManager.showToast('Job rescheduled successfully', 'success');
            }
        }
    }
}

// Global functions for calendar navigation
function previousWeek() {
    if (window.calendarManager) {
        window.calendarManager.previousWeek();
    }
}

function nextWeek() {
    if (window.calendarManager) {
        window.calendarManager.nextWeek();
    }
}

function todayView() {
    if (window.calendarManager) {
        window.calendarManager.todayView();
    }
}

// Global calendar manager instance
window.calendarManager = new CalendarManager();
