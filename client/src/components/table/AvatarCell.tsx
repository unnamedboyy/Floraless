"use client";

export default function AvatarCell({ name }: { name?: string }) {
  const display = name || "Unknown";

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
        {display.charAt(0)}
      </div>
      <span>{display}</span>
    </div>
  );
}