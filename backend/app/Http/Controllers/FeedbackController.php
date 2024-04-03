<?php

namespace App\Http\Controllers;

use App\Http\Services\FeedbackService;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(FeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    public function index()
    {
        return $this->feedbackService->feedbacksList();
    }
    
    public function store(Request $request)
    {
        return $this->feedbackService->createfeedback($request);
    }

    public function show($id)
    {
        return $this->feedbackService->getfeedback($id);
    }

    public function update(Request $request)
    {
        return $this->feedbackService->updatefeedback($request);
    }

    public function destroy($id) {
        return $this->feedbackService->deletefeedback($id);
    }
}
