const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const router = express.Router();

// Helper: validate GalleryImage fields
function validateGalleryImage({ imageUrl, caption }) {
  if (typeof imageUrl !== 'string' || !imageUrl.trim()) return 'imageUrl is required';
  if (typeof caption !== 'string') return 'caption must be a string';
  return null;
}

// GET /api/galleryimages — list all
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ _id: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery images.' });
  }
});

// GET /api/galleryimages/:id — get by id
router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Gallery image not found.' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery image.' });
  }
});

// POST /api/galleryimages — create
router.post('/', async (req, res) => {
  try {
    const validationError = validateGalleryImage(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const image = new GalleryImage({
      imageUrl: req.body.imageUrl,
      caption: req.body.caption || '',
    });
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gallery image.' });
  }
});

// PUT /api/galleryimages/:id — update
router.put('/:id', async (req, res) => {
  try {
    const validationError = validateGalleryImage(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Gallery image not found.' });

    image.imageUrl = req.body.imageUrl;
    image.caption = req.body.caption || '';
    await image.save();

    res.json(image);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery image.' });
  }
});

// DELETE /api/galleryimages/:id — delete
router.delete('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Gallery image not found.' });

    await image.deleteOne();
    res.json({ message: 'Gallery image deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery image.' });
  }
});

module.exports = router;