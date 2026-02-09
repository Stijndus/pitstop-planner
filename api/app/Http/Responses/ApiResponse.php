<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    /**
     * Return a successful API response
     *
     * @param mixed $data The data to return
     * @param string|null $message Optional success message
     * @param int $status HTTP status code (default: 200)
     * @return JsonResponse
     */
    public static function success($data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
        ];

        if ($message !== null) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }

    /**
     * Return an error API response
     *
     * @param string $error The error message
     * @param int $status HTTP status code (default: 400)
     * @return JsonResponse
     */
    public static function error(string $error, int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'status' => $status,
            'error' => $error,
        ], $status);
    }
}
