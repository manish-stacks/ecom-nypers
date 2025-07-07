import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./slices/userSlice"
import cartSlice from "./slices/cartSlice"
import productSlice from "./slices/productSlice"
// Add checkout slice to the store
import checkoutSlice from "./slices/checkoutSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    product: productSlice,
    checkout: checkoutSlice,
  },
})
