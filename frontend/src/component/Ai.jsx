import React, { useContext, useState } from "react";
import ai from "../assets/ai.png";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import open from "../assets/open.mp3";
import { userDataContext } from "../context/UserContext";
function Ai() {
  let { showSearch, setShowSearch, products, cartItem } =
    useContext(shopDataContext);
  let { userData } = useContext(userDataContext);
  let navigate = useNavigate();
  let [activeAi, setActiveAi] = useState(false);
  let openingSound = new Audio(open);

  function speak(message) {
    let utterence = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterence);
  }

  const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();
  if (!recognition) {
    console.log("not supported");
  }

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim().toLowerCase();
    // Greetings
    if (
      [
        "hello",
        "hi",
        "hii",
        "hey",
        "good morning",
        "good evening",
        "good afternoon",
      ].some((greet) => transcript.includes(greet))
    ) {
      if (userData && userData.name) {
        speak(`Hello, ${userData.name}! Welcome back to UrbanWagon.`);
      } else {
        speak("Hello! Welcome to UrbanWagon.");
      }
      return;
    }
    // Order Status
    if (
      transcript.includes("track my order") ||
      transcript.includes("where is my order") ||
      transcript.includes("order status")
    ) {
      speak("Opening your orders page");
      navigate("/order");
      return;
    }
    // Cart Summary
    if (
      transcript.includes("what's in my cart") ||
      transcript.includes("cart summary")
    ) {
      let items = [];
      for (const itemId in cartItem) {
        for (const size in cartItem[itemId]) {
          if (cartItem[itemId][size] > 0) {
            let product = products.find((p) => p._id === itemId);
            if (product) {
              items.push(
                `${cartItem[itemId][size]} ${product.name} size ${size}`
              );
            }
          }
        }
      }
      if (items.length > 0) {
        speak(`You have ${items.join(", ")}`);
      } else {
        speak("Your cart is empty.");
      }
      return;
    }
    if (
      transcript.includes("search") &&
      transcript.includes("open") &&
      !showSearch
    ) {
      speak("opening search");
      setShowSearch(true);
      navigate("/collection");
    } else if (
      transcript.includes("search") &&
      transcript.includes("close") &&
      showSearch
    ) {
      speak("closing search");
      setShowSearch(false);
    } else if (
      transcript.includes("collection") ||
      transcript.includes("collections") ||
      transcript.includes("product") ||
      transcript.includes("products")
    ) {
      speak("opening collection page");
      navigate("/collection");
    } else if (
      transcript.includes("about") ||
      transcript.includes("aboutpage")
    ) {
      speak("opening about page");
      navigate("/about");
      setShowSearch(false);
    } else if (transcript.includes("home") || transcript.includes("homepage")) {
      speak("opening home page");
      navigate("/");
      setShowSearch(false);
    } else if (
      transcript.includes("cart") ||
      transcript.includes("kaat") ||
      transcript.includes("caat")
    ) {
      speak("opening your cart");
      navigate("/cart");
      setShowSearch(false);
    } else if (transcript.includes("contact")) {
      speak("opening contact page");
      navigate("/contact");
      setShowSearch(false);
    } else if (
      transcript.includes("order") ||
      transcript.includes("myorders") ||
      transcript.includes("orders") ||
      transcript.includes("my order")
    ) {
      speak("opening your orders page");
      navigate("/order");
      setShowSearch(false);
    } else {
      toast.error("Try Again");
    }
  };
  recognition.onend = () => {
    setActiveAi(false);
  };
  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] "
      onClick={() => {
        recognition.start();
        openingSound.play();
        setActiveAi(true);
      }}
    >
      <img
        src={ai}
        alt=""
        className={`w-[100px] cursor-pointer ${
          activeAi
            ? "translate-x-[10%] translate-y-[-10%] scale-125 "
            : "translate-x-[0] translate-y-[0] scale-100"
        } transition-transform`}
        style={{
          filter: ` ${
            activeAi
              ? "drop-shadow(0px 0px 30px #00d2fc)"
              : "drop-shadow(0px 0px 20px black)"
          }`,
        }}
      />
    </div>
  );
}

export default Ai;
