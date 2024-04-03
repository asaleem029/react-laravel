import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Dashboard from "../Dashboard/Dashboard";
import User from "../User/User";
import Login from "../Login/Login";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoutes";
import UserCreateForm from "../User/UserCreateForm";
import UserEditForm from "../User/UserEditForm";
import UserRegistrationForm from "../UserRegistration/UserRegistrationForm";
import Feedback from "../Feedback/feedback";
import FeedbackCreateForm from "../Feedback/feedbackCreateForm";
import FeedbackEditForm from "../Feedback/feedbackEditForm";

const AppRoutes = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="users" element={<User />} />
            <Route path="new-user" element={<UserCreateForm />} />
            <Route path="user-edit/:id" element={<UserEditForm />} />
            
            <Route path="feedbacks" element={<Feedback />} />
            <Route path="new-feedback" element={<FeedbackCreateForm />} />
            <Route path="feedback-edit/:id" element={<FeedbackEditForm />} />
          </Route>
          
          <Route path="user-registration" element={<UserRegistrationForm />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;
