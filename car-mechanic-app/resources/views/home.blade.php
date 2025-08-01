@extends('layouts.app')

@section('title', 'Home')

@section('content')
<!-- Hero Section -->
<section class="hero-section text-center">
    <div class="container">
        <h1 class="display-4 mb-4">Professional Auto Repair Services</h1>
        <p class="lead mb-4">{{ $settings['company_description']->value ?? 'Your trusted partner for all automotive repair and maintenance needs.' }}</p>
        <div class="d-flex justify-content-center gap-3">
            <a href="{{ route('services.index') }}" class="btn btn-primary btn-lg">Our Services</a>
            <a href="{{ route('bookings.create') }}" class="btn btn-outline-light btn-lg">Book Appointment</a>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h2>Our Services</h2>
            <p class="lead">Professional automotive services you can trust</p>
        </div>
        
        <div class="row">
            @foreach($services as $service)
            <div class="col-md-4 mb-4">
                <div class="card service-card h-100 shadow-sm">
                    @if($service->image)
                        <img src="{{ asset('storage/' . $service->image) }}" class="card-img-top" alt="{{ $service->name }}">
                    @else
                        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                            <i class="fas fa-wrench fa-3x text-muted"></i>
                        </div>
                    @endif
                    <div class="card-body">
                        <h5 class="card-title">{{ $service->name }}</h5>
                        <p class="card-text">{{ Str::limit($service->description, 100) }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 text-primary mb-0">${{ number_format($service->price, 2) }}</span>
                            <a href="{{ route('services.show', $service) }}" class="btn btn-outline-primary">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        
        <div class="text-center mt-4">
            <a href="{{ route('services.index') }}" class="btn btn-primary">View All Services</a>
        </div>
    </div>
</section>

<!-- Why Choose Us Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2>Why Choose Us</h2>
            <p class="lead">Experience the difference with our professional service</p>
        </div>
        
        <div class="row">
            <div class="col-md-3 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-tools fa-3x text-primary"></i>
                </div>
                <h5>Expert Technicians</h5>
                <p>Certified professionals with years of experience</p>
            </div>
            <div class="col-md-3 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-clock fa-3x text-primary"></i>
                </div>
                <h5>Quick Service</h5>
                <p>Fast turnaround times without compromising quality</p>
            </div>
            <div class="col-md-3 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-dollar-sign fa-3x text-primary"></i>
                </div>
                <h5>Fair Pricing</h5>
                <p>Competitive rates with no hidden fees</p>
            </div>
            <div class="col-md-3 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-shield-alt fa-3x text-primary"></i>
                </div>
                <h5>Warranty</h5>
                <p>All our work comes with a comprehensive warranty</p>
            </div>
        </div>
    </div>
</section>

<!-- Call to Action -->
<section class="py-5 bg-primary text-white">
    <div class="container text-center">
        <h2>Ready to Get Started?</h2>
        <p class="lead mb-4">Book your appointment today and experience professional auto care</p>
        <a href="{{ route('bookings.create') }}" class="btn btn-light btn-lg">Book Now</a>
    </div>
</section>
@endsection
