<?php

namespace App\Http\Controllers;

use App\Models\Bed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BedManagementController extends Controller
{
    public function index()
    {
        $beds = Bed::all();

        return Inertia::render('BedManagement/Index', compact('beds'));
    }



    public function store(Request $request)
    {


        $data = $request->validate([
            'bed_number' => 'required|string|max:255',
            'status' => 'required|string|in:available,occupied,maintenance',
        ]);

        Bed::create($data);

        return redirect()->route('beds.index');
    }





    public function update(Request $request, Bed $bed)
    {
        $data = $request->validate([
            'bed_number' => 'required|string|max:255',
            'status' => 'required|string|in:available,occupied,maintenance',
        ]);

        $bed->update($data);

        return redirect()->route('beds.index');
    }

    public function destroy(Bed $bed)
    {
        $bed->delete();

        return redirect()->route('beds.index');
    }
}
