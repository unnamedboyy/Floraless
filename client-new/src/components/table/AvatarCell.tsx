"use client";

export default function AvatarCell({ name }: { name?: string }) {
  const safeName =
    name && typeof name === "string" && name.length > 0
      ? name
      : "User";

  return (
    <div className="flex items-center gap-2">
      
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
        {safeName.charAt(0).toUpperCase()}
      </div>

      <span>{safeName}</span>
    </div>
  );
}