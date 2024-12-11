"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Box } from "@mui/material";
import { login } from "@/api/loginApi";
import {router} from "next/client";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await login(data);
      if (response.status) {
        console.log("Login successful:", response.data);
        setTimeout(() => {
          setIsLoading(false);
          router.push("/cars");
        }, 4000);
      } else {
        setIsLoading(false);
        setApiError("Login failed: " + response);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setApiError(error.response.data?.message || "An unexpected error occurred.");
      } else {
        console.error("Unexpected error:", error);
        setApiError("An unexpected error occurred.");
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
      <Box className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full md:h-screen bg-white">
        <Typography variant="h4" className="mb-6 font-bold text-gray-900">Auto World</Typography>
        <Box className="w-full max-w-md bg-gray-100 rounded-lg shadow-lg p-6">
          <Typography variant="h5"   color="black" className="mb-5 text-gray-900" sx={{ marginBottom: 3 }}>
            Sign in to your account
          </Typography>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextField
                  type="email"
                  label="Your email"
                  variant="outlined"
                  fullWidth
                  required
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  className="mb-4"
              />
            </div>
            <div>
              <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                      message: "Password must be at least 8 characters long, include at least one special character, and be alphanumeric"
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  className="mb-4"
              />
            </div>
            {apiError && (
                <Typography color="error" variant="body2" className="text-center mb-2">
                  {apiError}
                </Typography>
            )}
            <Button
                disabled={isLoading}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Box>
      </Box>
  );
};

export default Login;
