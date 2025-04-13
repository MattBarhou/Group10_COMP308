export default function Card({
  children,
  className = "",
  heading,
  subheading,
  footer,
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 ${className}`}
    >
      {(heading || subheading) && (
        <div className="border-b px-6 py-4 dark:border-gray-700">
          {heading && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {heading}
            </h3>
          )}
          {subheading && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && (
        <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">{footer}</div>
      )}
    </div>
  );
}
