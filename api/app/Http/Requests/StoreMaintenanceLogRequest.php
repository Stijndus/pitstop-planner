<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\MaintenanceLog;
use App\Models\Vehicle;

class StoreMaintenanceLogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure currency defaults to EUR if not provided
        if (!$this->has('currency')) {
            $this->merge(['currency' => 'EUR']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $serviceTypes = config('maintenance.service_types', []);

        return [
            'vehicle_id' => [
                'required',
                'integer',
                'exists:vehicles,id',
                function ($attribute, $value, $fail) {
                    $vehicle = Vehicle::find($value);
                    if ($vehicle && $vehicle->user_id !== auth('api')->id()) {
                        $fail('You do not have permission to add maintenance logs to this vehicle.');
                    }
                },
            ],
            'service_type' => [
                'required',
                'string',
                Rule::in($serviceTypes),
            ],
            'custom_description' => [
                'required_if:service_type,Custom',
                'nullable',
                'string',
                'max:255',
            ],
            'date_performed' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'odometer_km' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) {
                    $vehicleId = $this->input('vehicle_id');

                    if (!$vehicleId) {
                        return;
                    }

                    // Check against the last maintenance log entry
                    $lastMaintenanceLog = MaintenanceLog::where('vehicle_id', $vehicleId)
                        ->orderBy('odometer_km', 'desc')
                        ->first();

                    if ($lastMaintenanceLog && $value <= $lastMaintenanceLog->odometer_km) {
                        $fail("The odometer reading must be greater than the previous maintenance entry ({$lastMaintenanceLog->odometer_km} km).");
                    }

                    // Also check against current vehicle odometer
                    $vehicle = Vehicle::find($vehicleId);
                    if ($vehicle && $value > $vehicle->odometer + 50000) {
                        $fail('The odometer reading seems unusually high compared to the vehicle\'s current odometer.');
                    }
                },
            ],
            'cost' => [
                'nullable',
                'numeric',
                'min:0',
                'max:999999.99',
            ],
            'currency' => [
                'nullable',
                'string',
                'size:3',
                'uppercase',
            ],
            'interval_km' => [
                'nullable',
                'integer',
                'min:100',
                'max:999999',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'vehicle_id.required' => 'A vehicle must be selected.',
            'vehicle_id.exists' => 'The selected vehicle does not exist.',
            'service_type.required' => 'Service type is required.',
            'service_type.in' => 'Invalid service type selected.',
            'custom_description.required_if' => 'A description is required for custom service types.',
            'date_performed.required' => 'Service date is required.',
            'date_performed.date' => 'Please provide a valid date.',
            'date_performed.before_or_equal' => 'Service date cannot be in the future.',
            'odometer_km.required' => 'Odometer reading is required.',
            'odometer_km.integer' => 'Odometer reading must be a whole number.',
            'odometer_km.min' => 'Odometer must be at least 1 km.',
            'cost.numeric' => 'Cost must be a valid number.',
            'cost.min' => 'Cost cannot be negative.',
            'cost.max' => 'Cost is too large.',
            'currency.size' => 'Currency code must be exactly 3 characters (e.g., EUR, USD).',
            'currency.uppercase' => 'Currency code must be uppercase.',
            'interval_km.min' => 'Interval must be at least 100 km.',
            'interval_km.max' => 'Interval is too large.',
            'notes.max' => 'Notes cannot exceed 5000 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'vehicle_id' => 'vehicle',
            'service_type' => 'service type',
            'custom_description' => 'custom description',
            'date_performed' => 'service date',
            'odometer_km' => 'odometer reading',
            'interval_km' => 'service interval',
        ];
    }
}
