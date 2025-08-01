@extends('layouts.app')

@section('title', 'Our Services')

@section('content')
<div class="container py-5">
    <div class="text-center mb-5">
        <h1>Our Services</h1>
        <p class="lead">Professional automotive services you can trust</p>
    </div>

    <div class="row">
        @foreach($services as $service)
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card service-card h-100 shadow-sm">
                @if($service->image)
                    <img src="{{ asset('storage/' . $service->image) }}" class="card-img-top" alt="{{ $service->name }}" style="height: 200px; object-fit: cover;">
                @else
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                        <i class="fas fa-wrench fa-3x text-muted"></i>
                    </div>
                @endif
                <div class="card-body">
                    <h5 class="card-title">{{ $service->name }}</h5>
                    <p class="card-text">{{ $service->description }}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h5 text-primary mb-0">${{ number_format($service->price, 2) }}</span>
                        <span class="badge bg-secondary">{{ $service->duration_minutes }} min</span>
                    </div>
                    <div class="d-grid">
                        <a href="{{ route('services.show', $service) }}" class="btn btn-outline-primary">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>

    @if($services->count() === 0)
    <div class="text-center py-5">
        <i class="fas fa-wrench fa-3x text-muted mb-3"></i>
        <h3>No Services Available</h3>
        <p class="text-muted">Check back soon for our service offerings.</p>
    </div>
    @endif
</div>
@endsection