import { useState } from "react"
import { Layout } from "../../components/Layout"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Dashboard = () => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("Sin categoria")
  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const navigate = useNavigate()
  const { token } = useAuth()

  const handleName = (event) => {
    setName(event.target.value)
  }

  const handlePrice = (event) => {
    setPrice(Number(event.target.value))
  }

  const handleCategory = (event) => {
    setCategory(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors([])

    if (!name) {
      setErrors(prev => [...prev, "El nuevo producto debe incluir un nombre."])
    }

    if (price === 0) {
      setErrors(prev => [...prev, "¿Estás seguro que no quieres agregar el precio?"])
    }

    if (category === "Sin categoria") {
      setErrors(prev => [...prev, "¿Estás seguro que no quieres agregar la categoría?"])
    }

    const newDataProduct = { name, price, category }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newDataProduct)
      })

      if (response.ok) {
        setMessage("Producto agregado con éxito")
        setTimeout(() => {
          navigate("/")
        }, 3000)
      }
    } catch (error) {
      setErrors(prev => [...prev, error.message])
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/search?name=${searchTerm}`)
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error)
    }
  }

  return (
    <Layout>
      <h1>Agregar un nuevo producto</h1>

      {/* Búsqueda de productos */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Buscar productos</h2>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>

        {searchResults.length > 0 && (
          <div>
            <h3>Resultados:</h3>
            <ul>
              {searchResults.map((product) => (
                <li key={product._id}>
                  {product.name} - ${product.price} - {product.category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Formulario para agregar producto */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <input type="text" name="name" onChange={handleName} value={name} />

        <label htmlFor="price">Precio:</label>
        <input type="number" name="price" onChange={handlePrice} value={price} />

        <label htmlFor="category">Categoría:</label>
        <select onChange={handleCategory} name="category" value={category}>
          <option value="Sin categoria">Sin categoria</option>
          <option value="living">Living</option>
          <option value="jardineria">Jardinería</option>
          <option value="dormitorio">Dormitorio</option>
          <option value="sala de juegos">Sala de juegos</option>
        </select>

        <button>Agregar</button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {errors && errors.map((error, i) => (
          <p key={i} style={{ color: "red" }}>{error}</p>
        ))}
      </form>
    </Layout>
  )
}

export { Dashboard }
