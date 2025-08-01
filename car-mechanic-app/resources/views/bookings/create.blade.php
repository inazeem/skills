@extends('layouts.app')

@section('title', 'Book Appointment')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow">
                <div class="card-header bg-primary text-white text-center">
                    <h3 class="mb-0">Book Your Appointment</h3>
                </div>
                <div class="card-body p-4">
                    <form method="POST" action="{{ route('bookings.store') }}" id="bookingForm">
                        @csrf

                        <!-- Service Selection -->
                        <div class="mb-3">
                            <label for="service_id" class="form-label">Select Service *</label>
                            <select id="service_id" name="service_id" class="form-select @error('service_id') is-invalid @enderror" required>
                                <option value="">Choose a service...</option>
                                @foreach($services as $service)
                                    <option value="{{ $service->id }}" data-duration="{{ $service->duration_minutes }}">
                                        {{ $service->name }} - ${{ number_format($service->price, 2) }} ({{ $service->duration_minutes }} min)
                                    </option>
                                @endforeach
                            </select>
                            @error('service_id')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Customer Information -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="customer_name" class="form-label">Full Name *</label>
                                <input type="text" id="customer_name" name="customer_name" class="form-control @error('customer_name') is-invalid @enderror" value="{{ old('customer_name') }}" required>
                                @error('customer_name')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="customer_email" class="form-label">Email Address *</label>
                                <input type="email" id="customer_email" name="customer_email" class="form-control @error('customer_email') is-invalid @enderror" value="{{ old('customer_email') }}" required>
                                @error('customer_email')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="customer_phone" class="form-label">Phone Number *</label>
                                <input type="tel" id="customer_phone" name="customer_phone" class="form-control @error('customer_phone') is-invalid @enderror" value="{{ old('customer_phone') }}" required>
                                @error('customer_phone')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <!-- Vehicle Information -->
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_make" class="form-label">Vehicle Make *</label>
                                <input type="text" id="vehicle_make" name="vehicle_make" class="form-control @error('vehicle_make') is-invalid @enderror" value="{{ old('vehicle_make') }}" required>
                                @error('vehicle_make')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_model" class="form-label">Vehicle Model *</label>
                                <input type="text" id="vehicle_model" name="vehicle_model" class="form-control @error('vehicle_model') is-invalid @enderror" value="{{ old('vehicle_model') }}" required>
                                @error('vehicle_model')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="vehicle_year" class="form-label">Vehicle Year *</label>
                                <input type="text" id="vehicle_year" name="vehicle_year" class="form-control @error('vehicle_year') is-invalid @enderror" value="{{ old('vehicle_year') }}" required>
                                @error('vehicle_year')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="license_plate" class="form-label">License Plate (Optional)</label>
                            <input type="text" id="license_plate" name="license_plate" class="form-control @error('license_plate') is-invalid @enderror" value="{{ old('license_plate') }}">
                            @error('license_plate')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Appointment Date and Time -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="booking_date" class="form-label">Preferred Date *</label>
                                <input type="date" id="booking_date" name="booking_date" class="form-control @error('booking_date') is-invalid @enderror" value="{{ old('booking_date') }}" required min="{{ date('Y-m-d', strtotime('+1 day')) }}">
                                @error('booking_date')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="booking_time" class="form-label">Preferred Time *</label>
                                <select id="booking_time" name="booking_time" class="form-select @error('booking_time') is-invalid @enderror" required>
                                    <option value="">Select a time...</option>
                                </select>
                                @error('booking_time')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <!-- Additional Notes -->
                        <div class="mb-3">
                            <label for="notes" class="form-label">Additional Notes (Optional)</label>
                            <textarea id="notes" name="notes" class="form-control @error('notes') is-invalid @enderror" rows="3" placeholder="Any specific issues or concerns...">{{ old('notes') }}</textarea>
                            @error('notes')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-lg">Book Appointment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('service_id');
    const dateInput = document.getElementById('booking_date');
    const timeSelect = document.getElementById('booking_time');

    // Generate time slots based on business hours
    function generateTimeSlots() {
        const startTime = '{{ $settings["booking_start_time"]->value ?? "08:00" }}';
        const endTime = '{{ $settings["booking_end_time"]->value ?? "17:00" }}';
        const interval = {{ $settings["booking_interval"]->value ?? 30 }};

        timeSelect.innerHTML = '<option value="">Select a time...</option>';
        
        let currentTime = new Date(`2000-01-01 ${startTime}`);
        const endDateTime = new Date(`2000-01-01 ${endTime}`);

        while (currentTime < endDateTime) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
            
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
    }

    // Load available time slots when date or service changes
    function loadAvailableSlots() {
        const serviceId = serviceSelect.value;
        const date = dateInput.value;
        
        if (serviceId && date) {
            fetch(`/book/available-slots?date=${date}&service_id=${serviceId}`)
                .then(response => response.json())
                .then(slots => {
                    timeSelect.innerHTML = '<option value="">Select a time...</option>';
                    slots.forEach(slot => {
                        const option = document.createElement('option');
                        option.value = slot;
                        option.textContent = slot;
                        timeSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error loading time slots:', error);
                    generateTimeSlots(); // Fallback to all slots
                });
        }
    }

    // Event listeners
    serviceSelect.addEventListener('change', loadAvailableSlots);
    dateInput.addEventListener('change', loadAvailableSlots);

    // Initialize time slots
    generateTimeSlots();
});
</script>
@endpush
@endsection