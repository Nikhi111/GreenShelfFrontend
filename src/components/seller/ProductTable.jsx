import React from 'react';
import { useNursery } from '../../context/NurseryContext';
import { Package, Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete, onAdd }) => {
  const { selectedNursery } = useNursery();
  const isPending = selectedNursery && !selectedNursery.verified;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nursery Inventory</h2>
            <p className="text-sm text-gray-500">Manage your plants and products</p>
          </div>
        </div>
        
        <button
          onClick={onAdd}
          disabled={isPending}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isPending 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
          }`}
          title={isPending ? 'Nursery verification pending' : 'Add new product'}
        >
          <Plus className="w-5 h-5" />
          <span>Add Plant</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p>No products found in this nursery.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={product.image || 'https://via.placeholder.com/150'} 
                      alt={product.plantName} 
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{product.plantName}</div>
                    <div className="text-xs text-gray-500 capitalize">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900 font-medium">₹{product.prize}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.quantity} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onEdit(product)}
                        disabled={isPending}
                        className={`p-2 rounded-lg transition-colors ${
                          isPending ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.productId)}
                        disabled={isPending}
                        className={`p-2 rounded-lg transition-colors ${
                          isPending ? 'text-gray-300' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
