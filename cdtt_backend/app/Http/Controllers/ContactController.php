<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    // 📨 Nhận phản hồi từ form
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
        ]);

        Contact::create($validated);

        return response()->json(['message' => 'Gửi phản hồi thành công'], 201);
    }

    // 📋 Trả danh sách phản hồi (cho Admin)
    public function index()
    {
        return response()->json(Contact::orderByDesc('created_at')->get());
    }
}

