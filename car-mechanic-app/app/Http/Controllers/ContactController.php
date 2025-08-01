<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Setting;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index()
    {
        $settings = Setting::all()->keyBy('key');
        return view('contact.index', compact('settings'));
    }

    /**
     * Store a new contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000'
        ]);

        Contact::create($validated);

        return redirect()->route('contact.index')
            ->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
