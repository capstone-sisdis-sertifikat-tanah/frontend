export function Info({ title, description }: { title?: string; description?: string }) {
  return (
    <>
      {title && (
        <h4 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h4>
      )}
      {description && (
        <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">{description}</p>
      )}
    </>
  );
}
