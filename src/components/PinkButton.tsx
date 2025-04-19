"use client";

export const PinkButton = ({
  onClick,
  children,
  css,
}: {
  onClick: () => void;
  children: React.ReactNode;
  css?: string;
}) => {
  // Start with default classes
  let buttonClasses =
    "py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-medium rounded-lg shadow-md hover:from-pink-500 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 transform transition hover:scale-105 cursor-pointer";

  // Add w-full only if no custom width class is provided
  if (!css || !css.includes("w-")) {
    buttonClasses += " w-full";
  }

  // Add the custom classes at the end
  if (css) {
    buttonClasses += ` ${css}`;
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};
