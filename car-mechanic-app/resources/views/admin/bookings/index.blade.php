@extends('layouts.app')

@section('title', 'Manage Bookings')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Bookings</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Vehicle</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($bookings as $booking)
                        <tr>
                            <td>
                                <strong>{{ $booking->customer_name }}</strong>
                                <br>
                                <small class="text-muted">{{ $booking->customer_email }}</small>
                                <br>
                                <small class="text-muted">{{ $booking->customer_phone }}</small>
                            </td>
                            <td>
                                <strong>{{ $booking->service->name }}</strong>
                                <br>
                                <small class="text-muted">${{ number_format($booking->service->price, 2) }}</small>
                            </td>
                            <td>
                                {{ $booking->vehicle_year }} {{ $booking->vehicle_make }} {{ $booking->vehicle_model }}
                                @if($booking->license_plate)
                                    <br>
                                    <small class="text-muted">{{ $booking->license_plate }}</small>
                                @endif
                            </td>
                            <td>
                                <strong>{{ $booking->booking_date->format('M d, Y') }}</strong>
                                <br>
                                <small class="text-muted">{{ $booking->booking_time }}</small>
                            </td>
                            <td>
                                <span class="badge bg-{{ 
                                    $booking->status === 'pending' ? 'warning' : 
                                    ($booking->status === 'confirmed' ? 'success' : 
                                    ($booking->status === 'completed' ? 'info' : 'secondary')) 
                                }}">
                                    {{ ucfirst($booking->status) }}
                                </span>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.bookings.edit', $booking) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <a href="{{ route('admin.bookings.show', $booking) }}" class="btn btn-sm btn-outline-info">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <form method="POST" action="{{ route('admin.bookings.destroy', $booking) }}" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this booking?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4">
                                <i class="fas fa-calendar fa-2x text-muted mb-3"></i>
                                <p class="text-muted">No bookings found.</p>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection