<?php

namespace App\Http\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Validator;

class UserService
{
    public function usersList()
    {
        try {
            $users = User::all();

            if ($users)
                return response()->json([
                    'users' => $users,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function createUser($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'name' => 'required|string|between:2,100',
                'email' => 'required|string|email|max:100|unique:users',
                'password' => 'required|between:6,255|same:c_password',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $input = $data->all();
            $input['password'] = bcrypt($input['password']);

            // Create new user
            $user = User::create($input);

            if ($user)
                return response()->json([
                    'message' => 'New User Added',
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getUser($id)
    {
        try {
            $user = User::find($id);

            if ($user)
                return response()->json([
                    'user' => $user,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function updateUser($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'name' => 'required|string|between:2,100',
                'email' => 'required|string|email|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $user = User::find($data->id);
            $user->name = $data->name;
            $user->email = $data->email;
            $user->save();

            if ($user)
                return response()->json([
                    'message' => 'User Info Updated',
                    'user' => $user,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::find($id);
            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully',
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
