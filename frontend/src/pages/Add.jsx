import React, { useContext, useEffect } from "react";
import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";
import upload from "../assets/upload image.jpg";
import { useState } from "react";
// import { authDataContext } from "../context/AuthContextAdmin";
import axios from "axios";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import NavAdmin from "../component/NavAdmin";
// import { shopDataContext } from "../context/shopDataContext";

function Add() {
  let [image1, setImage1] = useState(null);
  let [image2, setImage2] = useState(null);
  let [image3, setImage3] = useState(null);
  let [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [price, setPrice] = useState("");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // <-- Add this
  let serverUrl = "http://127.0.0.1:8000";
  // const { fetchProducts } = useContext(shopDataContext);

  const handleAddProduct = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!image1 || !image2 || !image3 || !image4) {
        alert("Please select all four images.");
        setLoading(false);
        return;
      }

      console.log(sizes);
      console.log(price);

      let formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("sub_category", subCategory);
      formData.append("best_seller", bestseller);
      sizes.forEach((size) => formData.append("size", size));
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);

      let result;
      if (editId) {
        // Update existing product
        result = await axios.patch(
          `${serverUrl}/api/products/update/${editId}/`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Add new product
        result = await axios.post(
          serverUrl + "/api/products/add/",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log(result.data);
      toast.success(
        editId ? "Product Updated Successfully" : "Product Added Successfully"
      );
      setLoading(false);

      if (result.data) {
        // fetchProducts(); // ✅ Refresh product list globally

        // Reset form states
        setName("");
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPrice("");
        setBestSeller(false);
        setCategory("Men");
        setSubCategory("TopWear");
        setSizes([]);
        setEditId(null); // Reset editId after update/add
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Product operation failed");
    }
  };

  // Restore product info from localStorage if editing
  useEffect(() => {
    const editProduct = localStorage.getItem("editProduct");
    if (editProduct) {
      try {
        const product = JSON.parse(editProduct);
        console.log("PPPPP:",product);

        setEditId(product.id || null); // <-- Store id for update
        setName(product.name || "");
        setDescription(product.description || "");
        setCategory(product.category || "Men");
        setSubCategory(product.sub_category || "TopWear");
        setPrice(product.price || "");
        setBestSeller(product.best_seller || false);
        // Set sizes from variants if available
        if (Array.isArray(product.variants)) {
          setSizes(product.variants.map((v) => v.size));
          // Set images as URLs for preview (cannot set as File objects)
          setImage1(
            product.variants[0]?.image1
              ? `${serverUrl}/${product.variants[0].image1}`
              : null
          );
          setImage2(
            product.variants[0]?.image2
              ? `${serverUrl}/${product.variants[0].image2}`
              : null
          );
          setImage3(
            product.variants[0]?.image3
              ? `${serverUrl}/${product.variants[0].image3}`
              : null
          );
          setImage4(
            product.variants[0]?.image4
              ? `${serverUrl}/${product.variants[0].image4}`
              : null
          );
        }
        // Remove editProduct from localStorage after loading
        localStorage.removeItem("editProduct");
      } catch (e) {
        // If parsing fails, just ignore
      }
    }
  }, []);

  return (
    <div className="w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] overflow-x-hidden relative">
      <NavAdmin />
      <Sidebar />
      <div className="w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute  right-0 bottom-[5%] ">
        <form
          onSubmit={handleAddProduct}
          action=""
          className="w-[100%] md:w-[90%] h-[100%]  mt-[70px] flex flex-col gap-[30px] py-[90px] px-[30px] md:px-[60px]"
        >
          <div className="w-[400px] h-[50px] text-[25px] md:text-[40px] text-white">
            Add Product Page
          </div>
          <div className="w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px]  gap-[10px] ">
            <p className="text-[20px] md:text-[25px]  font-semibold">
              Upload Images
            </p>

            <div className="w-[100%] h-[100%] flex items-center justify-start ">
              <label
                htmlFor="image1"
                className=" w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]"
              >
                <img
                  src={
                    !image1
                      ? upload
                      : typeof image1 === "string"
                      ? image1
                      : URL.createObjectURL(image1)
                  }
                  alt=""
                  className="w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]"
                />
                <input
                  type="file"
                  id="image1"
                  hidden
                  onChange={(e) => setImage1(e.target.files[0])}
                  required={!image1}
                />
              </label>
              <label
                htmlFor="image2"
                className=" w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]"
              >
                <img
                  src={
                    !image2
                      ? upload
                      : typeof image2 === "string"
                      ? image2
                      : URL.createObjectURL(image2)
                  }
                  alt=""
                  className="w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]"
                />
                <input
                  type="file"
                  id="image2"
                  hidden
                  onChange={(e) => setImage2(e.target.files[0])}
                  required={!image2}
                />
              </label>
              <label
                htmlFor="image3"
                className=" w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]"
              >
                <img
                  src={
                    !image3
                      ? upload
                      : typeof image3 === "string"
                      ? image3
                      : URL.createObjectURL(image3)
                  }
                  alt=""
                  className="w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]"
                />
                <input
                  type="file"
                  id="image3"
                  hidden
                  onChange={(e) => setImage3(e.target.files[0])}
                  required={!image3}
                />
              </label>
              <label
                htmlFor="image4"
                className=" w-[65px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]"
              >
                <img
                  src={
                    !image4
                      ? upload
                      : typeof image4 === "string"
                      ? image4
                      : URL.createObjectURL(image4)
                  }
                  alt=""
                  className="w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]"
                />
                <input
                  type="file"
                  id="image4"
                  hidden
                  onChange={(e) => setImage4(e.target.files[0])}
                  required={!image4}
                />
              </label>
            </div>
          </div>

          <div className="w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]">
            <p className="text-[20px] md:text-[25px]  font-semibold">
              Product Name
            </p>
            <input
              type="text"
              placeholder="Type here"
              className="w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] text-[18px] placeholder:text-[#ffffffc2]"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="w-[80%] flex items-start justify-center flex-col  gap-[10px]">
            <p className="text-[20px] md:text-[25px]  font-semibold">
              Product Description
            </p>
            <textarea
              type="text"
              placeholder="Type here"
              className="w-[600px] max-w-[98%] h-[100px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] py-[10px] text-[18px] placeholder:text-[#ffffffc2]"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>

          <div className="w-[80%]  flex items-center  gap-[10px] flex-wrap ">
            <div className="md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]">
              <p className="text-[20px] md:text-[25px]  font-semibold w-[100%]">
                Product Category
              </p>
              <select
                name=""
                id=""
                className="bg-slate-600 w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#46d1f7] border-[2px] "
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div className="md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col  gap-[10px]">
              <p className="text-[20px] md:text-[25px]  font-semibold w-[100%]">
                Sub-Category
              </p>
              <select
                name=""
                id=""
                className="bg-slate-600 w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#46d1f7] border-[2px] "
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="TopWear">Top Wear</option>
                <option value="BottomWear">Bottom Wear</option>
                <option value="WinterWear">Winter Wear</option>
                <option value="Combo">Outfit</option>
              </select>
            </div>
          </div>
          <div className="w-[80%] h-[100px] flex items-start justify-center flex-col  gap-[10px]">
            <p className="text-[20px] md:text-[25px]  font-semibold">
              Product Price
            </p>
            <input
              type="number"
              placeholder="₹ 2000"
              className="w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] text-[18px] placeholder:text-[#ffffffc2]"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap-[10px] py-[10px] md:py-[0px]">
            <p className="text-[20px] md:text-[25px]  font-semibold">
              Product Size
            </p>

            <div className="flex items-center justify-start gap-[15px] flex-wrap">
              <div
                className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${
                  sizes.includes("S")
                    ? "bg-green-400 text-black border-[#46d1f7]"
                    : ""
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("S")
                      ? prev.filter((item) => item !== "S")
                      : [...prev, "S"]
                  )
                }
              >
                S
              </div>

              <div
                className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${
                  sizes.includes("M")
                    ? "bg-green-400 text-black border-[#46d1f7]"
                    : ""
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("M")
                      ? prev.filter((item) => item !== "M")
                      : [...prev, "M"]
                  )
                }
              >
                M
              </div>

              <div
                className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${
                  sizes.includes("L")
                    ? "bg-green-400 text-black border-[#46d1f7]"
                    : ""
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("L")
                      ? prev.filter((item) => item !== "L")
                      : [...prev, "L"]
                  )
                }
              >
                L
              </div>

              <div
                className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${
                  sizes.includes("XL")
                    ? "bg-green-400 text-black border-[#46d1f7]"
                    : ""
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XL")
                      ? prev.filter((item) => item !== "XL")
                      : [...prev, "XL"]
                  )
                }
              >
                XL
              </div>

              <div
                className={`px-[20px] py-[7px] rounded-lg bg-slate-600 text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ${
                  sizes.includes("XXL")
                    ? "bg-green-400 text-black border-[#46d1f7]"
                    : ""
                }`}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XXL")
                      ? prev.filter((item) => item !== "XXL")
                      : [...prev, "XXL"]
                  )
                }
              >
                XXL
              </div>
            </div>
          </div>

          <div className="w-[80%] flex items-center justify-start gap-[10px] mt-[20px]">
            <input
              type="checkbox"
              id="checkbox"
              className="w-[25px] h-[25px] cursor-pointer"
              onChange={() => setBestSeller((prev) => !prev)}
            />
            <label
              htmlFor="checkbox"
              className="text-[18px] md:text-[22px]  font-semibold"
            >
              Add to BestSeller
            </label>
          </div>
          <button className="w-[140px] px-[20px] py-[20px] rounded-xl bg-[#65d8f7] flex items-center justify-center gap-[10px] text-black active:bg-slate-700 active:text-white active:border-[2px] border-white cursor-pointer">
            {loading ? <RingLoader color="#141414" size={32} /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;
