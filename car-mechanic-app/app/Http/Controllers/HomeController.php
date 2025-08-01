<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Setting;

class HomeController extends Controller
{
    /**
     * Show the application homepage.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $services = Service::active()->ordered()->take(6)->get();
        $settings = Setting::all()->keyBy('key');
        
        return view('home', compact('services', 'settings'));
    }

    /**
     * Show the about us page.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function about()
    {
        $settings = Setting::all()->keyBy('key');
        return view('about', compact('settings'));
    }
}
