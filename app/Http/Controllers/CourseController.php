<?php

namespace App\Http\Controllers;

use App\Models\Course; // Импортируйте модель Course
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        // Валидация входящих данных
        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
        ]);

        // Генерация инвайт-кода
        $inviteCode = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 5)); // Генерируем случайный инвайт-код из 5 букв

        // Создание нового курса
        $newCourse = Course::create([
            'name' => $validated['course_name'],
            'teacher_id' => auth()->id(), // Автоматически назначаем текущего учителя
            'inviteCode' => $inviteCode, // Сохраняем инвайт-код
        ]);

        // Проверка успешности создания курса
        if ($newCourse) {
            return redirect()->back()->with('success', 'Course created successfully. Invite Code: ' . $inviteCode);
        } else {
            return redirect()->back()->with('error', 'Failed to create course');
        }
    }
}
