@extends('layouts.app')

@section('title', 'Contact Us')

@section('content')
<div class="container py-5">
    <div class="text-center mb-5">
        <h1>Contact Us</h1>
        <p class="lead">Get in touch with us for any questions or concerns</p>
    </div>

    <div class="row">
        <!-- Contact Information -->
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">Contact Information</h5>
                    
                    <div class="mb-3">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                        <strong>Address:</strong><br>
                        {{ $settings['address']->value ?? '123 Main Street, Anytown, ST 12345' }}
                    </div>
                    
                    <div class="mb-3">
                        <i class="fas fa-phone text-primary me-2"></i>
                        <strong>Phone:</strong><br>
                        <a href="tel:{{ $settings['phone']->value ?? '(555) 123-4567' }}" class="text-decoration-none">
                            {{ $settings['phone']->value ?? '(555) 123-4567' }}
                        </a>
                    </div>
                    
                    <div class="mb-3">
                        <i class="fas fa-envelope text-primary me-2"></i>
                        <strong>Email:</strong><br>
                        <a href="mailto:{{ $settings['email']->value ?? 'info@example.com' }}" class="text-decoration-none">
                            {{ $settings['email']->value ?? 'info@example.com' }}
                        </a>
                    </div>
                    
                    <div class="mb-3">
                        <i class="fas fa-clock text-primary me-2"></i>
                        <strong>Business Hours:</strong><br>
                        {!! nl2br(e($settings['business_hours']->value ?? 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed')) !!}
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Form -->
        <div class="col-md-8 mb-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Send us a Message</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('contact.store') }}">
                        @csrf
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="name" class="form-label">Full Name *</label>
                                <input type="text" id="name" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name') }}" required>
                                @error('name')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="email" class="form-label">Email Address *</label>
                                <input type="email" id="email" name="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required>
                                @error('email')
                                    <span class="invalid-feedback">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="phone" class="form-label">Phone Number (Optional)</label>
                            <input type="tel" id="phone" name="phone" class="form-control @error('phone') is-invalid @enderror" value="{{ old('phone') }}">
                            @error('phone')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        <div class="mb-3">
                            <label for="subject" class="form-label">Subject *</label>
                            <input type="text" id="subject" name="subject" class="form-control @error('subject') is-invalid @enderror" value="{{ old('subject') }}" required>
                            @error('subject')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        <div class="mb-3">
                            <label for="message" class="form-label">Message *</label>
                            <textarea id="message" name="message" class="form-control @error('message') is-invalid @enderror" rows="5" required>{{ old('message') }}</textarea>
                            @error('message')
                                <span class="invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                        
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Google Maps -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Find Us</h5>
                </div>
                <div class="card-body p-0">
                    @if(isset($settings['google_maps_embed']))
                        {!! $settings['google_maps_embed']->value !!}
                    @else
                        <div class="bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
                            <div class="text-center">
                                <i class="fas fa-map fa-3x text-muted mb-3"></i>
                                <p class="text-muted">Map not available</p>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection