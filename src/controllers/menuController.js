import { Menu } from "../models/menu.js";

// Create Menu Item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const menuItem = new Menu({ name, description, price, category, image });
    await menuItem.save();

    res.status(201).json(menuItem); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
//Get Menu By ID
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

    const { name, description, price, category } = req.body;

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
    if (req.file) menuItem.image = `/uploads/${req.file.filename}`;

    await menuItem.save();
    res.json({ message: "Menu item updated successfully", menuItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
