import SUPABASE_CONFIG from './config.js';

const supabase = supabase.createClient(
    SUPABASE_CONFIG.SUPABASE_URL,
    SUPABASE_CONFIG.SUPABASE_ANON_KEY
);

// Check if admin is logged in
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'index.html#admin-login';
}

// Load bookings
async function loadBookings(date = null) {
    let query = supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false });

    if (date) {
        query = query.eq('booking_date', date);
    }

    const { data, error } = await query;
    
    if (error) {
        console.error('Error:', error);
        return;
    }

    displayBookings(data);
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.booking_date}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.mobile}</td>
            <td>${booking.slot}</td>
            <td>${booking.status}</td>
            <td>
                <button onclick="updateStatus('${booking.id}', 'confirmed')">Confirm</button>
                <button onclick="updateStatus('${booking.id}', 'rejected')">Reject</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filter bookings by date
window.filterBookings = function() {
    const date = document.getElementById('filterDate').value;
    loadBookings(date);
};

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
});

// Load bookings on page load
loadBookings();