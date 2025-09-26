<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLotteryTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'player_id' => 'required|integer|min:1',
            'player_user_name' => 'required|string|max:100',
            'selected_digits' => 'required|array|min:1|max:10', // Array of digits
            'selected_digits.*' => 'required|string|size:3|regex:/^[0-9]{3}$/', // 3-digit numbers
            'amount_per_ticket' => 'required|numeric|min:100|max:10000', // Amount per ticket
            'selected_datetime' => 'required|date|after_or_equal:today',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'player_id.required' => 'Player ID is required.',
            'player_id.integer' => 'Player ID must be a valid number.',
            'player_id.min' => 'Player ID must be greater than 0.',
            'player_user_name.required' => 'Player username is required.',
            'player_user_name.max' => 'Player username cannot exceed 100 characters.',
            'selected_digits.required' => 'Please select at least one lottery number.',
            'selected_digits.array' => 'Selected digits must be an array.',
            'selected_digits.min' => 'Please select at least one lottery number.',
            'selected_digits.max' => 'You can select maximum 10 lottery numbers.',
            'selected_digits.*.required' => 'Each lottery number is required.',
            'selected_digits.*.size' => 'Each lottery number must be exactly 3 digits.',
            'selected_digits.*.regex' => 'Each lottery number must contain only digits (0-9).',
            'amount_per_ticket.required' => 'Amount per ticket is required.',
            'amount_per_ticket.numeric' => 'Amount per ticket must be a valid number.',
            'amount_per_ticket.min' => 'Minimum amount per ticket is 100 ကျပ်.',
            'amount_per_ticket.max' => 'Maximum amount per ticket is 10,000 ကျပ်.',
            'selected_datetime.required' => 'Selected date and time is required.',
            'selected_datetime.date' => 'Selected date must be a valid date.',
            'selected_datetime.after_or_equal' => 'Selected date cannot be in the past.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'player_id' => 'Player ID',
            'player_user_name' => 'Player Username',
            'selected_digits' => 'Selected Lottery Numbers',
            'selected_digits.*' => 'Lottery Number',
            'amount_per_ticket' => 'Amount Per Ticket',
            'selected_datetime' => 'Selected Date & Time',
        ];
    }
}
