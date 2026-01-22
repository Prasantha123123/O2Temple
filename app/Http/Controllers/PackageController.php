<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();

        return Inertia::render('PackageManagement/Index', compact('packages'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $package = Package::create($data);

        return response()->json(['package' => $package], 201);
    }

    public function update(Request $request, Package $package)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $package->update($data);

        return response()->json(['package' => $package]);
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return response()->json(['success' => true]);
    }
}
