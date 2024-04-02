<?php

namespace App\Http\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthService
{
    public function register($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'name' => 'required|string|between:2,100',
                'email' => 'required|string|email|max:100|unique:users',
                'password' => 'required|between:6,255|same:c_password',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 202);
            }

            $input = $data->all();
            $input['password'] = bcrypt($input['password']);

            // Create new user
            $user = User::create($input);
            $token = $user->createToken('MyApp')->accessToken;

            // Response
            if ($user && $token) {
                return response()->json([
                    'message' => 'User successfully registered',
                    'user' => $user,
                    'token' => $token
                ], 200);
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function login($data)
    {
        try {
            if (Auth::attempt(['email' => $data->email, 'password' => $data->password])) {
                $user = Auth::user();
                $token = $user->createToken('MyApp')->accessToken;
                
                return response()->json([
                    'message' => 'Logged-In successfully',
                    'user' => $user,
                    'token' => $token
                ], 200);
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
