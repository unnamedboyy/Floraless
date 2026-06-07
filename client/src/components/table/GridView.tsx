"use client";

type Props = {
  data: any[];
  renderItem?: (row: any) => React.ReactNode;
};

export default function GridView({
  data,
  renderItem,
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((row, i) => (
        <div key={i}>
          {renderItem ? (
            renderItem(row)
          ) : (
            <div className="bg-white border rounded-xl p-4">
              <pre className="text-xs">
                {JSON.stringify(row, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}