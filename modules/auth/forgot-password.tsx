import { TextInput } from "@tremor/react";
import React from "react";

export default function ForgotPasswordForm() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center pb-16 pt-12">
      <div className="max-w-sm">
        <h1 className="mb-2 text-center text-md font-semibold text-gray-900">Reset your password</h1>
        <p className="mb-2 text-center text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>
      <div className="w-full mx-auto max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mt-6">
            <label
              htmlFor="email"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Email address
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              placeholder=""
              autoComplete="off"
              className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
            />
          </div>
          <button
            type="submit"
            className="mt-4 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis w-full"
          >
            Reset your password
          </button>
        </form>
      </div>
    </div>
  );
}
