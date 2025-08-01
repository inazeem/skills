@extends('layouts.app')

@section('title', 'Booking Details')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Booking Details</h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to Bookings
        </a>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Booking #{{ $booking->id }}</h5>
                    <span class="badge bg-{{ 
                        $booking->status === 'pending' ? 'warning' : 
                        ($booking->status === 'confirmed' ? 'success' : 
                        ($booking->status === 'completed' ? 'info' : 'secondary')) 
                    }}">
                        {{ ucfirst($booking->status) }}
                    </span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Customer Information</h6>
                            <p><strong>Name:</strong> {{ $booking->customer_name }}</p>
                            <p><strong>Email:</strong> <a href="mailto:{{ $booking->customer_email }}">{{ $booking->customer_email }}</a></p>
                            <p><strong>Phone:</strong> <a href="tel:{{ $booking->customer_phone }}">{{ $booking->customer_phone }}</a></p>
                        </div>
                        <div class="col-md-6">
                            <h6>Vehicle Information</h6>
                            <p><strong>Vehicle:</strong> {{ $booking->vehicle_year }} {{ $booking->vehicle_make }} {{ $booking->vehicle_model }}</p>
                            @if($booking->license_plate)
                                <p><strong>License Plate:</strong> {{ $booking->license_plate }}</p>
                            @endif
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Service Information</h6>
                            <p><strong>Service:</strong> {{ $booking->service->name }}</p>
                            <p><strong>Price:</strong> ${{ number_format($booking->service->price, 2) }}</p>
                            <p><strong>Duration:</strong> {{ $booking->service->duration_minutes }} minutes</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Appointment Details</h6>
                            <p><strong>Date:</strong> {{ $booking->booking_date->format('F d, Y') }}</p>
                            <p><strong>Time:</strong> {{ $booking->booking_time }}</p>
                            <p><strong>Booked:</strong> {{ $booking->created_at->format('F d, Y \a\t g:i A') }}</p>
                        </div>
                    </div>
                    
                    @if($booking->notes)
                    <hr>
                    <div>
                        <h6>Notes</h6>
                        <div class="border rounded p-3 bg-light">
                            {{ $booking->notes }}
                        </div>
                    </div>
                    @endif
                    
                    <div class="mt-4">
                        <a href="{{ route('admin.bookings.edit', $booking) }}" class="btn btn-primary">
                            <i class="fas fa-edit me-2"></i>Edit Booking
                        </a>
                        <a href="mailto:{{ $booking->customer_email }}?subject=Re: Your appointment on {{ $booking->booking_date->format('F d, Y') }}" class="btn btn-outline-primary">
                            <i class="fas fa-envelope me-2"></i>Email Customer
                        </a>
                        @if($booking->customer_phone)
                        <a href="tel:{{ $booking->customer_phone }}" class="btn btn-outline-success">
                            <i class="fas fa-phone me-2"></i>Call Customer
                        </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <form method="POST" action="{{ route('admin.bookings.update', $booking) }}" class="d-inline">
                            @csrf
                            @method('PUT')
                            <input type="hidden" name="status" value="confirmed">
                            <button type="submit" class="btn btn-success w-100" {{ $booking->status === 'confirmed' ? 'disabled' : '' }}>
                                <i class="fas fa-check me-2"></i>Confirm Booking
                            </button>
                        </form>
                        
                        <form method="POST" action="{{ route('admin.bookings.update', $booking) }}" class="d-inline">
                            @csrf
                            @method('PUT')
                            <input type="hidden" name="status" value="completed">
                            <button type="submit" class="btn btn-info w-100" {{ $booking->status === 'completed' ? 'disabled' : '' }}>
                                <i class="fas fa-check-double me-2"></i>Mark Complete
                            </button>
                        </form>
                        
                        <form method="POST" action="{{ route('admin.bookings.update', $booking) }}" class="d-inline">
                            @csrf
                            @method('PUT')
                            <input type="hidden" name="status" value="cancelled">
                            <button type="submit" class="btn btn-danger w-100" {{ $booking->status === 'cancelled' ? 'disabled' : '' }}>
                                <i class="fas fa-times me-2"></i>Cancel Booking
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection