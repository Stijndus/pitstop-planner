<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation failed', 422);
        }

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth()->login($user);

        return $this->respondWithToken($token);
    }

    /**
     * Get a JWT via given credentials.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation failed', 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return ApiResponse::error('Invalid credentials', 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     */
    public function me()
    {
        return ApiResponse::success(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        auth()->logout();

        return ApiResponse::success(null, 'Successfully logged out');
    }

    /**
     * Refresh a token.
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     */
    protected function respondWithToken($token)
    {
        return ApiResponse::success([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
}
