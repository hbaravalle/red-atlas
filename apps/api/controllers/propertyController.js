import {
  DEFAULT_PAGE_SIZE,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from '@red-atlas/shared';
import Property from '../models/Property.js';

const MAX_PAGE_SIZE = 100;

// Postgres errors caused by the request data, not by the server:
// not_null_violation, check_violation, invalid_text_representation,
// numeric_value_out_of_range. Drizzle keeps the original error in `cause`.
const INVALID_DATA_CODES = ['23502', '23514', '22P02', '22003'];

function toPositiveInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) || number < 1 ? fallback : number;
}

async function paginate(req, res, query) {
  const page = toPositiveInt(req.query.page, 1);
  const limit = Math.min(
    toPositiveInt(req.query.limit, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  const { properties, total } = await Property.findPage({
    query,
    sort: req.query.sort,
    page,
    limit,
  });
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
  try {
    return await paginate(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function getById(req, res) {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json(property);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function search(req, res) {
  try {
    const { query } = req.query;

    // ?query=a&query=b arrives as an array, so check the type too
    if (typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    return await paginate(req, res, query.trim());
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function count(req, res) {
  try {
    const totalProperties = await Property.count();
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

    if (!PROPERTY_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ message: `type must be one of: ${PROPERTY_TYPES.join(', ')}` });
    }

    if (!PROPERTY_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of: ${PROPERTY_STATUSES.join(', ')}`,
      });
    }

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
    if (INVALID_DATA_CODES.includes(error.cause?.code)) {
      return res.status(400).json({ message: error.cause.message });
    }

    console.log(error);
    return res.status(500).json('Server error');
  }
}

async function update(req, res) {}

async function destroy(req, res) {
  try {
    const deleted = await Property.destroy(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json('Property deleted');
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
}

export default { getAll, getById, search, count, create, update, destroy };
