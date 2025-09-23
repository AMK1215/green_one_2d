<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $promotions = Promotion::latest()->get();

    //     return view('admin.promotions.index', compact('promotions'));
    // }

    public function index(): Response
    {
        $promotions = Promotion::where('admin_id', auth()->id())->get(); // Fetch banners for the logged-in admin

        return Inertia::render('admin/Promotions/Index', [
            'promotions' => $promotions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/Promotions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required',
            'title' => 'required',
            'description' => 'nullable',
        ]);
        // image
        $image = $request->file('image');
        $ext = $image->getClientOriginalExtension();
        $filename = uniqid('promotion').'.'.$ext; // Generate a unique filename
        $image->move(public_path('assets/img/promotions/'), $filename); // Save the file

        $promotion = Promotion::create([
            'image' => $filename,
            'title' => $request->title,
            'description' => $request->description,
            'admin_id' => auth()->id(),
        ]);

        return redirect()->route('promotions.index')->with('success', 'New Promotion Created Successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Promotion $promotion): Response
    {
        return Inertia::render('admin/Promotions/Show', [
            'promotion' => $promotion,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promotion $promotion): Response
    {
        return Inertia::render('admin/Promotions/Edit', [
            'promotion' => $promotion,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion)
    {
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $ext = $image->getClientOriginalExtension();
            $filename = uniqid('promotion').'.'.$ext;
            $image->move(public_path('assets/img/promotions/'), $filename);

            $promotion->update([
                'image' => $filename,
            ]);

            return redirect()->route('promotions.index')->with('success', 'Promotion Updated');
        }
        $promotion->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('promotions.index')->with('success', 'Promotion Updated');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion)
    {
        File::delete(public_path('assets/img/promotions/'.$promotion->image));
        $promotion->delete();

        return redirect()->route('promotions.index')->with('success', 'Promotion Deleted.');
    }
}
