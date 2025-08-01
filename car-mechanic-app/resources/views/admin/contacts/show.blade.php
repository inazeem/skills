@extends('layouts.app')

@section('title', 'Message Details')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Message Details</h1>
        <a href="{{ route('admin.contacts.index') }}" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to Messages
        </a>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">{{ $contact->subject }}</h5>
                    <span class="badge bg-{{ 
                        $contact->status === 'unread' ? 'danger' : 
                        ($contact->status === 'read' ? 'secondary' : 'success') 
                    }}">
                        {{ ucfirst($contact->status) }}
                    </span>
                </div>
                <div class="card-body">
                    <div class="mb-4">
                        <h6>Message:</h6>
                        <div class="border rounded p-3 bg-light">
                            {{ $contact->message }}
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <form method="POST" action="{{ route('admin.contacts.update', $contact) }}" class="d-inline">
                            @csrf
                            @method('PUT')
                            <input type="hidden" name="status" value="{{ $contact->status === 'unread' ? 'read' : 'replied' }}">
                            <button type="submit" class="btn btn-{{ $contact->status === 'unread' ? 'success' : 'warning' }}">
                                <i class="fas fa-{{ $contact->status === 'unread' ? 'check' : 'reply' }} me-2"></i>
                                {{ $contact->status === 'unread' ? 'Mark as Read' : 'Mark as Replied' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Contact Information</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <strong>Name:</strong><br>
                        {{ $contact->name }}
                    </div>
                    
                    <div class="mb-3">
                        <strong>Email:</strong><br>
                        <a href="mailto:{{ $contact->email }}">{{ $contact->email }}</a>
                    </div>
                    
                    @if($contact->phone)
                    <div class="mb-3">
                        <strong>Phone:</strong><br>
                        <a href="tel:{{ $contact->phone }}">{{ $contact->phone }}</a>
                    </div>
                    @endif
                    
                    <div class="mb-3">
                        <strong>Subject:</strong><br>
                        {{ $contact->subject }}
                    </div>
                    
                    <div class="mb-3">
                        <strong>Date:</strong><br>
                        {{ $contact->created_at->format('F d, Y \a\t g:i A') }}
                    </div>
                    
                    <div class="d-grid gap-2">
                        <a href="mailto:{{ $contact->email }}?subject=Re: {{ $contact->subject }}" class="btn btn-primary">
                            <i class="fas fa-reply me-2"></i>Reply via Email
                        </a>
                        @if($contact->phone)
                        <a href="tel:{{ $contact->phone }}" class="btn btn-outline-primary">
                            <i class="fas fa-phone me-2"></i>Call Customer
                        </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection