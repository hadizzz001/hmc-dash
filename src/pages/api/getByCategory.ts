import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { category, limit } = req.query;

    // Validate that the category is provided
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    // Set a default limit if not provided
    const limitNumber = typeof Number(limit) === 'number' && !isNaN(Number(limit)) ? Number(limit) : 50;

    try {
      const ProductsCollection = await client.db("Power").collection("Products");
      const docs = await ProductsCollection.find({ category }).limit(limitNumber);

      const products: any[] = [];
      await docs.forEach((prod: any) => {
        products.push(prod);
      });

      if (products.length > 0) {
        return res.status(200).json(products);
      } else {
        return res.status(404).json({ success: false, message: 'No products found for the given category' });
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
