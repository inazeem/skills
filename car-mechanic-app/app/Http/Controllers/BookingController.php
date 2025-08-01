<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Setting;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::with('service')->latest()->get();
        return view('bookings.index', compact('bookings'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $services = Service::active()->ordered()->get();
        $settings = Setting::all()->keyBy('key');
        
        return view('bookings.create', compact('services', 'settings'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'vehicle_make' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'vehicle_year' => 'required|string|max:4',
            'license_plate' => 'nullable|string|max:20',
            'booking_date' => 'required|date|after:today',
            'booking_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string'
        ]);

        // Check for booking conflicts
        $service = Service::find($validated['service_id']);
        $bookingDate = $validated['booking_date'];
        $bookingTime = $validated['booking_time'];
        $duration = $service->duration_minutes;

        $conflict = Booking::where('booking_date', $bookingDate)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($bookingTime, $duration) {
                $query->whereBetween('booking_time', [
                    $bookingTime,
                    Carbon::parse($bookingTime)->addMinutes($duration)->format('H:i')
                ])
                ->orWhereBetween(
                    Carbon::parse('booking_time')->addMinutes('duration_minutes')->format('H:i'),
                    [$bookingTime, Carbon::parse($bookingTime)->addMinutes($duration)->format('H:i')]
                );
            })
            ->exists();

        if ($conflict) {
            return back()->withErrors(['booking_time' => 'This time slot is not available. Please select a different time.']);
        }

        Booking::create($validated);

        return redirect()->route('bookings.success')
            ->with('success', 'Booking created successfully! We will contact you to confirm.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return view('bookings.show', compact('booking'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        $services = Service::active()->ordered()->get();
        return view('bookings.edit', compact('booking', 'services'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'vehicle_make' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'vehicle_year' => 'required|string|max:4',
            'license_plate' => 'nullable|string|max:20',
            'booking_date' => 'required|date',
            'booking_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,confirmed,completed,cancelled'
        ]);

        $booking->update($validated);

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }

    /**
     * Get available time slots for a given date and service.
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after:today',
            'service_id' => 'required|exists:services,id'
        ]);

        $date = $request->date;
        $service = Service::find($request->service_id);
        $settings = Setting::all()->keyBy('key');

        $startTime = $settings['booking_start_time']->value ?? '08:00';
        $endTime = $settings['booking_end_time']->value ?? '17:00';
        $interval = (int)($settings['booking_interval']->value ?? 30);

        $availableSlots = [];
        $currentTime = Carbon::parse($startTime);
        $endDateTime = Carbon::parse($endTime);

        while ($currentTime->lt($endDateTime)) {
            $slotTime = $currentTime->format('H:i');
            
            // Check if this slot conflicts with existing bookings
            $conflict = Booking::where('booking_date', $date)
                ->where('status', '!=', 'cancelled')
                ->where(function($query) use ($slotTime, $service) {
                    $query->whereBetween('booking_time', [
                        $slotTime,
                        Carbon::parse($slotTime)->addMinutes($service->duration_minutes)->format('H:i')
                    ])
                    ->orWhereBetween(
                        Carbon::parse('booking_time')->addMinutes('duration_minutes')->format('H:i'),
                        [$slotTime, Carbon::parse($slotTime)->addMinutes($service->duration_minutes)->format('H:i')]
                    );
                })
                ->exists();

            if (!$conflict) {
                $availableSlots[] = $slotTime;
            }

            $currentTime->addMinutes($interval);
        }

        return response()->json($availableSlots);
    }

    /**
     * Show booking success page.
     */
    public function success()
    {
        return view('bookings.success');
    }
}
