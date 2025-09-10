import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Calendar,
  ArrowRight,
  Download,
  Phone,
  MapPin,
} from "lucide-react";

interface OrderDetails {
  id: string;
  reference_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  shipping_method: string;
  payment_method: string;
  items: any[];
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderReference = searchParams.get("order");
  const orderFromState = location.state?.order;

  // Fallback data if no order details available
  const fallbackOrderNumber = `ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderFromState) {
        setOrder(orderFromState);
        setLoading(false);
        return;
      }

      if (!orderReference) {
        // If no order reference, show fallback confirmation
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/api/orders/${orderReference}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order details");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        // Show fallback confirmation instead of error
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderReference, orderFromState]);

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case "standard":
        return "Standard Shipping (3-5 business days)";
      case "express":
        return "Express Shipping (1-2 business days)";
      case "premium":
        return "Premium Delivery (White glove service)";
      default:
        return "Standard Shipping (3-5 business days)";
    }
  };

  const getEstimatedDelivery = (shippingMethod: string, orderDate: string) => {
    const orderDateObj = new Date(orderDate);
    let deliveryDays = 7; // default

    switch (shippingMethod) {
      case "express":
        deliveryDays = 2;
        break;
      case "premium":
        deliveryDays = 1;
        break;
      default:
        deliveryDays = 7;
        break;
    }

    const deliveryDate = new Date(orderDateObj);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-serif text-3xl text-gray-900 mb-2">
                Thank You for Your Order!
              </h1>
              <p className="text-gray-600">
                Your order has been received and is being processed.
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="font-medium text-gray-900">
                    {order?.reference_number || fallbackOrderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {order
                      ? new Date(order.created_at).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-gray-900">
                    {order
                      ? getEstimatedDelivery(
                          order.shipping_method,
                          order.created_at
                        )
                      : formattedDeliveryDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items (if available) */}
            {order?.items && order.items.length > 0 && (
              <div className="mb-8">
                <h2 className="font-medium text-lg text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product_image || "/placeholder-product.jpg"}
                          alt={item.product_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.product_designer}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium text-gray-900 flex items-center gap-1">
                            <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {item.total_price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-xl text-gray-900 flex items-center gap-1">
                      <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {order.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Information (if available) */}
            {order?.shipping_address && (
              <div className="mb-8">
                <h2 className="font-medium text-lg text-gray-900 mb-4">
                  Shipping Information
                </h2>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Delivery Address
                      </h3>
                      <div className="text-gray-700 space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p>{order.shipping_address.address}</p>
                        {order.shipping_address.apartment && (
                          <p>{order.shipping_address.apartment}</p>
                        )}
                        <p>
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.country}{" "}
                          {order.shipping_address.postalCode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        Shipping Method
                      </h3>
                      <p className="text-gray-700">
                        {getShippingMethodName(order.shipping_method)}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {order.customer_phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {order.customer_email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="font-medium text-lg text-gray-900 mb-4">
                Order Status
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900">Order Placed</h3>
                    <p className="text-sm text-gray-600">
                      Your order has been received and is being processed.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order
                        ? new Date(order.created_at).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </div>
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900">
                      Order Processing
                    </h3>
                    <p className="text-sm text-gray-600">
                      We're preparing your items for shipment.
                    </p>
                  </div>
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900">Shipped</h3>
                    <p className="text-sm text-gray-600">
                      Your order is on its way to you.
                    </p>
                  </div>
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900">Delivered</h3>
                    <p className="text-sm text-gray-600">
                      Estimated delivery:{" "}
                      {order
                        ? getEstimatedDelivery(
                            order.shipping_method,
                            order.created_at
                          )
                        : formattedDeliveryDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <h3 className="font-medium text-gray-900">
                  Order Confirmation Email
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a confirmation email to{" "}
                {order?.customer_email || "your email address"} with all the
                details of your order. If you don't receive it within a few
                minutes, please check your spam folder.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {order && (
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white px-6 py-3 font-medium hover:bg-gray-700 transition-colors uppercase tracking-wide text-center flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD RECEIPT
                </button>
              )}
              <Link
                to="/dashboard"
                className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide text-center"
              >
                TRACK YOUR ORDER
              </Link>
              <Link
                to="/"
                className="border border-black text-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide text-center"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="font-medium text-lg text-gray-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="group">
                  <Link to={`/product/prod_${item}`} className="block">
                    <div className="aspect-square bg-gray-100 mb-3 overflow-hidden rounded-lg">
                      <div className="w-full h-full bg-white"></div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-black transition-colors">
                      Product Name
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">Designer Brand</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[18px] inline-block' alt="" /> 1,299</p>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/category/all"
                className="inline-flex items-center text-gray-900 hover:underline font-medium"
              >
                View More Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
