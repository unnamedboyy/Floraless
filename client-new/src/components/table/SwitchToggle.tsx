"use client";

type Props = {
  checked: boolean;
  onChange: () => void;
};

export default function SwitchToggle({
  checked,
  onChange,
}: Props) {
  return (
    <button
      onClick={onChange}
      className={`
        relative
        w-12
        h-7
        rounded-full
        transition-all
        duration-300
        ${
          checked
            ? "bg-green-500"
            : "bg-gray-300"
        }
      `}
    >
      <div
        className={`
          absolute
          top-1
          w-5
          h-5
          rounded-full
          bg-white
          shadow-sm
          transition-all
          duration-300
          ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }
        `}
      />
    </button>
  );
}