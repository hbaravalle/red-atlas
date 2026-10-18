import Property from '../models/Property.js';

async function getAll(req, res) {
  try {
    const { sort, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };

    if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'price_asc') {
      sortOption = { price: 1 };
    }

    const properties = await Property.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProperties = await Property.countDocuments();
    const totalPages = Math.ceil(totalProperties / limitNumber);

    return res.status(200).json({
      properties,
      totalProperties,
      totalPages,
      currentPage: pageNumber,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function getById(req, res) {
  try {
    const property = await Property.findOne({ _id: req.params.id });
    return res.status(200).json(property);
  } catch (error) {
    return res.status(500).json('Server error');
  }
}

async function search(req, res) {
  try {
    const { query, sort, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Configuración del orden
    let sortOption = { createdAt: -1 };
    if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'price_asc') {
      sortOption = { price: 1 };
    }

    // Búsqueda en los campos title y address
    const properties = await Property.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
      ],
    })
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalProperties = await Property.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
      ],
    });

    const totalPages = Math.ceil(totalProperties / limitNumber);

    return res.status(200).json({
      properties,
      totalProperties,
      totalPages,
      currentPage: pageNumber,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function count(req, res) {
  try {
    const totalProperties = await Property.countDocuments();
    return res.status(200).json(totalProperties);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function create(req, res) {
  try {
    const {
      address,
      title,
      description,
      location,
      images,
      type,
      status,
      isActive,
      price,
      area,
      owner,
    } = req.body;
    const newProperty = await Property.create({
      address,
      title,
      description,
      location,
      images,
      type,
      status,
      isActive,
      price,
      area,
      owner,
    });
    return res.status(201).json(newProperty);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function update(req, res) {}

async function destroy(req, res) {
  try {
    const propertyToDestroy = await Property.deleteOne({ _id: req.params.id });
    return res.json('Property deleted');
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

export default { getAll, getById, search, count, create, update, destroy };
