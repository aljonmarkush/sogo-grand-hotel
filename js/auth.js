import { supabase } from './supabase.js';

// --- AUTHENTICATION HANDLERS ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // 1. Sign In (Runs on login.html)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                alert('Login failed: ' + error.message);
            } else {
                alert('Welcome back!');
                window.location.href = 'index.html'; // Redirect to main page
            }
        });
    }

    // 2. Register (Runs on login.html)
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('regFirstName').value;
            const lastName = document.getElementById('regLastName').value;
            const contact = document.getElementById('regContact').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

            if (authError) {
                alert('Registration failed: ' + authError.message);
                return;
            }

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        contact_number: contact,
                        role: 'guest'
                    }]);

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }

                alert('Registration successful!');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Check user session
    checkUserSession();
});

// Sync Header UI with active Supabase session
async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        updateNavUI(session.user);
    }
}

// Automatically update UI when header component loads dynamically into the DOM
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        updateNavUI(session.user);
    }
});

function updateNavUI(user) {
    const authNav = document.getElementById('authNav');
    if (!authNav) return;

    authNav.innerHTML = `
        <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-dark);">
            ${user.email}
        </span>
        <button class="btn-secondary" onclick="signOut()">Sign Out</button>
    `;
}

window.signOut = async function() {
    await supabase.auth.signOut();
    window.location.reload();
};