import { ArrowRight } from "lucide-react";
import { onboardingSteps } from "@/lib/dashboard-data";

export function OnboardingSteps() {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Como começar</h2>
      <p className="text-sm text-slate-500">Siga estes passos para começar a usar o sistema</p>

      <ol className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {onboardingSteps.map((step, index) => (
          <li key={step.title} className="relative flex flex-col items-center text-center">
            {index < onboardingSteps.length - 1 && (
              <ArrowRight
                className="absolute -right-5 top-6 hidden h-4 w-4 text-slate-300 lg:block"
                aria-hidden="true"
              />
            )}
            <div className="relative">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${step.iconClassName}`}
                aria-hidden="true"
              >
                <step.icon className="h-6 w-6" />
              </span>
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white ring-2 ring-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
