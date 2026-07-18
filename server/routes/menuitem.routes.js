const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Utility for input validation
function validateMenuItem(data) {
  const errors = {};
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 1) {
    errors.title = 'Title is required.';
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 1) {
    errors.description = 'Description is required.';
  }
  if (
    typeof data.price !== 'number' ||
    isNaN(data.price) ||
    data.price < 0
  ) {
    errors.price = 'Price must be a positive number.';
  }
  if (!data.imageUrl || typeof data.imageUrl !== 'string' || data.imageUrl.trim().length < 1) {
    errors.imageUrl = 'Image URL is required.';
  }
  return errors;
}

// GET /api/menuitems (list)
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ title: 1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// GET /api/menuitems/:id
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item.' });
  }
});

// POST /api/menuitems
router.post('/', async (req, res) => {
  try {
    const errors = validateMenuItem(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    const menuItem = new MenuItem({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      price: req.body.price,
      imageUrl: req.body.imageUrl.trim(),
    });

    const created = await menuItem.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// PUT /api/menuitems/:id
router.put('/:id', async (req, res) => {
  try {
    const errors = validateMenuItem(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        price: req.body.price,
        imageUrl: req.body.imageUrl.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// DELETE /api/menuitems/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

module.exports = router;