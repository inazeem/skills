@extends('layouts.app')

@section('title', 'Manage Messages')

@section('content')
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Messages</h1>
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
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($contacts as $contact)
                        <tr class="{{ $contact->status === 'unread' ? 'table-warning' : '' }}">
                            <td>
                                <strong>{{ $contact->name }}</strong>
                            </td>
                            <td>
                                <div>{{ $contact->email }}</div>
                                @if($contact->phone)
                                    <small class="text-muted">{{ $contact->phone }}</small>
                                @endif
                            </td>
                            <td>
                                <strong>{{ $contact->subject }}</strong>
                                <br>
                                <small class="text-muted">{{ Str::limit($contact->message, 50) }}</small>
                            </td>
                            <td>
                                <div>{{ $contact->created_at->format('M d, Y') }}</div>
                                <small class="text-muted">{{ $contact->created_at->format('g:i A') }}</small>
                            </td>
                            <td>
                                <span class="badge bg-{{ 
                                    $contact->status === 'unread' ? 'danger' : 
                                    ($contact->status === 'read' ? 'secondary' : 'success') 
                                }}">
                                    {{ ucfirst($contact->status) }}
                                </span>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.contacts.show', $contact) }}" class="btn btn-sm btn-outline-info">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <form method="POST" action="{{ route('admin.contacts.update', $contact) }}" class="d-inline">
                                        @csrf
                                        @method('PUT')
                                        <input type="hidden" name="status" value="{{ $contact->status === 'unread' ? 'read' : 'replied' }}">
                                        <button type="submit" class="btn btn-sm btn-outline-{{ $contact->status === 'unread' ? 'success' : 'warning' }}">
                                            <i class="fas fa-{{ $contact->status === 'unread' ? 'check' : 'reply' }}"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4">
                                <i class="fas fa-envelope fa-2x text-muted mb-3"></i>
                                <p class="text-muted">No messages found.</p>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if($contacts->hasPages())
                <div class="d-flex justify-content-center mt-4">
                    {{ $contacts->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection