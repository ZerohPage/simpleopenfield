// Data Management Module
class DataManager {
    constructor() {
        this.storageKeys = {
            jobs: 'sof_jobs',
            customers: 'sof_customers',
            technicians: 'sof_technicians',
            settings: 'sof_settings'
        };
        this.init();
    }

    init() {
        // Initialize storage if not exists
        this.ensureStorageStructure();
        
        // Set up data validation
        this.setupValidation();
    }

    ensureStorageStructure() {
        Object.values(this.storageKeys).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });

        // Initialize settings
        if (!localStorage.getItem(this.storageKeys.settings)) {
            const defaultSettings = {
                theme: 'light',
                dateFormat: 'MM/DD/YYYY',
                currency: 'USD',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                notifications: true,
                autoSave: true
            };
            localStorage.setItem(this.storageKeys.settings, JSON.stringify(defaultSettings));
        }
    }

    setupValidation() {
        this.validators = {
            email: (email) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },
            phone: (phone) => {
                const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                return re.test(phone);
            },
            required: (value) => {
                return value && value.trim().length > 0;
            },
            date: (date) => {
                return !isNaN(Date.parse(date));
            }
        };
    }

    // Generic CRUD operations
    create(type, data) {
        try {
            const items = this.getAll(type);
            const newItem = {
                ...data,
                id: this.generateId(type),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (this.validate(type, newItem)) {
                items.push(newItem);
                this.saveAll(type, items);
                return { success: true, data: newItem };
            } else {
                return { success: false, error: 'Validation failed' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    read(type, id) {
        try {
            const items = this.getAll(type);
            const item = items.find(item => item.id === id);
            return item ? { success: true, data: item } : { success: false, error: 'Item not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    update(type, id, data) {
        try {
            const items = this.getAll(type);
            const index = items.findIndex(item => item.id === id);
            
            if (index !== -1) {
                const updatedItem = {
                    ...items[index],
                    ...data,
                    updatedAt: new Date().toISOString()
                };

                if (this.validate(type, updatedItem)) {
                    items[index] = updatedItem;
                    this.saveAll(type, items);
                    return { success: true, data: updatedItem };
                } else {
                    return { success: false, error: 'Validation failed' };
                }
            } else {
                return { success: false, error: 'Item not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    delete(type, id) {
        try {
            const items = this.getAll(type);
            const index = items.findIndex(item => item.id === id);
            
            if (index !== -1) {
                const deletedItem = items.splice(index, 1)[0];
                this.saveAll(type, items);
                return { success: true, data: deletedItem };
            } else {
                return { success: false, error: 'Item not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getAll(type) {
        try {
            const key = this.storageKeys[type];
            if (!key) throw new Error('Invalid data type');
            
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting data:', error);
            return [];
        }
    }

    saveAll(type, data) {
        try {
            const key = this.storageKeys[type];
            if (!key) throw new Error('Invalid data type');
            
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    generateId(type) {
        const items = this.getAll(type);
        const prefix = type.toUpperCase().substring(0, 4);
        const nextNumber = items.length + 1;
        return `${prefix}${String(nextNumber).padStart(3, '0')}`;
    }

    validate(type, data) {
        const rules = this.getValidationRules(type);
        
        for (const field in rules) {
            const value = data[field];
            const fieldRules = rules[field];

            for (const rule of fieldRules) {
                if (typeof rule === 'string') {
                    if (!this.validators[rule](value)) {
                        console.error(`Validation failed for ${field}: ${rule}`);
                        return false;
                    }
                } else if (typeof rule === 'function') {
                    if (!rule(value)) {
                        console.error(`Validation failed for ${field}: custom rule`);
                        return false;
                    }
                }
            }
        }

        return true;
    }

    getValidationRules(type) {
        const rules = {
            jobs: {
                customer: ['required'],
                serviceType: ['required'],
                description: ['required'],
                scheduledDate: ['required', 'date'],
                priority: ['required'],
                status: ['required']
            },
            customers: {
                name: ['required'],
                email: ['required', 'email'],
                phone: ['required', 'phone'],
                address: ['required']
            },
            technicians: {
                name: ['required'],
                email: ['required', 'email'],
                phone: ['required', 'phone'],
                status: ['required']
            }
        };

        return rules[type] || {};
    }

    // Search and filter functions
    search(type, query, fields = []) {
        const items = this.getAll(type);
        const searchQuery = query.toLowerCase();

        return items.filter(item => {
            if (fields.length === 0) {
                // Search all fields
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(searchQuery)
                );
            } else {
                // Search specific fields
                return fields.some(field => 
                    item[field] && String(item[field]).toLowerCase().includes(searchQuery)
                );
            }
        });
    }

    filter(type, filters) {
        const items = this.getAll(type);

        return items.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === '' || value === null || value === undefined) {
                    return true; // Skip empty filters
                }
                return item[key] === value;
            });
        });
    }

    sort(type, field, direction = 'asc') {
        const items = this.getAll(type);

        return items.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Handle dates
            if (field.includes('Date') || field.includes('At')) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            // Handle strings
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    // Statistics and analytics
    getStatistics(type) {
        const items = this.getAll(type);
        const stats = {
            total: items.length,
            created: {
                today: 0,
                thisWeek: 0,
                thisMonth: 0
            }
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        items.forEach(item => {
            const createdDate = new Date(item.createdAt);
            
            if (createdDate >= today) {
                stats.created.today++;
            }
            if (createdDate >= thisWeek) {
                stats.created.thisWeek++;
            }
            if (createdDate >= thisMonth) {
                stats.created.thisMonth++;
            }
        });

        // Type-specific statistics
        if (type === 'jobs') {
            const statusCounts = {};
            const priorityCounts = {};
            
            items.forEach(job => {
                statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
                priorityCounts[job.priority] = (priorityCounts[job.priority] || 0) + 1;
            });

            stats.byStatus = statusCounts;
            stats.byPriority = priorityCounts;
        }

        return stats;
    }

    // Data export/import
    exportData(type, format = 'json') {
        const items = this.getAll(type);
        
        if (format === 'json') {
            return JSON.stringify(items, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(items);
        }
        
        return null;
    }

    importData(type, data, format = 'json') {
        try {
            let items;
            
            if (format === 'json') {
                items = JSON.parse(data);
            } else if (format === 'csv') {
                items = this.convertFromCSV(data);
            } else {
                throw new Error('Unsupported format');
            }

            // Validate imported data
            const validItems = items.filter(item => this.validate(type, item));
            
            if (validItems.length !== items.length) {
                console.warn(`${items.length - validItems.length} invalid items were skipped during import`);
            }

            // Save valid items
            this.saveAll(type, validItems);
            
            return {
                success: true,
                imported: validItems.length,
                skipped: items.length - validItems.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    convertFromCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            return obj;
        }).filter(obj => Object.values(obj).some(value => value !== ''));
    }

    // Backup and restore
    backup() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {}
        };

        Object.keys(this.storageKeys).forEach(type => {
            backup.data[type] = this.getAll(type);
        });

        return JSON.stringify(backup);
    }

    restore(backupData) {
        try {
            const backup = JSON.parse(backupData);
            
            if (!backup.data) {
                throw new Error('Invalid backup format');
            }

            Object.keys(backup.data).forEach(type => {
                if (this.storageKeys[type]) {
                    this.saveAll(type, backup.data[type]);
                }
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Settings management
    getSetting(key) {
        const settings = JSON.parse(localStorage.getItem(this.storageKeys.settings) || '{}');
        return settings[key];
    }

    setSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem(this.storageKeys.settings) || '{}');
        settings[key] = value;
        localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
    }

    getAllSettings() {
        return JSON.parse(localStorage.getItem(this.storageKeys.settings) || '{}');
    }

    // Data relationships
    getJobsForCustomer(customerId) {
        return this.filter('jobs', { customer: customerId });
    }

    getJobsForTechnician(technicianId) {
        return this.filter('jobs', { technician: technicianId });
    }

    getJobsByDateRange(startDate, endDate) {
        const jobs = this.getAll('jobs');
        return jobs.filter(job => {
            const jobDate = new Date(job.scheduledDate);
            return jobDate >= new Date(startDate) && jobDate <= new Date(endDate);
        });
    }

    // Data integrity checks
    validateDataIntegrity() {
        const issues = [];
        const jobs = this.getAll('jobs');
        const customers = this.getAll('customers');
        const technicians = this.getAll('technicians');

        // Check for orphaned jobs (jobs without valid customer/technician)
        jobs.forEach(job => {
            if (job.customer && !customers.find(c => c.id === job.customer)) {
                issues.push(`Job ${job.id} references non-existent customer ${job.customer}`);
            }
            if (job.technician && !technicians.find(t => t.id === job.technician)) {
                issues.push(`Job ${job.id} references non-existent technician ${job.technician}`);
            }
        });

        // Check for duplicate IDs
        const allIds = [
            ...jobs.map(j => j.id),
            ...customers.map(c => c.id),
            ...technicians.map(t => t.id)
        ];
        
        const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
        duplicateIds.forEach(id => {
            issues.push(`Duplicate ID found: ${id}`);
        });

        return issues;
    }

    cleanupOrphanedData() {
        const jobs = this.getAll('jobs');
        const customers = this.getAll('customers');
        const technicians = this.getAll('technicians');

        // Remove jobs with invalid references
        const validJobs = jobs.filter(job => {
            const hasValidCustomer = !job.customer || customers.find(c => c.id === job.customer);
            const hasValidTechnician = !job.technician || technicians.find(t => t.id === job.technician);
            return hasValidCustomer && hasValidTechnician;
        });

        if (validJobs.length !== jobs.length) {
            this.saveAll('jobs', validJobs);
            return jobs.length - validJobs.length;
        }

        return 0;
    }
}

// Create global instance
window.dataManager = new DataManager();
