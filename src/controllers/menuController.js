import { Menu } from "../models/menu.js";

// Create Menu Item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res
        .status(400)
        .json({ message: "All fields including image are required" });
    }

    const menuItem = new Menu({
      name,
      description,
      price,
      category,
      image, // now a URL (e.g. ImgBB) or filename string
    });

    await menuItem.save();
    return res.status(201).json(menuItem);
  } catch (error) {
    console.error("Create menu error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to create menu item" });
  }
};

// Get Menu Items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Menu By ID
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const { name, description, price, category, image } = req.body;

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;

    // image is optional on update – only overwrite if sent
    if (image) menuItem.image = image;

    await menuItem.save();
    return res.json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Update menu error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to update menu item" });
  }
};

// Delete Menu Item
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await menuItem.deleteOne();
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
