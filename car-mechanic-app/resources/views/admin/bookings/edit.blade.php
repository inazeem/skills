@extends('layouts.app')

@section('title', 'Edit Booking')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Booking</h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to Bookings
        </a>
    </div>

    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Booking Information</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('admin.bookings.update', $booking) }}">
                        @csrf
                        @method('PUT')

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="customer_name" class="form-label">Customer Name *</label>
                                <input type="text" id="customer_name" name="customer_name" class="form-control @error('customer_name') is-invalid @enderror" value="{{ old('customer_name', $booking->customer_name) }}" required>
                                @error('customer_name')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="customer_email" class="form-label">Email Address *</label>
                                <input type="email" id="customer_email" name="customer_email" class="form-control @error('customer_email') is-invalid @enderror" value="{{ old('customer_email', $booking->customer_email) }}" required>
                                @error('customer_email')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="customer_phone" class="form-label">Phone Number *</label>
                            <input type="tel" id="customer_phone" name="customer_phone" class="form-control @error('customer_phone') is-invalid @enderror" value="{{ old('customer_phone', $booking->customer_phone) }}" required>
                            @error('customer_phone')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_make" class="form-label">Vehicle Make *</label>
                                <input type="text" id="vehicle_make" name="vehicle_make" class="form-control @error('vehicle_make') is-invalid @enderror" value="{{ old('vehicle_make', $booking->vehicle_make) }}" required>
                                @error('vehicle_make')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_model" class="form-label">Vehicle Model *</label>
                                <input type="text" id="vehicle_model" name="vehicle_model" class="form-control @error('vehicle_model') is-invalid @enderror" value="{{ old('vehicle_model', $booking->vehicle_model) }}" required>
                                @error('vehicle_model')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_year" class="form-label">Vehicle Year *</label>
                                <input type="text" id="vehicle_year" name="vehicle_year" class="form-control @error('vehicle_year') is-invalid @enderror" value="{{ old('vehicle_year', $booking->vehicle_year) }}" required>
                                @error('vehicle_year')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="license_plate" class="form-label">License Plate</label>
                            <input type="text" id="license_plate" name="license_plate" class="form-control @error('license_plate') is-invalid @enderror" value="{{ old('license_plate', $booking->license_plate) }}">
                            @error('license_plate')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="service_id" class="form-label">Service *</label>
                                <select id="service_id" name="service_id" class="form-select @error('service_id') is-invalid @enderror" required>
                                    @foreach($services as $service)
                                        <option value="{{ $service->id }}" {{ old('service_id', $booking->service_id) == $service->id ? 'selected' : '' }}>
                                            {{ $service->name }} - ${{ number_format($service->price, 2) }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('service_id')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="status" class="form-label">Status *</label>
                                <select id="status" name="status" class="form-select @error('status') is-invalid @enderror" required>
                                    <option value="pending" {{ old('status', $booking->status) == 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="confirmed" {{ old('status', $booking->status) == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                                    <option value="completed" {{ old('status', $booking->status) == 'completed' ? 'selected' : '' }}>Completed</option>
                                    <option value="cancelled" {{ old('status', $booking->status) == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                </select>
                                @error('status')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="booking_date" class="form-label">Booking Date *</label>
                                <input type="date" id="booking_date" name="booking_date" class="form-control @error('booking_date') is-invalid @enderror" value="{{ old('booking_date', $booking->booking_date->format('Y-m-d')) }}" required>
                                @error('booking_date')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="booking_time" class="form-label">Booking Time *</label>
                                <input type="time" id="booking_time" name="booking_time" class="form-control @error('booking_time') is-invalid @enderror" value="{{ old('booking_time', $booking->booking_time) }}" required>
                                @error('booking_time')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea id="notes" name="notes" class="form-control @error('notes') is-invalid @enderror" rows="3">{{ old('notes', $booking->notes) }}</textarea>
                            @error('notes')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <a href="{{ route('admin.bookings.index') }}" class="btn btn-secondary">Cancel</a>
                            <button type="submit" class="btn btn-primary">Update Booking</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection