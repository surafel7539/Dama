import Groq from "groq-sdk";
import Product from "../models/Product.js";

const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }

    // =====================================================
    // AI TOOL
    // =====================================================

    const tools = [
      {
        type: "function",
        function: {
          name: "search_products",

          description:
            "Search Dama's MongoDB product database. Use this whenever the user asks about actual Dama marketplace products, prices, categories, stock, ratings, sellers, or recommendations.",

          parameters: {
            type: "object",

            properties: {
              query: {
                type: "string",
                description: `
              Search keywords for the product.

              IMPORTANT:
              Use broad product keywords rather than only the exact word the user used.

              Examples:
              - phone → phone, smartphone, mobile, iPhone, Samsung Galaxy
              - laptop → laptop, notebook, MacBook
              - TV → television, smart TV
              - headphones → headphones, earbuds, earphones
              - shoes → shoes, sneakers, footwear

              For a phone request, include relevant phone brands/models if mentioned.

              Use an empty string if no product was specified.
              `,
              },

              category: {
                type: "string",
                description:
                  "Product category such as Electronics, Fashion, Sports, etc. Use an empty string if none was specified.",
              },

              minPrice: {
                type: "number",
                description:
                  "Minimum price in Ethiopian Birr. Use 0 when there is no minimum price.",
              },

              maxPrice: {
                type: "number",
                description:
                  "Maximum price in Ethiopian Birr. Use 0 when there is no maximum price.",
              },
            },

            required: [
              "query",
              "category",
              "minPrice",
              "maxPrice",
            ],

            additionalProperties: false,
          },
        },
      },
    ];

    // =====================================================
    // INITIAL MESSAGES
    // =====================================================

    const messages = [
      {
        role: "system",

        content: `
You are Dama's AI shopping assistant.

Dama is an Ethiopian online marketplace.

You help users:

- Find products
- Compare products
- Explain product details
- Check prices
- Check stock
- Check ratings
- Recommend products
- Help users shop on Dama

IMPORTANT RULES:

1. NEVER invent products.
2. NEVER invent prices.
3. NEVER invent stock.
4. NEVER invent ratings.
5. NEVER invent sellers.
6. ONLY mention products returned by search_products.
7. Prices are in Ethiopian Birr (Br).
8. If no matching products are found, clearly say so.
9. Keep responses friendly and concise.
10. General questions that do not require products should NOT use search_products.
11. If the user asks for an image, picture, anime character, or unrelated information, do NOT use search_products.

PRICE SEARCH RULES:

"under", "below", "less than", "up to"
→ maxPrice

"over", "above", "more than", "at least"
→ minPrice

"between X and Y"
→ minPrice = X
→ maxPrice = Y

If there is no minimum:
→ minPrice = 0

If there is no maximum:
→ maxPrice = 0

IMPORTANT:

For "Find me a phone over 200,000 Br", call:

{
  "query": "phone",
  "category": "",
  "minPrice": 200000,
  "maxPrice": 0
}

For "Find me a phone under 20,000 Br", call:

{
  "query": "phone",
  "category": "",
  "minPrice": 0,
  "maxPrice": 20000
}

For "Find me a phone between 50,000 and 100,000 Br", call:

{
  "query": "phone",
  "category": "",
  "minPrice": 50000,
  "maxPrice": 100000
}

For "Find electronics over 100,000 Br", call:

{
  "query": "",
  "category": "Electronics",
  "minPrice": 100000,
  "maxPrice": 0
}
`,
      },

      {
        role: "user",
        content: message,
      },
    ];

    // =====================================================
    // FIRST GROQ REQUEST
    // =====================================================

    let response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages,

      tools,

      tool_choice: "auto",

      temperature: 0.2,
    });

    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage) {
      return res.status(500).json({
        message: "AI returned an empty response.",
      });
    }

    messages.push(assistantMessage);

    // =====================================================
    // SEARCH RESULTS
    // =====================================================

    let foundProducts = [];

    // =====================================================
    // TOOL CALL
    // =====================================================

    if (
      assistantMessage.tool_calls &&
      assistantMessage.tool_calls.length > 0
    ) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.function.name !== "search_products") {
          continue;
        }

        // =================================================
        // PARSE ARGUMENTS
        // =================================================

        let args;

        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          console.error(
            "Invalid AI tool arguments:",
            toolCall.function.arguments
          );

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              error: "Invalid search parameters.",
            }),
          });

          continue;
        }

        console.log("AI product search:", args);

        // =================================================
        // NORMALIZE VALUES
        // =================================================

        const query =
          typeof args.query === "string"
            ? args.query.trim()
            : "";

        const category =
          typeof args.category === "string"
            ? args.category.trim()
            : "";

        let minPrice = Number(args.minPrice);
        let maxPrice = Number(args.maxPrice);

        if (!Number.isFinite(minPrice)) {
          minPrice = 0;
        }

        if (!Number.isFinite(maxPrice)) {
          maxPrice = 0;
        }

        // Prevent negative prices
        minPrice = Math.max(0, minPrice);
        maxPrice = Math.max(0, maxPrice);

        console.log("Normalized search:", {
          query,
          category,
          minPrice,
          maxPrice,
        });

        // =================================================
        // BUILD MONGODB QUERY
        // =================================================

        const mongoQuery = {};

        // =================================================
        // CATEGORY
        // =================================================

        if (category) {
          mongoQuery.category = {
            $regex: category,
            $options: "i",
          };
        }

        // =================================================
        // PRICE
        // =================================================

        if (minPrice > 0 && maxPrice > 0) {
          // Between two prices
          mongoQuery.price = {
            $gte: minPrice,
            $lte: maxPrice,
          };
        } else if (minPrice > 0) {
          // Over / above / at least
          mongoQuery.price = {
            $gte: minPrice,
          };
        } else if (maxPrice > 0) {
          // Under / below / up to
          mongoQuery.price = {
            $lte: maxPrice,
          };
        }

        // =================================================
        // PRODUCT KEYWORD SEARCH
        // =================================================
          const searchTerms = [];

if (query) {
  searchTerms.push(query);

  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("phone") ||
    lowerQuery.includes("smartphone") ||
    lowerQuery.includes("mobile")
  ) {
    searchTerms.push(
      "phone",
      "smartphone",
      "mobile",
      "iphone",
      "samsung",
      "galaxy",
      "pixel",
      "xiaomi",
      "redmi",
      "oneplus",
      "huawei",
      "oppo",
      "vivo",
      "tecno",
      "infinix"
    );
  }

  if (
    lowerQuery.includes("laptop") ||
    lowerQuery.includes("computer")
  ) {
    searchTerms.push(
      "laptop",
      "computer",
      "macbook",
      "notebook",
      "thinkpad",
      "dell",
      "hp",
      "lenovo",
      "asus",
      "acer"
    );
  }
}
        if (searchTerms.length > 0) {
  mongoQuery.$or = [];

  for (const term of searchTerms) {
    mongoQuery.$or.push(
      {
        title: {
          $regex: term,
          $options: "i",
        },
      },
      {
        description: {
          $regex: term,
          $options: "i",
        },
      },
      {
        category: {
          $regex: term,
          $options: "i",
        },
      }
    );
  }
}

        console.log(
          "MongoDB query:",
          JSON.stringify(mongoQuery, null, 2)
        );

        // =================================================
        // DATABASE SEARCH
        // =================================================

        const products = await Product.find(mongoQuery)
          .populate("seller", "fullName")
          .limit(10)
          .lean();

        console.log(
          `Found ${products.length} products`
        );

        // =================================================
        // FORMAT PRODUCTS
        // =================================================

        foundProducts = products.map((product) => ({
          _id: product._id.toString(),

          title: product.title,

          description: product.description,

          price: product.price,

          category: product.category,

          stock: product.stock,

          averageRating:
            product.averageRating || 0,

          numReviews:
            product.numReviews || 0,

          seller:
            product.seller?.fullName ||
            "Unknown",

          image: product.image,
        }));

        // =================================================
        // SEND DATABASE RESULTS TO GROQ
        // =================================================

        messages.push({
          role: "tool",

          tool_call_id: toolCall.id,

          content: JSON.stringify(foundProducts),
        });
      }

      // =====================================================
      // FINAL AI RESPONSE
      // =====================================================

      response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages,

        temperature: 0.2,
      });
    }

    // =====================================================
    // FINAL REPLY
    // =====================================================

    const reply =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // =====================================================
    // SEND TO FRONTEND
    // =====================================================

    res.json({
      reply,
      products: foundProducts,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      message:
        "AI support is temporarily unavailable.",

      error: error.message,
    });
  }
};