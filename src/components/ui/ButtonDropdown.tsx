import { Asins, Tld } from "../../types";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export const ButtonDropDown = ({ asins, tld }: { asins?: Asins, tld: Tld }) => {
  const [amazonPrices, setAmazonPrices] = useState<{ asin: string; price: number }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const x = async () => {
      if (!asins || !asins[tld] || asins[tld].length === 0) {
        return;
      }

      let popo = [];

      for (const asin of asins[tld]) {
        let response = await fetch("http://localhost:3000/api/amazon/getUniqueRecentDoc", {
          method: "POST",
          body: JSON.stringify({
            filter: {
              asin: asin,
              tld: tld,
            }
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.status == 200 && response.ok) {
          let amazonData = await response.json();

          if (amazonData?.[0]?.price) {
            popo.push({
              asin: asin,
              price: amazonData[0].price
            });
          }
        }
      }


      setAmazonPrices([...popo]);
    }

    x();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const primaryPrice = amazonPrices[0];
  const additionalPrices = amazonPrices.slice(1);
  const hasMultiplePrices = additionalPrices.length > 0;

  return (
    <div className="relative">
      {amazonPrices.length === 0 ? (
        // No prices available
        <button className="flex h-10 items-center justify-center px-4 text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed">
          No prices
        </button>
      ) : (
        // Prices available
        <div className="relative">
          <button
            onClick={() => hasMultiplePrices && setIsOpen(!isOpen)}
            className={`flex h-10 items-center justify-center gap-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${hasMultiplePrices ? 'cursor-pointer' : 'cursor-default'
              }`}
          >
            <a
              href={`https://amazon.${tld}/dp/${primaryPrice.asin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Amazon {formatPrice(primaryPrice.price)}
            </a>
            {hasMultiplePrices && (
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Dropdown menu */}
          {isOpen && hasMultiplePrices && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                {additionalPrices.map(({ asin, price }) => (
                  <a
                    key={asin}
                    href={`https://amazon.${tld}/dp/${asin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>Amazon</span>
                    <span className="font-medium text-blue-600">{formatPrice(price)}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

