import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "../../data/products";
import LuxuryProductCard from "../product/LuxuryProductCard";


const LuxuryProductGrid: React.FC = () => {
  const [products, setProducts] = useState([]);

  const parsePrice = (price: string | number): number => {
    if (price === null || price === undefined || price === "") return 0;
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const parsed = parseFloat(price.replace(/,/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  const getProcucts = async () => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/products?limit=3`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      // Parse and format prices for all products
      const processedProducts = json.data.map((product: any) => ({
        ...product,
        price: parsePrice(product.price),
        originalPrice: product.originalPrice
          ? parsePrice(product.originalPrice)
          : null,
        retail_price: product.retail_price,
        vat_percent: product.vat_percent,
        discount: product.discount,
        // Ensure other required fields are present
        images: product.images || [
          product.image_url || product.front_png || "",
        ],
        colors:
          product.colors || product.color
            ? [{ name: product.color || "Default", hex: "#000000" }]
            : [{ name: "Default", hex: "#000000" }],
        rating: product.rating || 4.5,
        reviews: product.reviews || 12,
        stock: product.stock_quantity || product.stock || 10,
        designer: product.brand || product.vendor?.business_name || "Designer",
        inStock: (product.stock_quantity || product.stock || 10) > 0,
      }));

      setProducts(processedProducts);
      console.log("Processed products:", processedProducts);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProcucts();
  }, []);

  return (
    <section className="w-full">
      {/* Grid sans marges ni espaces - style Louis Vuitton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 mb-12">
        {products.map((product: any, index) => (
          <LuxuryProductCard
            key={product.id}
            product={product}
            index={index}
            showGradient={true}
            variant="minimal"
            useCustomImage={false}
          />
        ))}
      </div>

      {/* Bouton mobile */}
      <div className="md:hidden text-center mt-8">
        <Link
          to="/category/all"
          className="inline-flex items-center bg-black text-white px-6 py-3 font-light hover:bg-gray-900 transition-colors"
        >
          View All Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default LuxuryProductGrid;
