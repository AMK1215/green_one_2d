<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\BannerText;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerTextController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $texts = BannerText::latest()->get();

    //     return view('admin.banner_text.index', compact('texts'));
    // }

    public function index(): Response
    {
        $texts = BannerText::where('admin_id', auth()->id())->get(); // Fetch banners for the logged-in admin

        return Inertia::render('admin/BannerTexts/Index', [
            'texts' => $texts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/BannerTexts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required',
        ]);
        BannerText::create([
            'text' => $request->text,
            'admin_id' => auth()->id(), // Associate with the authenticated admin

        ]);

        return redirect()->route('banner-texts.index')->with('success', 'New Banner Text Created Successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BannerText $text): Response
    {
        return Inertia::render('admin/BannerTexts/Show', [
            'text' => $text,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BannerText $text): Response
    {
        return Inertia::render('admin/BannerTexts/Edit', [
            'text' => $text,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BannerText $text)
    {
        $request->validate([
            'text' => 'required',
        ]);
        $text->update([
            'text' => $request->text,
        ]);

        return redirect()->route('banner-texts.index')->with('success', 'Banner Text Updated Successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BannerText $text)
    {
        $text->delete();

        return redirect()->back()->with('success', 'Marquee Text Deleted Successfully.');
    }
}
