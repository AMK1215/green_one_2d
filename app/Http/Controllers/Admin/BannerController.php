<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::all(); // Fetch banners for the logged-in admin

        return Inertia::render('admin/Banners/Index', [
            'banners' => $banners,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/Banners/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $image = $request->file('image');
        $ext = $image->getClientOriginalExtension();
        $filename = uniqid('banner').'.'.$ext;
        $image->move(public_path('assets/img/banners/'), $filename);
        Banner::create([
            'image' => $filename,
            'admin_id' => auth()->id(),
        ]);

        return redirect()->route('banners.index')->with('success', 'New Banner Image Added.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner): Response
    {
        return Inertia::render('admin/Banners/Show', [
            'banner' => $banner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner): Response
    {
        return Inertia::render('admin/Banners/Edit', [
            'banner' => $banner,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        if (! $banner) {
            return redirect()->back()->with('error', 'Banner Not Found');
        }
        $image = $request->file('image');

        if ($image) {
            File::delete(public_path('assets/img/banners/'.$banner->image));
            $ext = $image->getClientOriginalExtension();
            $filename = uniqid('banner').'.'.$ext;
            $image->move(public_path('assets/img/banners/'), $filename);

            $banner->update([
                'image' => $filename,
            ]);
        }

        return redirect()->route('banners.index')->with('success', 'Banner Image Updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        if (! $banner) {
            return redirect()->back()->with('error', 'Banner Not Found');
        }

        File::delete(public_path('assets/img/banners/'.$banner->image));
        $banner->delete();

        return redirect()->back()->with('success', 'Banner Deleted.');
    }
}
