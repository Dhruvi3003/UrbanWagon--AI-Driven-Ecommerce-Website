import React, { useContext, useState, useMemo } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Title from "../component/Title";
import { shopDataContext } from "../context/ShopContext";
import Card from "../component/Card";
import Footer from "../component/Footer";

function Collections() {
  let [showFilter, setShowFilter] = useState(false);
  let { products = [], search, showSearch } = useContext(shopDataContext);

  let [category, setCategory] = useState([]);
  let [subCategory, setSubCategory] = useState([]);
  let [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

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

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col lg:flex-row items-start justify-start pt-[80px] pb-[110px] gap-6 px-2 sm:px-6">
      {/* Sidebar/Filters */}
      <div
        className={`w-full lg:w-[20%] ${
          showFilter ? "h-auto" : "h-[8vh]"
        } p-4 text-[#aaf5fa] bg-transparent animate-fadeIn`}
      >
        <p
          className="text-[22px] sm:text-[25px] font-semibold flex gap-2 items-center justify-between lg:justify-start cursor-pointer select-none"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          FILTERS
          {!showFilter && <FaChevronRight className="text-[18px] lg:hidden" />}
          {showFilter && <FaChevronDown className="text-[18px] lg:hidden" />}
        </p>
        {/* Categories */}
        <div
          className={`border-2 border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${
            showFilter ? "" : "hidden"
          } lg:block`}
        >
          <p className="text-[18px] text-[#f8fafa]">CATEGORIES</p>
          <div className="flex flex-col gap-3 mt-2">
            {["Men", "Women", "Kids"].map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-[16px]">
                <input
                  type="checkbox"
                  value={cat}
                  className="w-3 h-3"
                  onChange={toggleCategory}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>
        {/* Subcategories */}
        <div
          className={`border-2 border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${
            showFilter ? "" : "hidden"
          } lg:block`}
        >
          <p className="text-[18px] text-[#f8fafa]">SUB-CATEGORIES</p>
          <div className="flex flex-col gap-3 mt-2 max-h-[220px] overflow-y-auto pr-2">
            {["TopWear", "BottomWear", "WinterWear", "Combo"].map((sub) => (
              <label key={sub} className="flex items-center gap-2 text-[16px]">
                <input
                  type="checkbox"
                  value={sub}
                  className="w-3 h-3"
                  onChange={toggleSubCategory}
                />
                {sub === "Combo" ? "Outfit Set" : sub}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full lg:w-[80%]">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            className="bg-slate-600 w-full max-w-[220px] h-[44px] px-2 text-white rounded-lg border-2"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relavent">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        {/* Products */}
        <div className="w-full min-h-[70vh] flex items-center justify-center flex-wrap gap-6 mt-6">
          {filtered.length === 0 ? (
            <p className="text-white text-lg">No products found.</p>
          ) : (
            filtered.map((item, index) => (
              <div key={index} className="animate-fadeIn">
                <Card
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.variants[0].image1}
                />
              </div>
            ))
          )}
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
