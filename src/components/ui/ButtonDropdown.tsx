import { Asins, Tld } from "../../types";
import { useEffect, useState } from "react";


export const ButtonDropDown = ({ asins, tld }: { asins?: Asins, tld: Tld }) => {
  const links = [
    { label: "Amazon", url: "https://amazon.com/product" },
    { label: "eBay", url: "https://ebay.com/product" },
    { label: "Walmart", url: "https://walmart.com/product" },
  ];

  const [amazonPrices, setAmazonPrices] = useState<{ asin: string; price: number }[]>([]);

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

  return (
    <div className="group relative h-full text-black">
      {amazonPrices.map(({ asin, price }, index) => (
        <a href={`https://amazon.${tld}/dp/${asin}`} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center justify-center hover:bg-gray-100" key={index}>
          <div key={index}>Amazon {price}</div>
        </a>
      ))}
    </div>
    /*  <div className="group relative h-full text-black">
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
     </div> */
  );
};

