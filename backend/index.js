const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8081;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//model
const userModel = mongoose.model("user", userSchema);
//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully Sign Up...!", alert: true });
    }
  });
});

//api login
app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    if (result) {
      if (password === result.password) {
        const dataSend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          password: result.password,
          image: result.image,
        };
        res.send({
          message: "Login is successfully",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Password is invalid",
          alert: false,
        });
      }
    } else {
      //cheque email
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  });
});
//app.use(require("./routes/productRoute.js"));

//product section

const schemaProduct = mongoose.Schema({
  model: String,
  brand: String,
  image: String,
  price: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  const data = await productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "Upload successfully" });
});

app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});
// Cart Schema
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
      },
      model: String,
      brand: String,
      image: String,
      price: String,
      qty: {
        type: Number,
        default: 1,
        min: 1
      },
      total: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Cart Model
const cartModel = mongoose.model("cart", cartSchema);

// Get cart items for a user
app.get("/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Find cart for this user
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(200).json({ items: [], message: "Cart is empty" });
    }
    
    return res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add item to cart
app.post("/cart/add", async (req, res) => {
  try {
    const { userId, productId, model, brand, image, price, qty = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }
    
    // Calculate total price
    const total = (parseFloat(price) * parseInt(qty)).toString();
    
    // Check if user has a cart
    let cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      // Create new cart if user doesn't have one
      cart = new cartModel({
        userId,
        items: [{
          productId,
          model,
          brand, 
          image,
          price,
          qty,
          total
        }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity and total
        cart.items[existingItemIndex].qty += parseInt(qty);
        cart.items[existingItemIndex].total = 
          (parseFloat(cart.items[existingItemIndex].price) * 
           cart.items[existingItemIndex].qty).toString();
      } else {
        // Add new item to cart
        cart.items.push({
          productId,
          model,
          brand,
          image,
          price,
          qty,
          total
        });
      }
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      message: "Item added to cart successfully",
      items: cart.items
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update cart item quantity
app.put("/cart/update", async (req, res) => {
  try {
    const { userId, itemId, qty } = req.body;
    
    if (!userId || !itemId || !qty) {
      return res.status(400).json({ message: "User ID, Item ID and Quantity are required" });
    }
    
    // Find user's cart
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    // Update quantity and total
    cart.items[itemIndex].qty = parseInt(qty);
    cart.items[itemIndex].total = 
      (parseFloat(cart.items[itemIndex].price) * parseInt(qty)).toString();
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      message: "Cart updated successfully",
      items: cart.items
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove item from cart
app.delete("/cart/remove/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    if (!userId || !itemId) {
      return res.status(400).json({ message: "User ID and Item ID are required" });
    }
    
    // Find user's cart
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      message: "Item removed from cart successfully",
      items: cart.items
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Clear cart
app.delete("/cart/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Find and update user's cart
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    // Clear items array
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    return res.status(200).json({ 
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
