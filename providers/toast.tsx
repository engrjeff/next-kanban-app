"use client"

import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      closeButton={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{ zIndex: 1000 }}
    />
  )
}

export default Toast
