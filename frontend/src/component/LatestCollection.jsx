import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";
function LatestCollection() {
  let { products = [] } = useContext(shopDataContext); // ✅ Default to empty array

  let [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const sliced = products.slice(0, 8);
    // Only set state if it's actually different
    if (JSON.stringify(sliced) !== JSON.stringify(latestProducts)) {
      setLatestProducts(sliced);
    }
  }, [products]);

  return (
    <div>
      <div className="h-[8%] w-[100%] text-center md:mt-[50px]  ">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100 ">
          Step Into Style – New Collection Dropping This Season!
        </p>
      </div>
      <div className="w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]">
        {latestProducts.map((item, index) => (
          // <Card
          //   key={index}
          //   name={item.name}
          //   image={`${item.variants[0].image1}`}
          //   id={item._id}
          //   price={item.price}
          // />
          <Card
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.variants[0].image1}
            />
        ))}
      </div>
    </div>
  );
}

export default LatestCollection;
