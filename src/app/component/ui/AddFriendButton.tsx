"use client";

import { FC, useState } from "react";
import Button from "./Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", validatedEmail);
      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", {
          type: "manual",
          message: error.message,
        });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", {
          type: "manual",
          message: error.response?.data || "Failed to send request.",
        });
        return;
      }

      setError("email", {
        type: "manual",
        message: "Something went wrong",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    setShowSuccessState(false); // Reset success state on new submit
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>
      {errors.email && (
        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
      )}
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendButton;
