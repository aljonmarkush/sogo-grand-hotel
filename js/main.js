import { searchAvailableRooms, executeBooking } from './reservations.js';

document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) checkInInput.value = today;
    if (checkOutInput) checkOutInput.value = tomorrow;

    // Load initial room data
    loadInitialRooms();

    // Search Form Handler
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const checkIn = document.getElementById('checkIn')?.value || today;
            const checkOut = document.getElementById('checkOut')?.value || tomorrow;
            const guests = document.getElementById('guests')?.value || 1;

            if (!checkOut) {
                alert('Please select a check-out date.');
                return;
            }

            const res = await searchAvailableRooms(checkIn, checkOut, parseInt(guests, 10));
            if (res.success) {
                renderRooms(res.data);
            } else {
                alert('Failed to search rooms: ' + res.error);
            }
        });
    }
});

async function loadInitialRooms() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const res = await searchAvailableRooms(today, tomorrow, 1);
    if (res.success) {
        renderRooms(res.data);
    }
}

function renderRooms(rooms) {
    const grid = document.getElementById('roomGrid');
    if (!grid) return;

    if (!rooms || rooms.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No available rooms found for the selected criteria.</p>`;
        return;
    }

    grid.innerHTML = rooms.map(room => {
        const roomType = room.room_types || {};
        return `
            <div class="room-card">
                <img src="${roomType.image_url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'}" alt="${roomType.name}">
                <div class="room-card-body">
                    <div>
                        <h3>${roomType.name || 'Standard Room'} — Room ${room.room_number}</h3>
                        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.75rem;">
                            ${roomType.description || 'Comfortable stay with modern amenities.'}
                        </p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 0.75rem;">
                        <div>
                            <span style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">$${roomType.price_per_night || 0}</span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">/ night</span>
                        </div>
                        <button onclick="handleBookClick('${room.id}')">Book Now</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.handleBookClick = async function(roomId) {
    const checkIn = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const guests = document.getElementById('guests')?.value || 1;

    if (!checkIn || !checkOut) {
        alert('Please select Check-In and Check-Out dates first.');
        return;
    }

    const result = await executeBooking(roomId, checkIn, checkOut, guests);
    if (result.success) {
        alert(`Booking Confirmed!\nReservation Code: ${result.reservation.reservation_code}`);
        window.location.reload();
    } else {
        alert('Booking Error: ' + result.error);
    }
};