import { Text } from "@tremor/react";

const placeholder = Array.from({ length: 6 }, (_) => null);

export function EmptyPlaceholder({
  title,
  description,
  button,
}: {
  title: string;
  description: string | React.ReactNode;
  button?: React.ReactNode;
}) {
  return (
    <div className="relative mt-4 grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 max-h-96 max-lg:overflow-hidden">
      {placeholder.map((i) => (
        <div
          key={i}
          className="bg-gray-100 w-full h-52 rounded max-sm:first-of-type:rounded-b-none max-sm:even:rounded-t-none"
        ></div>
      ))}

      <div className="absolute -bottom-20 w-full h-full sm:h-80 bg-gradient-to-t from-white"></div>
      <div className="absolute max-sm:h-full sm:bottom-0 w-full grid place-items-center">
        <div className="max-sm:mt-10 text-center">
          <p className="font-medium">{title}</p>
          <Text className="mt-2">{description}</Text>
          {button && <div className="mt-6">{button}</div>}
        </div>
      </div>
    </div>
  );
}
