import { Request, Response } from "express"
import { Product } from "../models/productModel"
import { email, success } from "zod/v4"

const searchProductsByName = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'name' es obligatorio y debe ser una cadena"
      });
    }

    const products = await Product.find({
      name: { $regex: name, $options: 'i' }  // Búsqueda insensible a mayúsculas, coincidencia parcial
    });

    res.json({
      success: true,
      message: "Productos encontrados",
      data: products
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
};
const getAllProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.find()
    res.json({
      success: true,
      message: "recuperar todos los productos",
      data: products
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, message: err.message })
  }
}

const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body

    const { name, price, category } = body

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "bad request, invalid data"
      })
    }

    const newProduct = new Product({ name, price, category })
    await newProduct.save()

    res.status(201).json({
      success: true,
      messaje: "Successfully created product",
      data: newProduct
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id
  try {
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }
    res.json({
      success: true,
      message: "Successfully deleted product",
      data: deletedProduct
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id
    const body = req.body

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true })

    if (!updateProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.json({
      success: true,
      message: "Successfully updated product",
      data: updatedProduct
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, message: err.message })
  }
}

export { getAllProducts, createProduct, deleteProduct, updateProduct, searchProductsByName }
