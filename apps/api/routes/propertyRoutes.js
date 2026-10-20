import propertyController from '../controllers/propertyController.js';
import express from 'express';
const router = express.Router();

router.get('/', propertyController.getAll);
router.get('/search', propertyController.search);
router.get('/:id', propertyController.getById);
router.post('/', propertyController.create);
router.post('/count', propertyController.count);
router.delete('/:id', propertyController.destroy);

export default router;
