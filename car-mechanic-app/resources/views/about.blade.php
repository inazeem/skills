@extends('layouts.app')

@section('title', 'About Us')

@section('content')
<!-- About Hero Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6">
                <h1 class="display-4 mb-4">About {{ $settings['company_name']->value ?? 'Our Company' }}</h1>
                <p class="lead">{{ $settings['company_description']->value ?? 'Your trusted partner for all automotive repair and maintenance needs.' }}</p>
                <p>We are committed to providing the highest quality automotive services with integrity, professionalism, and customer satisfaction as our top priorities.</p>
            </div>
            <div class="col-md-6">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                     alt="Auto Repair Shop" class="img-fluid rounded">
            </div>
        </div>
    </div>
</section>

<!-- Our Story Section -->
<section class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto text-center">
                <h2 class="mb-4">Our Story</h2>
                <p class="lead mb-4">Founded with a passion for automotive excellence and customer service</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    </div>
</section>

<!-- Our Values Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2>Our Values</h2>
            <p class="lead">The principles that guide everything we do</p>
        </div>
        
        <div class="row">
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-heart fa-3x text-primary"></i>
                </div>
                <h5>Passion</h5>
                <p>We love what we do and it shows in our work quality</p>
            </div>
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-handshake fa-3x text-primary"></i>
                </div>
                <h5>Integrity</h5>
                <p>Honest, transparent, and trustworthy in all our dealings</p>
            </div>
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <i class="fas fa-star fa-3x text-primary"></i>
                </div>
                <h5>Excellence</h5>
                <p>Striving for the highest standards in every service</p>
            </div>
        </div>
    </div>
</section>

<!-- Team Section -->
<section class="py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h2>Our Team</h2>
            <p class="lead">Meet the professionals behind our success</p>
        </div>
        
        <div class="row">
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                         alt="Team Member" class="img-fluid rounded-circle" style="width: 200px; height: 200px; object-fit: cover;">
                </div>
                <h5>John Smith</h5>
                <p class="text-muted">Master Technician</p>
                <p>20+ years of experience in automotive repair and diagnostics</p>
            </div>
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                         alt="Team Member" class="img-fluid rounded-circle" style="width: 200px; height: 200px; object-fit: cover;">
                </div>
                <h5>Sarah Johnson</h5>
                <p class="text-muted">Service Manager</p>
                <p>Dedicated to ensuring customer satisfaction and quality service</p>
            </div>
            <div class="col-md-4 text-center mb-4">
                <div class="mb-3">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                         alt="Team Member" class="img-fluid rounded-circle" style="width: 200px; height: 200px; object-fit: cover;">
                </div>
                <h5>Mike Davis</h5>
                <p class="text-muted">Diagnostic Specialist</p>
                <p>Expert in modern vehicle electronics and computer systems</p>
            </div>
        </div>
    </div>
</section>

<!-- Contact CTA -->
<section class="py-5 bg-primary text-white">
    <div class="container text-center">
        <h2>Get to Know Us Better</h2>
        <p class="lead mb-4">Visit our shop or contact us to learn more about our services</p>
        <a href="{{ route('contact.index') }}" class="btn btn-light btn-lg">Contact Us</a>
    </div>
</section>
@endsection