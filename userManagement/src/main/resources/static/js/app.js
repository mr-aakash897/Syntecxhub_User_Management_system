const API_BASE = "/api/users";

// --- 1. Section Navigation ---
function showSection(sectionId) {
    // Switch active section
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId + '-section').classList.add('active');

    // Update nav button highlights
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(sectionId)) {
            btn.classList.add('active');
        }
    });
}

// --- 2. Toast Notifications ---
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.backgroundColor = isError ? "#ef4444" : "#10b981";
    toast.style.color = "white";
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3500);
}

// --- 3. Password Visibility Toggle Function ---
function setupPasswordToggle(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);

    if (input && btn) {
        btn.addEventListener('click', () => {
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            btn.textContent = isPassword ? 'Hide' : 'Show';
        });
    }
}

// Initialize Toggles
setupPasswordToggle('reg-password', 'toggle-password');
setupPasswordToggle('auth-pass', 'toggle-admin-password');

// --- 4. Registration Submission ---
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        fullName: document.getElementById('reg-name').value,
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        roles: [document.getElementById('reg-role').value]
    };

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast("Account successfully created!");
            e.target.reset();
            setTimeout(() => showSection('hero'), 1500);
        } else {
            const err = await response.json();
            showToast(err.error || "Registration failed", true);
        }
    } catch (err) {
        showToast("Network Error: Server is unreachable", true);
    }
});

// --- 5. Admin Panel User Fetch ---
document.getElementById('btn-load-users').addEventListener('click', async () => {
    const adminUser = document.getElementById('auth-user').value;
    const adminPass = document.getElementById('auth-pass').value;
    const grid = document.getElementById('users-grid');
    const badge = document.getElementById('user-count');

    if (!adminUser || !adminPass) {
        showToast("Please provide admin credentials", true);
        return;
    }

    // Prepare Basic Auth Header
    const authHeader = 'Basic ' + btoa(`${adminUser}:${adminPass}`);

    try {
        const response = await fetch(API_BASE, {
            headers: { 'Authorization': authHeader }
        });

        if (response.ok) {
            const users = await response.json();
            badge.innerText = `${users.length} Total`;

            grid.innerHTML = users.map(u => `
                <div class="user-item">
                    <h4>${u.fullName}</h4>
                    <p style="color: #6366f1; font-weight: 600; font-size: 0.8rem;">@${u.username}</p>
                    <p style="font-size: 0.85rem; margin: 5px 0;">${u.email}</p>
                    <span style="font-size: 0.7rem; background: rgba(99,102,241,0.2); color: #818cf8; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
                        ${u.roles[0]}
                    </span>
                </div>
            `).join('');

            showToast("User records synchronized");
        } else {
            showToast("Unauthorized: Invalid credentials", true);
        }
    } catch (err) {
        showToast("Failed to fetch user list", true);
    }
});