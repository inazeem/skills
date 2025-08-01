@extends('layouts.app')

@section('title', 'Settings')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Application Settings</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.settings.update') }}">
        @csrf
        @method('PUT')

        <!-- General Settings -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">General Settings</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="company_name" class="form-label">Company Name</label>
                        <input type="text" id="company_name" name="company_name" class="form-control" 
                               value="{{ $settings['general']['company_name']->value ?? '' }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="company_description" class="form-label">Company Description</label>
                        <textarea id="company_description" name="company_description" class="form-control" rows="3">{{ $settings['general']['company_description']->value ?? '' }}</textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Settings -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Contact Information</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="text" id="phone" name="phone" class="form-control" 
                               value="{{ $settings['contact']['phone']->value ?? '' }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" id="email" name="email" class="form-control" 
                               value="{{ $settings['contact']['email']->value ?? '' }}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="address" class="form-label">Address</label>
                        <input type="text" id="address" name="address" class="form-control" 
                               value="{{ $settings['contact']['address']->value ?? '' }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="business_hours" class="form-label">Business Hours</label>
                        <textarea id="business_hours" name="business_hours" class="form-control" rows="3">{{ $settings['contact']['business_hours']->value ?? '' }}</textarea>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="google_maps_embed" class="form-label">Google Maps Embed Code</label>
                    <textarea id="google_maps_embed" name="google_maps_embed" class="form-control" rows="3" 
                              placeholder="<iframe src='...'></iframe>">{{ $settings['contact']['google_maps_embed']->value ?? '' }}</textarea>
                    <small class="form-text text-muted">Paste the iframe code from Google Maps embed feature</small>
                </div>
            </div>
        </div>

        <!-- Booking Settings -->
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Booking Settings</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="booking_start_time" class="form-label">Start Time</label>
                        <input type="time" id="booking_start_time" name="booking_start_time" class="form-control" 
                               value="{{ $settings['booking']['booking_start_time']->value ?? '08:00' }}">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="booking_end_time" class="form-label">End Time</label>
                        <input type="time" id="booking_end_time" name="booking_end_time" class="form-control" 
                               value="{{ $settings['booking']['booking_end_time']->value ?? '17:00' }}">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="booking_interval" class="form-label">Time Interval (minutes)</label>
                        <input type="number" id="booking_interval" name="booking_interval" class="form-control" 
                               value="{{ $settings['booking']['booking_interval']->value ?? 30 }}" min="15" max="120">
                    </div>
                </div>
            </div>
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-primary btn-lg">Save Settings</button>
        </div>
    </form>
</div>
@endsection