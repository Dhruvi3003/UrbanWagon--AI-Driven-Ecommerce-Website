import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../component/RelatedProduct";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
function ProductDetail() {
  let { productId } = useParams();
  let { products, currency, addtoCart } = useContext(shopDataContext);
  let [productData, setProductData] = useState(false);

  const serverUrl = "http://127.0.0.1:8000";

  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  // const [size, setSize] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const [loading, setLoading] = useState(false);
  const fetchProductData = () => {
    console.log("product detail page", products);
    products.forEach((element) => {
      // console.log(element);

      if (element.id == productId) {
        setProductData(element);
        console.log("element",element.variants);
        for (let i = 0; i < element.variants.length; i++) {
          setImage(element.variants[i].image1);
          setImage1(element.variants[i].image2);
          setImage2(element.variants[i].image3);
          setImage3(element.variants[i].image4);
          setImage4(element.variants[i].image1);
          
        }
        // setImage1(element.variants.image1);
        // setImage2(element.variants.image2);
        // setImage3(element.variants.image3);
        // setImage4(element.variants.image4);
        // setImage(element.variants.image1);
      }
    });
  };
  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    setLoading(true);
    try {
      addtoCart(productData.id, selectedSize);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
    setLoading(false);
  };

  return productData ? (
    <div>
      <div className=" w-[99vw] h-[130vh] md:h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-start flex-col lg:flex-row gap-[20px]">
        <div className="lg:w-[50vw] md:w-[90vw] lg:h-[90vh] h-[50vh] mt-[70px] flex items-center justify-center md:gap-[10px] gap-[30px] flex-col-reverse lg:flex-row">
          <div className="lg:w-[20%] md:w-[80%] h-[10%] lg:h-[80%] flex items-center justify-center gap-[50px] lg:gap-[20px] lg:flex-col flex-wrap ">
            <div className="md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-slate-300 border-[1px] border-[#80808049] rounded-md">
              <img
                src={`${serverUrl}/${image1}`}
                alt=""
                className="w-[100%] h-[100%]  cursor-pointer rounded-md"
                onClick={() => setImage(image1)}
              />
            </div>
            <div className="md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-slate-300 border-[1px] border-[#80808049] rounded-md">
              <img
                src={`${serverUrl}/${image2}`}
                alt=""
                className="w-[100%] h-[100%]  cursor-pointer rounded-md"
                onClick={() => setImage(image2)}
              />
            </div>
            <div className="md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-slate-300 border-[1px] border-[#80808049] rounded-md">
              <img
                src={`${serverUrl}/${image3}`}
                alt=""
                className="w-[100%] h-[100%]  cursor-pointer rounded-md"
                onClick={() => setImage(image3)}
              />
            </div>
            <div className="md:w-[100px]  w-[50px] h-[50px] md:h-[110px] bg-slate-300 border-[1px] border-[#80808049] rounded-md">
              <img
                src={`${serverUrl}/${image4}`}
                alt=""
                className="w-[100%] h-[100%]  cursor-pointer rounded-md"
                onClick={() => setImage(image4)}
              />
            </div>
          </div>
          <div className="lg:w-[60%] w-[80%] lg:h-[78%] h-[70%] border-[1px] border-[#80808049] rounded-md  overflow-hidden">
            <img
              src={`${serverUrl}/${image}`}
              alt=""
              className=" w-[100%] lg:h-[100%] h-[100%] text-[30px] text-white  text-center rounded-md object-fill "
            />
          </div>
        </div>
        <div className="lg:w-[50vw] w-[100vw] lg:h-[75vh] h-[40vh] lg:mt-[80px] flex items-start justify-start flex-col py-[20px] px-[30px] md:pb-[20px] md:pl-[20px] lg:pl-[0px] lg:px-[0px] lg:py-[0px] gap-[10px]">
          <h1 className="text-[40px] font-semibold text-[aliceblue]">
            {productData.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-1 ">
            <FaStar className="text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[20px] fill-[#FFD700]" />
            <FaStarHalfAlt className="text-[20px] fill-[#FFD700]" />
            <p className="text-[18px] font-semibold pl-[5px] text-[white]">
              (124)
            </p>
          </div>
          <p className="text-[30px] font-semibold pl-[5px] text-[white]">
            {currency} {productData.price}
          </p>
          <p className=" w-[80%] md:w-[60%] text-[20px] font-semibold pl-[5px] text-[white]">
            {productData.description} Stylish, breathable cotton shirt with a
            modern slim fit. Easy to wash, super comfortable, and designed for
            effortless style.
          </p>
          <div className="flex flex-col gap-[10px] my-[10px] ">
            <p className="text-[25px] font-semibold pl-[5px] text-[white]">
              Select Size
            </p>
            <select
              value={selectedSize || ""}
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedSize(selected);
                const variant = productData.variants.find(
                  (v) => v.size === selected
                );
                if (variant) {
                  setSelectedVariantId(variant.id);
                }
              }}
              className="w-[180px] px-[12px] py-[10px] text-[16px] rounded-md bg-[#ffffff] text-black cursor-pointer border border-gray-400 focus:outline-none"
            >
              <option value="" disabled>
                -- Select a size --
              </option>
              {productData.variants.map((variant) => (
                <option key={variant.id} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </select>

            <button
              className="text-[16px] active:bg-slate-500 cursor-pointer bg-[#495b61c9] py-[10px] px-[20px] rounded-2xl mt-[10px] border-[1px] border-[#80808049] text-white shadow-md shadow-black"
              onClick={handleAddToCart}
            >
              {loading ? <RingLoader color="#fff" size={28} /> : "Add to Cart"}
            </button>
          </div>
          {/* <div className="w-[90%] lg:w-[90%] h-[2px] bg-slate-700"></div> */}
          <div className="w-[80%] text-[16px] text-white mt-[10px] ">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product</p>
            <p>East return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      <div className="w-[100%] min-h-[70vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-start justify-start flex-col  overflow-x-hidden">
        <div className="flex px-[20px] mt-[90px] lg:ml-[80px] ml-[0px]  lg:mt-[0px]  ">
          <p className="border px-5 py-3 text-sm text-white">Description</p>
          <p className="border px-5 py-3 text-sm text-white">Reviews (124)</p>
        </div>
        <div className="w-[80%] md:h-[150px] h-[220px] bg-[#3336397c] border text-white text-[13px] md:text-[15px] lg:text-[20px] px-[10px] md:px-[30px] lg:ml-[100px] ml-[20px]">
          <p className="w-[95%] h-[90%] flex items-center justify-center ">
            Upgrade your wardrobe with this stylish slim-fit cotton shirt,
            available now on OneCart. Crafted from breathable, high-quality
            fabric, it offers all-day comfort and effortless style. Easy to
            maintain and perfect for any setting, this shirt is a must-have
            essential for those who value both fashion and function.
          </p>
        </div>
        <RelatedProduct
          category={productData.category}
          subCategory={productData.sub_category}
          currentProductId={productData.id}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}

export default ProductDetail;
