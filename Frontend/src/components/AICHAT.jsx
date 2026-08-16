import React, { useState } from "react";
import { Send, Bot, X, MessageCircle } from "lucide-react";
import { apiRequest } from "../services/api";
import ProductCard from "./ProductCard";

export default function AIChat({ navigateTo, addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm Dama AI. I can help you find products, compare prices, check stock, ratings, and more.",
      products: [],
    },
  ]);

  const sendMessage = async (e) => {
    e?.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        products: [],
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply || "Sorry, I couldn't find an answer.",
          products: Array.isArray(data.products)
            ? data.products
            : [],
        },
      ]);
    } catch (error) {
      console.error("AI frontend error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry 😕 Something went wrong while contacting Dama AI.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#c29b57] text-[#041c14] shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          title="Dama AI"
        >
          <Bot size={28} />
        </button>
      )}

      {/* AI Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-[#041c14] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c29b57] text-[#041c14] flex items-center justify-center">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="font-bold">Dama AI</h2>
                <p className="text-xs text-gray-300">
                  Shopping Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#041c14]">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] bg-[#c29b57] text-[#041c14] rounded-2xl rounded-br-sm px-4 py-3"
                      : "max-w-[95%] text-gray-900 dark:text-white"
                  }
                >
                  {/* AI message */}
                  {msg.role === "assistant" ? (
                    <div className="space-y-3">

                      <div className="bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>

                      {/* Product Results */}
                      {msg.products &&
                        msg.products.length > 0 && (
                          <div className="space-y-3">
                            {msg.products.map((product) => (
                              <ProductCard
                                key={product._id || product.id}
                                product={product}
                                navigateTo={navigateTo}
                                addToCart={addToCart}
                              />
                            ))}
                          </div>
                        )}

                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#0a291f] border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:150ms]">
                      ●
                    </span>
                    <span className="animate-bounce [animation-delay:300ms]">
                      ●
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a291f]"
          >
            <div className="flex items-center gap-2">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about products..."
                disabled={loading}
                className="flex-1 bg-gray-100 dark:bg-[#041c14] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#c29b57] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-11 h-11 rounded-xl bg-[#c29b57] text-[#041c14] flex items-center justify-center hover:bg-[#a88548] transition disabled:opacity-50"
              >
                <Send size={18} />
              </button>

            </div>
          </form>
        </div>
      )}
    </>
  );
}