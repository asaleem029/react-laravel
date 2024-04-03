<?php

namespace App\Http\Controllers;

use App\Http\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        return $this->userService->usersList();
    }
    
    public function store(Request $request)
    {
        return $this->userService->createUser($request);
    }

    public function show($id)
    {
        return $this->userService->getUser($id);
    }

    public function update(Request $request)
    {
        return $this->userService->updateUser($request);
    }

    public function destroy($id) {
        return $this->userService->deleteUser($id);
    }
}
