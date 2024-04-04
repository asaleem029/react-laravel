<?php

namespace App\Http\Controllers;

use App\Http\Services\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function index()
    {
        return $this->commentService->CommentsList();
    }

    public function store(Request $request)
    {
        return $this->commentService->createComment($request);
    }

    public function show($id)
    {
        return $this->commentService->getComment($id);
    }

    public function update(Request $request)
    {
        return $this->commentService->updateComment($request);
    }

    public function destroy($id)
    {
        return $this->commentService->deleteComment($id);
    }
}
