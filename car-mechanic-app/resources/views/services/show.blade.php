@extends('layouts.app')

@section('title', $service->name)

@section('content')
<div class="container py-5">
    <div class="row">
        <div class="col-md-8">
            <div class="card">
                @if($service->image)
                    <img src="{{ asset('storage/' . $service->image) }}" class="card-img-top" alt="{{ $service->name }}" style="height: 400px; object-fit: cover;">
                @else
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
                        <i class="fas fa-wrench fa-5x text-muted"></i>
                    </div>
                @endif
                <div class="card-body">
                    <h1 class="card-title">{{ $service->name }}</h1>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h3 text-primary">${{ number_format($service->price, 2) }}</span>
                        <span class="badge bg-secondary fs-6">{{ $service->duration_minutes }} minutes</span>
                    </div>
                    <p class="card-text lead">{{ $service->description }}</p>
                    
                    <div class="mt-4">
                        <a href="{{ route('bookings.create') }}?service={{ $service->id }}" class="btn btn-primary btn-lg">
                            <i class="fas fa-calendar-plus me-2"></i>Book This Service
                        </a>
                        <a href="{{ route('services.index') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-2"></i>Back to Services
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <!-- Service Details -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Service Details</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <strong>Duration:</strong> {{ $service->duration_minutes }} minutes
                    </div>
                    <div class="mb-3">
                        <strong>Price:</strong> ${{ number_format($service->price, 2) }}
                    </div>
                    <div class="mb-3">
                        <strong>Status:</strong> 
                        <span class="badge bg-{{ $service->is_active ? 'success' : 'secondary' }}">
                            {{ $service->is_active ? 'Available' : 'Unavailable' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Need Help?</h5>
                </div>
                <div class="card-body">
                    <p>Have questions about this service? Contact us:</p>
                    <div class="mb-2">
                        <i class="fas fa-phone text-primary me-2"></i>
                        <a href="tel:{{ $settings['phone']->value ?? '(555) 123-4567' }}" class="text-decoration-none">
                            {{ $settings['phone']->value ?? '(555) 123-4567' }}
                        </a>
                    </div>
                    <div class="mb-2">
                        <i class="fas fa-envelope text-primary me-2"></i>
                        <a href="mailto:{{ $settings['email']->value ?? 'info@example.com' }}" class="text-decoration-none">
                            {{ $settings['email']->value ?? 'info@example.com' }}
                        </a>
                    </div>
                    <a href="{{ route('contact.index') }}" class="btn btn-outline-primary btn-sm">
                        <i class="fas fa-comment me-2"></i>Send Message
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection