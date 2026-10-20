import Property from '../models/Property.js';
import {
  newProperty,
  pageQuery,
  searchQuery,
} from '../schemas/propertySchema.js';

// A failed parse throws a ZodError, which the error handler answers with a 400

async function paginate(res, params) {
  const { page, limit } = params;
  const { properties, total } = await Property.findPage(params);
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    properties,
    totalProperties: total,
    totalPages,
    currentPage: page,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  });
}

async function getAll(req, res) {
  return paginate(res, pageQuery.parse(req.query));
}

async function getById(req, res) {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  return res.status(200).json(property);
}

async function search(req, res) {
  return paginate(res, searchQuery.parse(req.query));
}

async function count(req, res) {
  const totalProperties = await Property.count();
  return res.status(200).json(totalProperties);
}

async function create(req, res) {
  const property = await Property.create(newProperty.parse(req.body));
  return res.status(201).json(property);
}

async function destroy(req, res) {
  const deleted = await Property.destroy(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'Property not found' });
  }

  return res.json('Property deleted');
}

export default { getAll, getById, search, count, create, destroy };
