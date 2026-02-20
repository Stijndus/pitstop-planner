<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Service Type Intervals (in kilometers)
    |--------------------------------------------------------------------------
    |
    | Define the default maintenance intervals for each service type.
    | Intervals are in kilometers. Set to null for services without
    | a standard interval (like 'Custom').
    |
    */
    'service_intervals' => [
        'Oil Change' => 8000,
        'Brake Service' => 20000,
        'Tire Rotation' => 10000,
        'Air Filter' => 15000,
        'Cabin Filter' => 15000,
        'Spark Plugs' => 30000,
        'Timing Belt' => 90000,
        'Inspection' => 15000,
        'Coolant Service' => 40000,
        'Transmission Service' => 60000,
        'Custom' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Valid Service Types
    |--------------------------------------------------------------------------
    |
    | List of all valid service types that can be logged.
    |
    */
    'service_types' => [
        'Oil Change',
        'Brake Service',
        'Tire Rotation',
        'Air Filter',
        'Cabin Filter',
        'Spark Plugs',
        'Timing Belt',
        'Inspection',
        'Coolant Service',
        'Transmission Service',
        'Custom',
    ],

    /*
    |--------------------------------------------------------------------------
    | Due Soon Threshold (in kilometers)
    |--------------------------------------------------------------------------
    |
    | The threshold for warning that maintenance is due soon.
    |
    */
    'due_soon_threshold' => 500,
];
