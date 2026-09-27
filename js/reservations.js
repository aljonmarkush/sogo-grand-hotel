import { supabase } from './supabase.js';

/**
 * Queries available rooms for specified dates while filtering existing overlaps
 */
export async function searchAvailableRooms(checkIn, checkOut, guestCount, roomTypeId = null) {
    try {
        // 1. Fetch active reservations that overlap with requested range
        const { data: overlapping, error: overlapError } = await supabase
            .from('reservations')
            .select('room_id')
            .in('reservation_status', ['Pending', 'Confirmed', 'Checked-In'])
            .lt('check_in_date', checkOut)
            .gt('check_out_date', checkIn);

        if (overlapError) throw overlapError;

        const bookedRoomIds = overlapping.map(res => res.room_id);

        // 2. Query rooms filtering out occupied IDs and capacity mismatches
        let query = supabase
            .from('rooms')
            .select(`
                id,
                room_number,
                floor,
                status,
                room_types!inner (
                    id,
                    name,
                    description,
                    capacity,
                    price_per_night,
                    amenities,
                    image_url
                )
            `)
            .eq('status', 'Available')
            .gte('room_types.capacity', guestCount);

        if (bookedRoomIds.length > 0) {
            query = query.not('id', 'in', `(${bookedRoomIds.join(',')})`);
        }

        if (roomTypeId) {
            query = query.eq('room_type_id', roomTypeId);
        }

        const { data: availableRooms, error: roomsError } = await query;
        if (roomsError) throw roomsError;

        return { success: true, data: availableRooms };
    } catch (err) {
        console.error("Error checking availability:", err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Executes double-booking-safe booking via database RPC procedure
 */
export async function executeBooking(roomId, checkIn, checkOut, guestCount, specialRequests = '') {
    try {
        // 1. Get the currently logged-in user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            alert("You must be logged in to make a reservation. Redirecting to login...");
            window.location.href = 'login.html'; // Change 'login.html' if your login file is named differently
            return { success: false, error: "Not authenticated" };
        }

        // 2. Call the RPC procedure passing p_guest_id explicitly
        const { data, error } = await supabase.rpc('create_secure_reservation', {
            p_room_id: roomId,
            p_guest_id: user.id,
            p_check_in: checkIn,
            p_check_out: checkOut,
            p_guests: parseInt(guestCount, 10),
            p_special_requests: specialRequests
        });

        if (error) throw error;
        return { success: true, reservation: data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}