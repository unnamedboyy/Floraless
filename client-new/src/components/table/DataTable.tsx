"use client";

type Column = {
  label: string;
  key: string;

  render?: (
    value: any,
    row?: any
  ) => React.ReactNode;
};

type Action = {
  icon: React.ReactNode;

  onClick: (row: any) => void;

  show?: (row: any) => boolean;

  className?: string;
};

type Props = {
  columns: Column[];
  data: any[];
  actions?: Action[];
};

function getValue(
  obj: any,
  path: string
) {
  return path
    .split(".")
    .reduce(
      (acc, key) =>
        acc?.[key],
      obj
    );
}

export default function DataTable({
  columns,
  data,
  actions = [],
}: Props) {
  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-[10px]
        overflow-hidden
        shadow-sm
      "
    >

      {/* HEADER */}
      <div
        className="
          grid
          grid-cols-12
          border-b
          px-4
          py-3
          text-sm
          font-medium
          bg-zinc-900
          text-white
          rounded-t-[10px]
        "
      >

        {columns.map((col, i) => (
          <div
            key={i}
            className="col-span-2"
          >
            {col.label}
          </div>
        ))}

        {actions.length > 0 && (
          <div className="col-span-2 text-right">
            Action
          </div>
        )}

      </div>

      {/* BODY */}
      {data.map((row, i) => (

        <div
          key={i}
          className="
            grid
            grid-cols-12
            border-b
            border-gray-100
            px-5
            py-4
            text-sm
            items-center
            hover:bg-gray-50/60
            transition-colors
          "
        >

          {columns.map((col, j) => {

            const value =
              getValue(
                row,
                col.key
              );

            return (
              <div
                key={j}
                className="col-span-2"
              >

                {col.render
                  ? col.render(
                      value,
                      row
                    )
                  : value || "-"}

              </div>
            );
          })}

          {/* ACTION */}
          {actions.length > 0 && (

            <div
              className="
                col-span-2
                flex
                justify-end
                items-center
                gap-2
              "
            >

              {actions
                .filter((a) =>
                  a.show
                    ? a.show(row)
                    : true
                )
                .map((a, k) => (

                  <button
                    key={k}
                    onClick={() =>
                      a.onClick(row)
                    }
                    className={`
                      w-9
                      h-9
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      transition
                      hover:scale-105
                      ${a.className}
                    `}
                  >
                    {a.icon}
                  </button>

                ))}

            </div>

          )}

        </div>

      ))}

    </div>
  );
}