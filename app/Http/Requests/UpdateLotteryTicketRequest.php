<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLotteryTicketRequest extends FormRequest
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
            'ticket_ids' => 'required|array|min:1',
            'ticket_ids.*' => 'integer|exists:lottery_tickets,id',
            'payment_status' => 'required|in:pending,completed,failed',
            'payment_method' => 'nullable|string|max:50',
            'payment_reference' => 'nullable|string|max:255',
            'payment_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120' // 5MB max
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
            'ticket_ids.required' => 'Ticket IDs are required.',
            'ticket_ids.array' => 'Ticket IDs must be an array.',
            'ticket_ids.min' => 'At least one ticket ID is required.',
            'ticket_ids.*.integer' => 'Each ticket ID must be a valid number.',
            'ticket_ids.*.exists' => 'One or more ticket IDs do not exist.',
            'payment_status.required' => 'Payment status is required.',
            'payment_status.in' => 'Payment status must be pending, completed, or failed.',
            'payment_method.max' => 'Payment method cannot exceed 50 characters.',
            'payment_reference.max' => 'Payment reference cannot exceed 255 characters.',
            'payment_image.image' => 'Payment image must be a valid image file.',
            'payment_image.mimes' => 'Payment image must be a JPEG, PNG, JPG, or GIF file.',
            'payment_image.max' => 'Payment image size cannot exceed 5MB.',
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
            'ticket_ids' => 'Ticket IDs',
            'ticket_ids.*' => 'Ticket ID',
            'payment_status' => 'Payment Status',
            'payment_method' => 'Payment Method',
            'payment_reference' => 'Payment Reference',
            'payment_image' => 'Payment Image',
        ];
    }
}
