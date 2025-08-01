@extends('layouts.app')

@section('title', 'Service Details')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Service Details</h1>
        <a href="{{ route('admin.services.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to Services
        </a>
    </div>

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
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h2 class="card-title">{{ $service->name }}</h2>
                        <span class="badge bg-{{ $service->is_active ? 'success' : 'secondary' }} fs-6">
                            {{ $service->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <span class="h4 text-primary">${{ number_format($service->price, 2) }}</span>
                        </div>
                        <div class="col-md-6 text-end">
                            <span class="badge bg-secondary fs-6">{{ $service->duration_minutes }} minutes</span>
                        </div>
                    </div>
                    
                    <p class="card-text lead">{{ $service->description }}</p>
                    
                    <div class="mt-4">
                        <a href="{{ route('admin.services.edit', $service) }}" class="btn btn-primary">
                            <i class="fas fa-edit me-2"></i>Edit Service
                        </a>
                        <a href="{{ route('admin.services.index') }}" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-2"></i>Back to Services
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <!-- Service Statistics -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Service Statistics</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <strong>Total Bookings:</strong> {{ $service->bookings->count() }}
                    </div>
                    <div class="mb-3">
                        <strong>Pending Bookings:</strong> {{ $service->bookings->where('status', 'pending')->count() }}
                    </div>
                    <div class="mb-3">
                        <strong>Completed Bookings:</strong> {{ $service->bookings->where('status', 'completed')->count() }}
                    </div>
                    <div class="mb-3">
                        <strong>Sort Order:</strong> {{ $service->sort_order }}
                    </div>
                </div>
            </div>

            <!-- Service Details -->
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Service Details</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <strong>Created:</strong><br>
                        {{ $service->created_at->format('F d, Y \a\t g:i A') }}
                    </div>
                    <div class="mb-3">
                        <strong>Last Updated:</strong><br>
                        {{ $service->updated_at->format('F d, Y \a\t g:i A') }}
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <a href="{{ route('admin.services.edit', $service) }}" class="btn btn-outline-primary">
                            <i class="fas fa-edit me-2"></i>Edit Service
                        </a>
                        <form method="POST" action="{{ route('admin.services.destroy', $service) }}" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this service?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger">
                                <i class="fas fa-trash me-2"></i>Delete Service
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection