// Assignment Manager Web App - Simplified Version
class AssignmentManager {
    constructor() {
        this.assignments = [];
        this.currentTab = 'dashboard';
        this.currentDate = new Date();
        this.editingAssignment = null;
    }

    init() {
        this.loadAssignments();
        this.loadSettings();
        
        // Add sample data if no assignments exist
        if (this.assignments.length === 0) {
            this.addSampleAssignments();
        }
        
        this.setupEventListeners();
        this.setupCustomThemeControls();
        this.renderCurrentView();
    }

    // Data Management
    loadAssignments() {
        const stored = localStorage.getItem('assignments');
        if (stored) {
            try {
                this.assignments = JSON.parse(stored).map(a => ({
                    ...a,
                    dueDate: new Date(a.dueDate),
                    createdAt: new Date(a.createdAt || Date.now()),
                    updatedAt: new Date(a.updatedAt || Date.now())
                }));
            } catch (e) {
                console.error('Error loading assignments:', e);
                this.assignments = [];
            }
        }
    }

    saveAssignments() {
        localStorage.setItem('assignments', JSON.stringify(this.assignments));
        this.renderCurrentView();
    }

    // Assignment CRUD
    addAssignment(data) {
        const assignment = {
            id: Date.now().toString(),
            title: data.title,
            courseName: data.course,
            description: data.description || '',
            dueDate: new Date(`${data.date}T${data.time}`),
            source: 'manual',
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.assignments.push(assignment);
        this.saveAssignments();
        this.closeModal();
        this.showNotification('success', 'Assignment Created', `"${assignment.title}" has been added.`);
        
        // Add some sample data if this is the first assignment
        if (this.assignments.length === 1) {
            this.addSampleAssignments();
        }
    }

    addSampleAssignments() {
        const sampleAssignments = [
            {
                id: 'sample-1',
                title: 'Math Homework Chapter 5',
                courseName: 'Algebra II',
                description: 'Complete problems 1-20 on page 85',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                source: 'manual',
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'sample-2',
                title: 'History Essay',
                courseName: 'World History',
                description: 'Write a 500-word essay on the Industrial Revolution',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                source: 'canvas',
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'sample-3',
                title: 'Science Lab Report',
                courseName: 'Chemistry',
                description: 'Complete lab report for experiment 3',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                source: 'classroom',
                isCompleted: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        this.assignments.push(...sampleAssignments);
        this.saveAssignments();
    }

    updateAssignment(id, data) {
        const index = this.assignments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.assignments[index] = {
                ...this.assignments[index],
                title: data.title,
                courseName: data.course,
                description: data.description || '',
                dueDate: new Date(`${data.date}T${data.time}`),
                updatedAt: new Date()
            };
            this.saveAssignments();
            this.closeModal();
            this.showNotification('success', 'Assignment Updated', `"${data.title}" has been updated.`);
        }
    }

    deleteAssignment(id) {
        this.assignments = this.assignments.filter(a => a.id !== id);
        this.saveAssignments();
        this.showNotification('info', 'Assignment Deleted', 'Assignment has been removed.');
    }

    toggleAssignmentComplete(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.isCompleted = !assignment.isCompleted;
            assignment.updatedAt = new Date();
            this.saveAssignments();
        }
    }

    // Rendering
    renderCurrentView() {
        if (this.currentTab === 'dashboard') {
            this.renderDashboard();
        } else if (this.currentTab === 'assignments') {
            this.renderAllAssignments();
        } else if (this.currentTab === 'calendar') {
            this.renderCalendar();
        }
    }

    renderDashboard() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;

        const now = new Date();
        const overdue = this.assignments.filter(a => !a.isCompleted && a.dueDate < now);
        const upcoming = this.assignments.filter(a => !a.isCompleted && a.dueDate >= now)
            .sort((a, b) => a.dueDate - b.dueDate)
            .slice(0, 5);

        container.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Assignments</h3>
                    <div class="stat-number">${this.assignments.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Overdue</h3>
                    <div class="stat-number error">${overdue.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Completed</h3>
                    <div class="stat-number success">${this.assignments.filter(a => a.isCompleted).length}</div>
                </div>
            </div>
            
            ${overdue.length > 0 ? `
                <div class="assignment-section">
                    <h2>Overdue Assignments</h2>
                    <div class="assignment-list">
                        ${overdue.map(a => this.renderAssignmentCard(a)).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="assignment-section">
                <h2>Upcoming Assignments</h2>
                <div class="assignment-list">
                    ${upcoming.length > 0 ? upcoming.map(a => this.renderAssignmentCard(a)).join('') : '<p>No upcoming assignments</p>'}
                </div>
            </div>
        `;
    }

    renderAllAssignments() {
        const container = document.getElementById('assignments-content');
        if (!container) return;

        const incomplete = this.assignments.filter(a => !a.isCompleted)
            .sort((a, b) => a.dueDate - b.dueDate);
        const completed = this.assignments.filter(a => a.isCompleted)
            .sort((a, b) => b.updatedAt - a.updatedAt);

        container.innerHTML = `
            <div class="assignments-header">
                <button id="add-assignment" class="btn-primary">
                    <i class="fas fa-plus"></i> Add Assignment
                </button>
            </div>
            
            <div class="assignment-section">
                <h2>Pending (${incomplete.length})</h2>
                <div class="assignment-list">
                    ${incomplete.length > 0 ? incomplete.map(a => this.renderAssignmentCard(a)).join('') : '<p>No pending assignments</p>'}
                </div>
            </div>
            
            <div class="assignment-section">
                <h2>Completed (${completed.length})</h2>
                <div class="assignment-list">
                    ${completed.length > 0 ? completed.map(a => this.renderAssignmentCard(a)).join('') : '<p>No completed assignments</p>'}
                </div>
            </div>
        `;

        // Re-attach event listener for add button
        const addBtn = document.getElementById('add-assignment');
        if (addBtn) {
            this.addTouchSupport(addBtn, () => this.openModal());
        }
    }

    renderAssignmentCard(assignment) {
        const isOverdue = !assignment.isCompleted && assignment.dueDate < new Date();
        const formattedDate = this.formatDueDate(assignment.dueDate);
        const sourceIcon = this.getSourceIcon(assignment.source);
        
        return `
            <div class="assignment-card ${assignment.source} ${assignment.isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                <div class="assignment-content">
                    <div class="assignment-header">
                        <h3>${assignment.title}</h3>
                        <span class="source-badge ${assignment.source}">
                            <i class="${sourceIcon}"></i>
                            ${assignment.source.charAt(0).toUpperCase() + assignment.source.slice(1)}
                        </span>
                    </div>
                    <p class="assignment-course">${assignment.courseName}</p>
                    ${assignment.description ? `<p class="assignment-description">${assignment.description}</p>` : ''}
                    <p class="assignment-due">${formattedDate}</p>
                </div>
                <div class="assignment-icons">
                    <div class="assignment-info-icons">
                        <i class="fas fa-clipboard-list" title="Assignment"></i>
                        <i class="fas fa-graduation-cap" title="Course"></i>
                        ${assignment.description ? `<i class="fas fa-info-circle" title="Description"></i>` : ''}
                        <i class="fas fa-clock" title="Due Date"></i>
                    </div>
                    <div class="assignment-actions">
                        <button class="btn-icon edit-btn" onclick="app.editAssignment('${assignment.id}')" title="Edit Assignment">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon complete-btn" onclick="app.toggleAssignmentComplete('${assignment.id}')" title="Toggle Complete">
                            <i class="fas ${assignment.isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn-icon delete-btn" onclick="app.deleteAssignment('${assignment.id}')" title="Delete Assignment">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getSourceIcon(source) {
        switch(source) {
            case 'canvas':
                return 'fas fa-paint-brush';
            case 'classroom':
                return 'fab fa-google';
            case 'manual':
                return 'fas fa-user-edit';
            default:
                return 'fas fa-file-alt';
        }
    }

    editAssignment(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (!assignment) return;
        
        this.editingAssignment = assignment;
        this.openModal();
        
        // Pre-fill the form with existing data
        document.getElementById('assignment-title').value = assignment.title;
        document.getElementById('assignment-course').value = assignment.courseName;
        document.getElementById('assignment-description').value = assignment.description || '';
        
        const dueDate = new Date(assignment.dueDate);
        document.getElementById('assignment-date').value = dueDate.toISOString().split('T')[0];
        document.getElementById('assignment-time').value = dueDate.toTimeString().slice(0, 5);
        
        // Update modal title and button text
        document.querySelector('#assignment-modal h2').textContent = 'Edit Assignment';
        document.querySelector('#assignment-form button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Assignment';
    }

    renderCalendar() {
        const container = document.getElementById('calendar-content');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        container.innerHTML = `
            <div class="calendar-header">
                <button id="prev-month" class="btn-icon"><i class="fas fa-chevron-left"></i></button>
                <h2>${monthNames[month]} ${year}</h2>
                <button id="next-month" class="btn-icon"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                ${this.generateCalendarDays()}
            </div>
        `;

        // Re-attach calendar navigation
        this.addTouchSupport(document.getElementById('prev-month'), () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        this.addTouchSupport(document.getElementById('next-month'), () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    generateCalendarDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            const dayAssignments = this.assignments.filter(a => {
                const assignmentDate = new Date(a.dueDate);
                return assignmentDate.toDateString() === current.toDateString();
            });

            const isToday = current.toDateString() === new Date().toDateString();
            const isCurrentMonth = current.getMonth() === month;

            days.push(`
                <div class="calendar-day ${isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}">
                    <div class="day-number">${current.getDate()}</div>
                    ${dayAssignments.map(a => `
                        <div class="calendar-assignment ${a.isCompleted ? 'completed' : ''}">${a.title}</div>
                    `).join('')}
                </div>
            `);
            
            current.setDate(current.getDate() + 1);
        }
        
        return days.join('');
    }

    formatDueDate(date) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
            return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (diffDays === 1) {
            return `Tomorrow at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (diffDays <= 7) {
            return `${date.toLocaleDateString([], {weekday: 'long'})} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
            return date.toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            this.addTouchSupport(tab, () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Add assignment buttons
        const addBtnDashboard = document.getElementById('add-assignment-dashboard');
        const addBtnAssignments = document.getElementById('add-assignment');
        
        if (addBtnDashboard) {
            this.addTouchSupport(addBtnDashboard, () => this.openModal());
        }
        if (addBtnAssignments) {
            this.addTouchSupport(addBtnAssignments, () => this.openModal());
        }

        // Modal events
        const closeModal = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-assignment');
        const modal = document.getElementById('assignment-modal');
        
        if (closeModal) this.addTouchSupport(closeModal, () => this.closeModal());
        if (cancelBtn) this.addTouchSupport(cancelBtn, () => this.closeModal());
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'assignment-modal') {
                    this.closeModal();
                }
            });
        }

        // Form submission
        const form = document.getElementById('assignment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAssignmentSubmit();
            });
        }

        // Theme controls
        this.setupThemeControls();
        this.setupSwipeGestures();
    }

    setupThemeControls() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        // Color palette
        document.querySelectorAll('.color-option').forEach(option => {
            this.addTouchSupport(option, () => {
                this.applyTheme(option.dataset.theme);
            });
        });
    }

    addTouchSupport(element, callback) {
        if (!element) return;
        
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        
        element.addEventListener('click', callback);
        
        element.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndTime = Date.now();
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = Math.sqrt(
                Math.pow(touchEndX - touchStartX, 2) + 
                Math.pow(touchEndY - touchStartY, 2)
            );
            
            element.classList.remove('touch-active');
            
            if (touchDuration < 500 && touchDistance < 20) {
                callback();
            }
        });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touch-active');
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isScrolling = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            const diffX = startX - touch.clientX;
            const diffY = startY - touch.clientY;
            
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY || isScrolling) return;
            
            const touch = e.changedTouches[0];
            const diffX = startX - touch.clientX;
            
            if (Math.abs(diffX) < 50) return;
            
            const tabs = ['dashboard', 'assignments', 'calendar', 'settings'];
            const currentIndex = tabs.indexOf(this.currentTab);
            
            if (diffX > 0 && currentIndex < tabs.length - 1) {
                this.switchTab(tabs[currentIndex + 1]);
            } else if (diffX < 0 && currentIndex > 0) {
                this.switchTab(tabs[currentIndex - 1]);
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;
        this.renderCurrentView();
    }

    // Modal Management
    openModal() {
        const modal = document.getElementById('assignment-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
        
        // Reset modal to default state if not editing
        if (!this.editingAssignment) {
            document.querySelector('#assignment-modal h2').textContent = 'Add New Assignment';
            document.querySelector('#assignment-form button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add Assignment';
        }
    }

    closeModal() {
        const modal = document.getElementById('assignment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.editingAssignment = null;
        document.getElementById('assignment-form').reset();
        
        // Reset modal to default state
        document.querySelector('#assignment-modal h2').textContent = 'Add New Assignment';
        document.querySelector('#assignment-form button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add Assignment';
    }

    addTouchSupport(element, callback) {
        if (!element) return;
        
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        
        element.addEventListener('click', callback);
        
        element.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndTime = Date.now();
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;
            
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = Math.sqrt(
                Math.pow(touchEndX - touchStartX, 2) + 
                Math.pow(touchEndY - touchStartY, 2)
            );
            
            element.classList.remove('touch-active');
            
            if (touchDuration < 500 && touchDistance < 20) {
                callback();
            }
        });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touch-active');
        });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isScrolling = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            const diffX = startX - touch.clientX;
            const diffY = startY - touch.clientY;
            
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY || isScrolling) return;
            
            const touch = e.changedTouches[0];
            const diffX = startX - touch.clientX;
            
            if (Math.abs(diffX) < 50) return;
            
            const tabs = ['dashboard', 'assignments', 'calendar', 'settings'];
            const currentIndex = tabs.indexOf(this.currentTab);
            
            if (diffX > 0 && currentIndex < tabs.length - 1) {
                this.switchTab(tabs[currentIndex + 1]);
            } else if (diffX < 0 && currentIndex > 0) {
                this.switchTab(tabs[currentIndex - 1]);
            }
            
            startX = 0;
            startY = 0;
        });
    }

    handleAssignmentSubmit() {
        const formData = {
            title: document.getElementById('assignment-title').value,
            course: document.getElementById('assignment-course').value,
            description: document.getElementById('assignment-description').value,
            date: document.getElementById('assignment-date').value,
            time: document.getElementById('assignment-time').value
        };

        if (this.editingAssignment) {
            this.updateAssignment(this.editingAssignment.id, formData);
        } else {
            this.addAssignment(formData);
        }
    }

    // Theme Management
    toggleDarkMode(enabled) {
        document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
        localStorage.setItem('darkMode', enabled);
        this.isDarkMode = enabled;
    }

    applyTheme(themeName) {
        const themes = {
            purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            teal: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            dark: 'linear-gradient(135deg, #2D1B69 0%, #11998e 100%)',
            sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        };

        if (themes[themeName]) {
            document.documentElement.style.setProperty('--bg-gradient', themes[themeName]);
            document.body.style.background = themes[themeName];
            localStorage.setItem('selectedTheme', themeName);
            this.showNotification('success', 'Theme Applied', `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme activated!`);
        }
    }

    // Custom Theme Controls
    setupCustomThemeControls() {
        // Gradient controls
        const gradientColor1 = document.getElementById('gradient-color1');
        const gradientColor2 = document.getElementById('gradient-color2');
        const gradientAngle = document.getElementById('gradient-angle');
        const gradientAngleValue = document.getElementById('gradient-angle-value');
        const gradientPreview = document.getElementById('gradient-preview');
        const applyGradientBtn = document.getElementById('apply-custom-gradient');

        // Solid color controls
        const solidColor = document.getElementById('solid-color');
        const solidPreview = document.getElementById('solid-preview');
        const applySolidBtn = document.getElementById('apply-solid-color');

        // Image controls
        const backgroundImage = document.getElementById('background-image');
        const imageOpacity = document.getElementById('image-opacity');
        const imageOpacityValue = document.getElementById('image-opacity-value');
        const imagePreview = document.getElementById('image-preview');
        const removeImageBtn = document.getElementById('remove-background-image');

        if (!gradientColor1) return; // Exit if elements don't exist

        // Update gradient preview
        const updateGradientPreview = () => {
            const color1 = gradientColor1.value;
            const color2 = gradientColor2.value;
            const angle = gradientAngle.value;
            const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
            gradientPreview.style.background = gradient;
            gradientAngleValue.textContent = `${angle}°`;
        };

        // Update solid preview
        const updateSolidPreview = () => {
            solidPreview.style.background = solidColor.value;
        };

        // Update image opacity display
        const updateImageOpacity = () => {
            imageOpacityValue.textContent = `${imageOpacity.value}%`;
        };

        // Event listeners
        gradientColor1.addEventListener('input', updateGradientPreview);
        gradientColor2.addEventListener('input', updateGradientPreview);
        gradientAngle.addEventListener('input', updateGradientPreview);
        solidColor.addEventListener('input', updateSolidPreview);
        imageOpacity.addEventListener('input', updateImageOpacity);

        // Apply custom gradient
        if (applyGradientBtn) {
            this.addTouchSupport(applyGradientBtn, () => {
                const color1 = gradientColor1.value;
                const color2 = gradientColor2.value;
                const angle = gradientAngle.value;
                const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
                
                document.documentElement.style.setProperty('--bg-gradient', gradient);
                document.body.style.background = gradient;
                
                // Save custom theme
                const customTheme = { type: 'gradient', color1, color2, angle };
                localStorage.setItem('customTheme', JSON.stringify(customTheme));
                
                this.showNotification('success', 'Custom Gradient Applied', 'Your custom gradient is now active!');
            });
        }

        // Apply solid color
        if (applySolidBtn) {
            this.addTouchSupport(applySolidBtn, () => {
                const color = solidColor.value;
                
                document.documentElement.style.setProperty('--bg-gradient', color);
                document.body.style.background = color;
                
                // Save custom theme
                const customTheme = { type: 'solid', color };
                localStorage.setItem('customTheme', JSON.stringify(customTheme));
                
                this.showNotification('success', 'Solid Color Applied', 'Your solid color background is now active!');
            });
        }

        // Handle image upload
        if (backgroundImage) {
            backgroundImage.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageUrl = event.target.result;
                        imagePreview.style.backgroundImage = `url(${imageUrl})`;
                        imagePreview.classList.remove('empty');
                        
                        // Apply image background
                        const opacity = imageOpacity.value / 100;
                        const overlay = `linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity}))`;
                        document.body.style.background = `${overlay}, url(${imageUrl})`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundAttachment = 'fixed';
                        
                        // Save custom theme
                        const customTheme = { type: 'image', imageUrl, opacity };
                        localStorage.setItem('customTheme', JSON.stringify(customTheme));
                        
                        this.showNotification('success', 'Background Image Applied', 'Your custom background is now active!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Update image opacity
        if (imageOpacity) {
            imageOpacity.addEventListener('input', () => {
                const opacity = imageOpacity.value / 100;
                const savedTheme = localStorage.getItem('customTheme');
                if (savedTheme) {
                    const theme = JSON.parse(savedTheme);
                    if (theme.type === 'image' && theme.imageUrl) {
                        const overlay = `linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity}))`;
                        document.body.style.background = `${overlay}, url(${theme.imageUrl})`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundAttachment = 'fixed';
                        
                        // Update saved theme
                        theme.opacity = opacity;
                        localStorage.setItem('customTheme', JSON.stringify(theme));
                    }
                }
                updateImageOpacity();
            });
        }

        // Remove background image
        if (removeImageBtn) {
            this.addTouchSupport(removeImageBtn, () => {
                document.body.style.background = 'var(--bg-gradient)';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundAttachment = '';
                if (imagePreview) {
                    imagePreview.style.backgroundImage = '';
                    imagePreview.classList.add('empty');
                }
                if (backgroundImage) backgroundImage.value = '';
                
                localStorage.removeItem('customTheme');
                this.showNotification('info', 'Background Removed', 'Custom background has been removed.');
            });
        }

        // Initialize previews
        updateGradientPreview();
        updateSolidPreview();
        updateImageOpacity();
        
        // Load saved custom theme
        this.loadCustomTheme();
    }

    loadCustomTheme() {
        const saved = localStorage.getItem('customTheme');
        if (saved) {
            try {
                const theme = JSON.parse(saved);
                
                if (theme.type === 'gradient') {
                    const gradient = `linear-gradient(${theme.angle}deg, ${theme.color1} 0%, ${theme.color2} 100%)`;
                    document.documentElement.style.setProperty('--bg-gradient', gradient);
                    document.body.style.background = gradient;
                    
                    // Update controls
                    const gradientColor1 = document.getElementById('gradient-color1');
                    const gradientColor2 = document.getElementById('gradient-color2');
                    const gradientAngle = document.getElementById('gradient-angle');
                    const gradientAngleValue = document.getElementById('gradient-angle-value');
                    const gradientPreview = document.getElementById('gradient-preview');
                    
                    if (gradientColor1) gradientColor1.value = theme.color1;
                    if (gradientColor2) gradientColor2.value = theme.color2;
                    if (gradientAngle) gradientAngle.value = theme.angle;
                    if (gradientAngleValue) gradientAngleValue.textContent = `${theme.angle}°`;
                    if (gradientPreview) gradientPreview.style.background = gradient;
                    
                } else if (theme.type === 'solid') {
                    document.documentElement.style.setProperty('--bg-gradient', theme.color);
                    document.body.style.background = theme.color;
                    
                    // Update controls
                    const solidColor = document.getElementById('solid-color');
                    const solidPreview = document.getElementById('solid-preview');
                    
                    if (solidColor) solidColor.value = theme.color;
                    if (solidPreview) solidPreview.style.background = theme.color;
                    
                } else if (theme.type === 'image') {
                    const overlay = `linear-gradient(rgba(0,0,0,${theme.opacity}), rgba(0,0,0,${theme.opacity}))`;
                    document.body.style.background = `${overlay}, url(${theme.imageUrl})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundAttachment = 'fixed';
                    
                    // Update controls
                    const imageOpacity = document.getElementById('image-opacity');
                    const imageOpacityValue = document.getElementById('image-opacity-value');
                    const imagePreview = document.getElementById('image-preview');
                    
                    if (imageOpacity) imageOpacity.value = theme.opacity * 100;
                    if (imageOpacityValue) imageOpacityValue.textContent = `${theme.opacity * 100}%`;
                    if (imagePreview) {
                        imagePreview.style.backgroundImage = `url(${theme.imageUrl})`;
                        imagePreview.classList.remove('empty');
                    }
                }
            } catch (e) {
                console.error('Error loading custom theme:', e);
            }
        }
    }

    loadSettings() {
        // Load dark mode
        const darkMode = localStorage.getItem('darkMode') === 'true';
        this.isDarkMode = darkMode;
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.checked = darkMode;
        }
        
        // Load selected theme
        const selectedTheme = localStorage.getItem('selectedTheme');
        if (selectedTheme) {
            this.applyTheme(selectedTheme);
        }
        
        // Load custom theme
        this.loadCustomTheme();
    }

    // Notifications
    showNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-message">${message}</div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);

        const autoHide = setTimeout(() => this.hideNotification(notification), 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize the app
const app = new AssignmentManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});
