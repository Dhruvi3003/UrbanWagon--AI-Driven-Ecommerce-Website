import React, { useContext, useEffect, useState, useMemo } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Title from "../component/Title";
import { shopDataContext } from "../context/ShopContext";
import Card from "../component/Card";

function Collections() {
  let [showFilter, setShowFilter] = useState(false);
  let { products = [], search, showSearch } = useContext(shopDataContext); // ✅ Default to empty array

  let [filterProduct, setFilterProduct] = useState([]);
  let [category, setCaterory] = useState([]);
  let [subCategory, setSubCaterory] = useState([]);
  let [sortType, SetSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCaterory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCaterory((prev) => [...prev, e.target.value]);
    }
  };

  useEffect(()=>{
    console.log(products);
    
  },[])

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCaterory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCaterory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productCopy = Array.isArray(products) ? products.slice() : [];

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.sub_category)
      );
    }
    setFilterProduct(productCopy);
  };

  const sortProducts = (e) => {
    let fbCopy = filterProduct.slice();

    switch (sortType) {
      case "low-high":
        setFilterProduct(fbCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProduct(fbCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const filtered = useMemo(() => {
  let result = [...products];

  if (showSearch && search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category.length > 0) {
    result = result.filter((p) => category.includes(p.category));
  }

  if (subCategory.length > 0) {
    result = result.filter((p) => subCategory.includes(p.sub_category));
  }

  if (sortType === "low-high") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortType === "high-low") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}, [products, category, subCategory, search, showSearch, sortType]);

// and render `filtered.map(...)` instead of `filterProduct.map(...)`


  // useEffect(() => {
  //   setFilterProduct(products);
  // }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row items-start justify-start pt-[70px] overflow-x-hidden z-[2] pb-[110px]">
      {/* Sidebar/Filters */}
      <div
        className={`w-full md:w-[30vw] lg:w-[20vw] md:min-h-[100vh] ${
          showFilter ? "h-auto" : "h-[8vh]"
        } p-3 sm:p-5 md:pr-0 text-[#aaf5fa] bg-transparent md:bg-transparent mt-[10px] animate-fadeIn`}
      >
        <p
          className="text-[22px] sm:text-[25px] font-semibold flex gap-2 items-center justify-between md:justify-start cursor-pointer select-none"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          FILTERS
          {!showFilter && <FaChevronRight className="text-[18px] md:hidden" />}
          {showFilter && <FaChevronDown className="text-[18px] md:hidden" />}
        </p>
        {/* Categories */}
        <div
          className={`border-2 border-[#dedcdc] pl-3 sm:pl-5 py-2 sm:py-3 mt-4 sm:mt-6 rounded-md bg-slate-600 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <p className="text-[16px] sm:text-[18px] text-[#f8fafa]">
            CATEGORIES
          </p>
          <div className="w-full max-w-[300px] min-h-[90px] flex flex-col gap-2 sm:gap-3 mt-2">
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"Men"}
                className="w-3 h-3"
                onChange={toggleCategory}
              />{" "}
              Men
            </p>
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"Women"}
                className="w-3 h-3"
                onChange={toggleCategory}
              />{" "}
              Women
            </p>
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"Kids"}
                className="w-3 h-3"
                onChange={toggleCategory}
              />{" "}
              Kids
            </p>
          </div>
        </div>
        {/* Subcategories */}
        <div
          className={`border-2 border-[#dedcdc] pl-3 sm:pl-5 py-2 sm:py-3 mt-4 sm:mt-6 rounded-md bg-slate-600 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <p className="text-[16px] sm:text-[18px] text-[#f8fafa]">
            SUB-CATEGORIES
          </p>
          <div className="w-full max-w-[340px] min-h-[120px] max-h-[220px] flex flex-col gap-2 sm:gap-3 mt-2 overflow-y-auto pr-2">
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"TopWear"}
                className="w-3 h-3"
                onChange={toggleSubCategory}
              />{" "}
              TopWear
            </p>
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"BottomWear"}
                className="w-3 h-3"
                onChange={toggleSubCategory}
              />{" "}
              BottomWear
            </p>
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"WinterWear"}
                className="w-3 h-3"
                onChange={toggleSubCategory}
              />{" "}
              WinterWear
            </p>
            <p className="flex items-center gap-2 text-[15px] sm:text-[16px] font-light">
              <input
                type="checkbox"
                value={"Combo"}
                className="w-3 h-3"
                onChange={toggleSubCategory}
              />{" "}
              Outfit Set
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 w-full md:w-[70vw] lg:pl-0 md:py-2 px-2 sm:px-6">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center lg:px-[50px] gap-4 mt-2">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            className="bg-slate-600 w-full max-w-[220px] h-[44px] px-2 text-white rounded-lg hover:border-[#46d1f7] border-2 mt-2 lg:mt-0"
            onChange={(e) => SetSortType(e.target.value)}
          >
            <option value="relavent">Sort By: Relavent</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>
        <div className="w-full min-h-[70vh] flex items-center justify-center flex-wrap gap-4 sm:gap-6 mt-4">
          {filterProduct.map((item, index) => (
            <div key={index} className="animate-fadeIn">
              <Card
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.variants[0].image1}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}

export default Collections;
