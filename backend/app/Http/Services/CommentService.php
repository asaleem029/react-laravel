<?php

namespace App\Http\Services;

use App\Models\Comment;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentService
{
    public function CommentsList()
    {
        try {
            $comments = Comment::all();

            if ($comments)
                return response()->json([
                    'comments' => $comments,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function createComment($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'comment' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $input = $data->all();
            $input['user_id'] = Auth::id();

            // Create new comment
            $comment = Comment::create($input);
            $commentList = $comment->feedback->comments;

            foreach($commentList as $comment) {
                $comment->user_name = $comment->user->name;
            }

            if ($comment)
                return response()->json([
                    'message' => 'Comment Added',
                    'comment' => $comment,
                    'commentsList' => $commentList
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getComment($id)
    {
        try {
            $comment = Comment::find($id);

            if ($comment)
                return response()->json([
                    'comment' => $comment,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function updateComment($data, $comment)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'comment' => 'required|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $comment = Comment::find($comment->id);
            if ($comment) {
                $comment->comment = $data->comment;
                $comment->feedback_id = $comment->feedback_id;
                $comment->user_id = Auth::id();

                if ($comment->save())
                    return response()->json([
                        'message' => 'Comment Updated',
                        'comment' => $comment,
                        'commentsList' => $comment->feedback->comments
                    ], 200);
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function deleteComment($id)
    {
        try {
            $comment = Comment::find($id);
            $comment->delete();

            return response()->json([
                'message' => 'Comment deleted',
            ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
