'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productService, Product } from '@/services/product';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin?redirect=/admin/products');
      return;
    }
    loadProducts();
  }, [user, router]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await productService.getProducts({});
      setProducts(response.products || []);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      setError(error.message || 'Failed to load products');
      if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        router.push('/auth/signin?redirect=/admin/products');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
      });
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await productService.updateProduct(selectedProduct._id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      setShowEditModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      image: product.image
    });
    setShowEditModal(true);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadProducts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' : 
                      product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simplified Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {showAddModal ? 'Add New Product' : 'Edit Product'}
              </h3>
              <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="mt-4">
                <div className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <Input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                  <Input
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Image</label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="flex-1"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            name="image"
                            placeholder="Or paste image URL"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={formData.image}
                            alt="Product preview"
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {showAddModal ? 'Add Product' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 