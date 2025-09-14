import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Coins.css";

const shopItems = [
  {
    id: 1,
    name: "Protein Powder",
    price: 50,
    img: "https://as1.ftcdn.net/v2/jpg/00/63/44/44/1000_F_63444460_WnpfzekqhLE8zB69kVD5Q5tJNcXiCcyZ.jpg",
  },
  {
    id: 2,
    name: "Skipping Rope",
    price: 20,
    img: "https://as1.ftcdn.net/v2/jpg/05/79/17/52/1000_F_579175283_TgaaQ6e90MtPOpOcGj2Q2bouPFuQ4CtF.webp",
  },
  {
    id: 3,
    name: "Dumbbells",
    price: 100,
    img: "https://i.pinimg.com/736x/0e/b9/f2/0eb9f271d8b2a55f34ebfd9a96dce3b0.jpg",
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 40,
    img: "https://www.vhv.rs/dpng/d/526-5261265_extra-thick-exercise-yoga-mat-with-carry-strap.png",
  },
];

export default function Coins() {
  const { token } = useAuth();
  const [coins, setCoins] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:8000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoins(res.data.coins || 0);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };

    fetchCoins();
  }, [token]);

  const handleBuy = (item) => {
    if (coins >= item.price) {
      alert(`You bought ${item.name} for ${item.price} flex coins!`);
      setCoins(coins - item.price);
    } else {
      alert("Not enough flex coins!");
    }
  };

  return (
    <div className="coins-page-container">
      <h2 className="coins-header">Total Flex Coins: {coins} 🪙</h2>

      {/* Want to Earn More? link */}
      <p className="earn-more-link" onClick={() => setShowPopup(true)}>
        💡 Want to earn more?
      </p>

      <div className="shop-container">
        {shopItems.map((item) => (
          <div key={item.id} className="shop-item">
            <img src={item.img} alt={item.name} className="shop-item-img" />
            <h3 className="shop-item-name">{item.name}</h3>
            <p className="shop-item-price">{item.price} 🪙</p>
            <button className="shop-item-btn" onClick={() => handleBuy(item)}>
              Buy
            </button>
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup-box"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside box
          >
            <h3>How to Earn Flex Coins</h3>
            <p>
              💪 Flex coins can be earned by completing your weekly tasks
              consistently.  
              ✅ Each completed task in a single week gives you <strong>10 flex coins</strong>!
            </p>
            <button className="popup-close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
