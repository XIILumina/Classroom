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
            'courseName' => 'required|string|max:255', // Валидация имени курса
            'inviteCode' => 'required|string|max:5', // Валидация инвайт-кода
        ]);

        // Создание нового курса
        $newCourse = Course::create([
            'name' => $validated['courseName'], // Используем валидированные данные
            'teacher_id' => auth()->id(), // Автоматически назначаем текущего учителя
            'invite_code' => strtoupper($validated['inviteCode']), // Сохраняем инвайт-код в верхнем регистре
        ]);

        // Проверка успешности создания курса
        if ($newCourse) {
            return response()->json($newCourse, 201); // Возвращаем созданный курс в формате JSON
        } else {
            return response()->json(['error' => 'Failed to create course'], 500); // Обработка ошибки
        }
    }
}
