import React, { useState, useEffect } from "react";
import Link from "next/link";
import {AiOutlineShopping} from "react-icons/ai";
import { Cart } from "./";

import { useStateContext } from "../../context/StateContext";

const NavBar = () => {
  const { showCart, setShowCart, totalQuantities, userInfo, setUserInfo, logoutUser } = useStateContext();

return (
<div className="navbar-container">
    <div className="company-name">
        <Link href="/">Things For Sale</Link>
        <div className="navbar" logo="true">
            {userInfo?.isAdmin ? (
                <>
                    <Link href="/products/manage">Manage Products</Link>
                    <Link href="/orders/manage">Manage Orders</Link>
                </> ) : (
                <>
                    <Link href="/">Home</Link>
                    <Link href="/shop">Shop</Link>
                    <Link href="/villas">Villas</Link>
                    <Link href="/appartements">Appartements</Link>
                    <Link href="/antiques">Antiques</Link>
                    <Link href="/clothes">Clothes</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/about">About</Link>
                </>
            )}
            {userInfo ? (
                <button onClick={logoutUser} style={{ color: "red" , border: "none", background: "transparent", cursor: "pointer" }}>
                    Logout
                </button>
            ) : (
                <>
                    <Link href="/users/login">
                        <button style={{ color: "red", border: "none", background: "transparent", cursor: "pointer" }}>
                            Login
                        </button>
                    </Link>
                    <Link href="/users/register">
                        <button style={{color: "red", border: "none", background: "transparent", cursor: "pointer" }}>
                            Register
                        </button>

                    </Link>
                </>
             )}
            
            <button  type="button"   className="cart-icon"  onClick={() => setShowCart(true)}>
                <AiOutlineShopping />
                <span className="cart-item-qty">{totalQuantities}</span>
            </button>
            {showCart && <Cart />}
        </div>
    </div>
</div>
);

}
export default NavBar;
