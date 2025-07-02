import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, updateProduct, searchProductsByName } from "../controllers/productControllers"
import { authMiddleware } from "../middleware/authMiddleware"

const productRouter = Router()

productRouter.get("/search", searchProductsByName)
productRouter.get("/", getAllProducts)

// Nueva ruta para búsqueda por nombre

productRouter.post("/", authMiddleware, createProduct)
productRouter.delete("/:id", authMiddleware, deleteProduct)
productRouter.patch("/:id", authMiddleware, updateProduct)

export { productRouter }
