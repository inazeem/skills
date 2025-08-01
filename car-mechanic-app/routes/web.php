<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');

// Services routes
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service}', [ServiceController::class, 'show'])->name('services.show');

// Booking routes
Route::get('/book', [BookingController::class, 'create'])->name('bookings.create');
Route::post('/book', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/book/success', [BookingController::class, 'success'])->name('bookings.success');
Route::get('/book/available-slots', [BookingController::class, 'getAvailableSlots'])->name('bookings.available-slots');

// Contact routes
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Admin routes (protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::put('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    
    // Admin service management
    Route::resource('services', ServiceController::class);
    
    // Admin booking management
    Route::resource('bookings', BookingController::class);
    
    // Admin contact management
    Route::get('/contacts', function () {
        $contacts = \App\Models\Contact::latest()->paginate(20);
        return view('admin.contacts.index', compact('contacts'));
    })->name('contacts.index');
    
    Route::get('/contacts/{contact}', function (\App\Models\Contact $contact) {
        return view('admin.contacts.show', compact('contact'));
    })->name('contacts.show');
    
    Route::put('/contacts/{contact}', function (Request $request, \App\Models\Contact $contact) {
        $contact->update(['status' => $request->status]);
        return redirect()->route('admin.contacts.index')->with('success', 'Contact status updated.');
    })->name('contacts.update');
});

// Authentication routes (if using Laravel UI)
require __DIR__.'/auth.php';
