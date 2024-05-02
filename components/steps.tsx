import React from "react";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Steps({
  steps,
  isCanceled = false,
}: {
  steps: {
    name: string;
    description: string | React.ReactNode;
    status: "complete" | "current" | "upcoming";
  }[];
  isCanceled?: boolean;
}) {
  const isRed = (stepIdx: number) => isCanceled && stepIdx === steps.length - 1;

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}>
            {step.status === "complete" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className={classNames(
                      "absolute left-3 top-3 -ml-px h-full w-0.5",
                      isRed(stepIdx + 1) ? "bg-red-600" : "bg-emerald-600"
                    )}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span
                      className={classNames(
                        "relative z-10 flex h-6 w-6 items-center justify-center rounded-full",
                        isRed(stepIdx) ? "bg-red-600" : "bg-emerald-600"
                      )}
                    >
                      {isRed(stepIdx) ? (
                        <XMarkIcon className="h-4 w-4 text-white" aria-hidden="true" />
                      ) : (
                        <CheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{step.name}</span>
                    <span className="text-sm text-gray-500">{step.description}</span>
                  </span>
                </div>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute left-3 top-3 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true" />
                ) : null}
                <div className="group relative flex items-start" aria-current="step">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span
                      className={classNames(
                        "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white",
                        isRed(stepIdx) ? "border-red-600" : "border-emerald-600"
                      )}
                    >
                      <span
                        className={classNames(
                          "h-2.5 w-2.5 rounded-full",
                          isRed(stepIdx) ? "bg-red-600" : "bg-emerald-600"
                        )}
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span
                      className={classNames(
                        "text-sm font-medium",
                        isRed(stepIdx) ? "text-red-600" : "text-emerald-600"
                      )}
                    >
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500">{step.description}</span>
                  </span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute left-3 top-3 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true" />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-500">{step.name}</span>
                    <span className="text-sm text-gray-500">{step.description}</span>
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
