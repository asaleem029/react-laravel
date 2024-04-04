<?php

namespace App\Http\Services;

use App\Models\Feedback;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FeedbackService
{
    public function feedbacksList()
    {
        try {
            $feedbacks = Feedback::all();

            foreach ($feedbacks as $f) {
                $f->user_name = $f->user->name;
            }

            if ($feedbacks)
                return response()->json([
                    'feedbacks' => $feedbacks,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function createFeedback($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'title' => 'required|string|max:100',
                'description' => 'required|string|max:100',
                'category' => 'required|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $input = $data->all();
            $input['user_id'] = Auth::id();

            // Create new user
            $feedback = Feedback::create($input);

            if ($feedback)
                return response()->json([
                    'message' => 'New Feedback Added',
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getFeedback($id)
    {
        try {
            $feedback = Feedback::find($id);
            $feedback->comments = $feedback->comments;

            foreach($feedback->comments as $fc) {
                $fc->user_name=  $fc->user->name;
            }

            if ($feedback)
                return response()->json([
                    'feedback' => $feedback,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function updateFeedback($data)
    {
        try {
            // Validate request
            $validator = Validator::make($data->all(), [
                'title' => 'required|string|max:100',
                'description' => 'required|string|max:100',
                'category' => 'required|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }

            $feedback = Feedback::find($data->id);
            $feedback->title = $data->title;
            $feedback->description = $data->description;
            $feedback->category = $data->category;
            $feedback->user_id = Auth::id();
            $feedback->save();

            if ($feedback)
                return response()->json([
                    'message' => 'Feedback Info Updated',
                    'feedback' => $feedback,
                ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function deleteFeedback($id)
    {
        try {
            $feedback = Feedback::find($id);
            $feedback->delete();

            return response()->json([
                'message' => 'Feedback deleted successfully',
            ], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
