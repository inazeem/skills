<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Contact;
use App\Models\Setting;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard()
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::pending()->count(),
            'total_services' => Service::count(),
            'unread_messages' => Contact::unread()->count()
        ];

        $recent_bookings = Booking::with('service')->latest()->take(5)->get();
        $recent_contacts = Contact::latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recent_bookings', 'recent_contacts'));
    }

    /**
     * Display settings management page.
     */
    public function settings()
    {
        $settings = Setting::all()->groupBy('group');
        return view('admin.settings', compact('settings'));
    }

    /**
     * Update settings.
     */
    public function updateSettings(Request $request)
    {
        $settings = $request->except('_token', '_method');

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->route('admin.settings')
            ->with('success', 'Settings updated successfully.');
    }
}
