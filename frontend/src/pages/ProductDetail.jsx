import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../component/RelatedProduct";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [images, setImages] = useState([]); // 👈 holds image1..image4
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(false);

  const serverUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const prod = products.find((p) => String(p.id) === String(productId));
    if (prod) {
      setProductData(prod);
      if (prod.variants.length > 0) {
        const firstVariant = prod.variants[0];
        const imgs = [
          firstVariant.image1,
          firstVariant.image2,
          firstVariant.image3,
          firstVariant.image4,
        ].filter(Boolean); // remove null/empty
        setImages(imgs);
        setActiveImage(imgs[0]);
      }
    }
  }, [productId, products]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const variant = productData.variants.find((v) => v.size === size);
    if (variant) {
      setSelectedVariantId(variant.id);
      const imgs = [
        variant.image1,
        variant.image2,
        variant.image3,
        variant.image4,
      ].filter(Boolean);
      setImages(imgs);
      setActiveImage(imgs[0]);
    }
  };

  const handleAddToCart = () => {
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

  if (!productData) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-gradient-to-l from-[#141414] to-[#0c2025]">
        <RingLoader color="#fff" size={60} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center text-white">
      {/* Product Section */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10 py-16 px-6 md:px-12 mt-20">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
            {images.map((img, i) => (
              <img
                key={i}
                src={`${serverUrl}/${img}`}
                alt="thumb"
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-600 cursor-pointer hover:opacity-80"
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 order-1 lg:order-2 border border-gray-600 rounded-lg overflow-hidden">
            <img
              src={`${serverUrl}/${activeImage}`}
              alt={productData.name}
              className="w-full h-full object-contain bg-black/20"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{productData.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStarHalfAlt className="text-yellow-400" />
            <span className="ml-2 text-sm text-gray-300">(124)</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold">
            {currency} {productData.price}
          </p>

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="mt-4">
            <label className="block text-lg mb-2 font-semibold">Select Size</label>
            <select
              value={selectedSize || ""}
              onChange={(e) => handleSizeChange(e.target.value)}
              className="w-48 px-4 py-2 rounded-md bg-white text-black border border-gray-400 focus:outline-none"
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
          </div>

          {/* Add to Cart Button */}
          <button
            className="mt-4 w-48 py-3 rounded-2xl bg-[#2d3b3f] border border-gray-500 shadow-md hover:bg-[#3d4b4f] transition"
            onClick={handleAddToCart}
          >
            {loading ? <RingLoader color="#fff" size={24} /> : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="w-full max-w-6xl mt-10 px-6 md:px-12">
        <div className="flex gap-6 border-b border-gray-600 pb-2">
          <button className="px-4 py-2 text-sm border border-gray-500 rounded-md">
            Description
          </button>
          <button className="px-4 py-2 text-sm border border-gray-500 rounded-md">
            Reviews (124)
          </button>
        </div>
        <div className="mt-6 bg-[#1d1f20] p-6 rounded-lg border border-gray-700">
          <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm md:text-base">
            <li>100% Original Product.</li>
            <li>Cash on delivery is available on this product.</li>
            <li>Easy return and exchange policy within 7 days.</li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      <div className="w-full max-w-7xl px-6 md:px-12 mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <RelatedProduct
          category={productData.category}
          subCategory={productData.sub_category}
          currentProductId={productData.id}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
