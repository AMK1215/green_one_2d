<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WinnerText;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WinnerTextController extends Controller
{
    public function index(): Response
    {
        $texts = WinnerText::where('owner_id', auth()->id())->get(); // Fetch banners for the logged-in admin

        return Inertia::render('admin/WinnerTexts/Index', [
            'texts' => $texts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/WinnerTexts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'text' => 'required',
        ]);
        WinnerText::create([
            'text' => $request->text,
            'owner_id' => auth()->id(),

        ]);

        return redirect()->route('winner-texts.index')->with('success', 'New Winner Text Created Successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(WinnerText $winnerText): Response
    {
        return Inertia::render('admin/WinnerTexts/Show', [
            'winnerText' => $winnerText,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WinnerText $winnerText): Response
    {
        return Inertia::render('admin/WinnerTexts/Edit', [
            'winnerText' => $winnerText,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WinnerText $winnerText)
    {
        $request->validate([
            'text' => 'required',
        ]);
        $winnerText->update([
            'text' => $request->text,
        ]);

        return redirect()->route('winner-texts.index')->with('success', 'Winner Text Updated Successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WinnerText $winnerText)
    {
        $winnerText->delete();

        return redirect()->back()->with('success', 'Marquee Text Deleted Successfully.');
    }
}
