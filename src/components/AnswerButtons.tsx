"use client";

interface AnswerButtonsProps {
  disabled: boolean;
  /** Resposta escolhida (quando já respondida). */
  selected: boolean | null;
  onAnswer: (answer: boolean) => void;
}

const options = [
  { value: true, label: "Verdadeiro", hint: "V ou ←" },
  { value: false, label: "Falso", hint: "F ou →" },
];

export function AnswerButtons({ disabled, selected, onAnswer }: AnswerButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Sua resposta">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.label}
            type="button"
            disabled={disabled}
            aria-pressed={selected === null ? undefined : isSelected}
            onClick={() => onAnswer(option.value)}
            className={`flex min-h-16 flex-col items-center justify-center rounded-xl border-2 px-3 py-2 text-lg font-semibold transition ${
              isSelected
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-bg enabled:hover:border-accent"
            } disabled:cursor-not-allowed ${disabled && !isSelected ? "opacity-60" : ""}`}
          >
            {option.label}
            <span
              className={`text-xs font-normal ${isSelected ? "" : "text-muted"} hidden sm:block`}
              aria-hidden="true"
            >
              {option.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
