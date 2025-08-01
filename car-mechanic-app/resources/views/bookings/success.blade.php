@extends('layouts.app')

@section('title', 'Booking Confirmed')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card text-center">
                <div class="card-body py-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    </div>
                    <h2 class="card-title text-success mb-3">Booking Confirmed!</h2>
                    <p class="card-text lead mb-4">
                        Thank you for booking your appointment with us. We have received your request and will contact you shortly to confirm the details.
                    </p>
                    <div class="alert alert-info">
                        <h5>What happens next?</h5>
                        <ul class="list-unstyled mb-0">
                            <li><i class="fas fa-phone me-2"></i>We'll call you to confirm your appointment</li>
                            <li><i class="fas fa-envelope me-2"></i>You'll receive a confirmation email</li>
                            <li><i class="fas fa-calendar me-2"></i>Please arrive 10 minutes before your scheduled time</li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <a href="{{ route('home') }}" class="btn btn-primary me-2">Return to Home</a>
                        <a href="{{ route('services.index') }}" class="btn btn-outline-primary">View Our Services</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection