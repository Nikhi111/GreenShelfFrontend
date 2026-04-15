import React, { useState, useEffect } from 'react';
import ProductTable from '../../components/seller/ProductTable';
import AddProductModal from '../../components/seller/AddProductModal';
import { useNursery } from '../../context/NurseryContext';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';

const Products = () => {
  const { selectedNursery } = useNursery();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (selectedNursery?.id) {
      fetchProducts();
    }
  }, [selectedNursery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // The backend uses /api/seller/nursery/{nurseryId}/inventory
      const response = await api.get(`/seller/nursery/${selectedNursery.id}/inventory`);
      
      // Page<InventoryProductDto> returns content in .content field
      setProducts(response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // If API fails, we could show an error, but for now we'll just keep the empty state
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchProducts();
    // Optional: show a success toast here
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // TODO: Implement EditProductModal
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product from your inventory?')) {
      try {
        await api.delete(`/seller/nursery/${selectedNursery.id}/product/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete product. It may have associated orders.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Managing products for <span className="font-semibold text-green-600">{selectedNursery?.name}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
            <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                <button className="p-2 text-green-600 bg-green-50 rounded-lg">
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <List className="w-5 h-5" />
                </button>
            </div>
            
            <button
                onClick={() => setIsAddModalOpen(true)}
                disabled={!selectedNursery?.verified}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                    !selectedNursery?.verified
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                }`}
            >
                <Plus className="w-5 h-5" />
                <span>Add New Plant</span>
            </button>
        </div>
      </div>

      <ProductTable 
        products={products}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        nurseryId={selectedNursery?.id}
        onSuccess={handleAddSuccess}
      />
    </motion.div>
  );
};

export default Products;
