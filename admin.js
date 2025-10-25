const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function loadBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })
    
    if (error) {
        console.error('Error loading bookings:', error)
        return
    }

    displayBookings(data)
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsBody')
    tbody.innerHTML = ''

    bookings.forEach(booking => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${formatDate(booking.booking_date)}</td>
            <td>${booking.slot}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.mobile}</td>
            <td>${booking.status || 'Pending'}</td>
            <td>
                <button onclick="updateStatus('${booking.id}', 'confirmed')" 
                    ${booking.status === 'confirmed' ? 'disabled' : ''}>
                    Confirm
                </button>
                <button onclick="updateStatus('${booking.id}', 'rejected')"
                    ${booking.status === 'rejected' ? 'disabled' : ''}>
                    Reject
                </button>
            </td>
        `
        tbody.appendChild(tr)
    })
}

async function updateStatus(bookingId, status) {
    const { error } = await supabase
        .from('bookings')
        .update({ status: status })
        .eq('id', bookingId)

    if (error) {
        console.error('Error updating booking:', error)
        return
    }

    loadBookings()
}

function filterBookings() {
    const date = document.getElementById('filterDate').value
    const slot = document.getElementById('filterSlot').value
    
    let query = supabase
        .from('bookings')
        .select('*')
    
    if (date) query = query.eq('booking_date', date)
    if (slot) query = query.eq('slot', slot)
    
    query.then(({ data, error }) => {
        if (error) {
            console.error('Error filtering bookings:', error)
            return
        }
        displayBookings(data)
    })
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString()
}

// Load bookings when page loads
document.addEventListener('DOMContentLoaded', loadBookings)