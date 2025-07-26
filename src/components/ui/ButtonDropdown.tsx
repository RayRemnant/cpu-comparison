export const ButtonDropDown = () => {
  const links = [
    { label: "Amazon", url: "https://amazon.com/product" },
    { label: "eBay", url: "https://ebay.com/product" },
    { label: "Walmart", url: "https://walmart.com/product" },
  ];

  return (
    <div className="group relative h-full text-black">
      <button className="flex h-full items-center justify-center gap-2 text-nowrap rounded-lg border border-solid border-black transition last:pr-2 group-hover:rounded-b-none group-hover:border-b-0 group-hover:pb-px">
        <a
          href="https://example.com/product"
          target="_blank"
          rel="noopener noreferrer"
          className="pl-2"
        >
          Amazon
        </a>
        <div>
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="absolute inset-x-0 top-full z-50 hidden w-full overflow-hidden rounded-b-lg border border-t-0 border-solid border-black bg-white group-hover:block">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center hover:bg-gray-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </button>
    </div>
  );
};
