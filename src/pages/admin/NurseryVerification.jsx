import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

const NurseryVerification = () => {
  const [nurseries, setNurseries] = useState([]);
  const [filteredNurseries, setFilteredNurseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPendingNurseries();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // Filter nurseries based on search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = nurseries.filter(nursery => {
        const nurseryName = (nursery.name || nursery.nurseryName || nursery.businessName || `Nursery #${nursery.id}`).toLowerCase();
        const nurseryEmail = (nursery.email || nursery.contactEmail || nursery.user?.email || '').toLowerCase();
        const nurseryId = `#${nursery.id}`.toLowerCase();
        
        return nurseryName.includes(searchLower) || nurseryEmail.includes(searchLower) || nurseryId.includes(searchLower);
      });
      setFilteredNurseries(filtered);
    } else {
      setFilteredNurseries(nurseries);
    }
  }, [nurseries, searchTerm]);

  const fetchPendingNurseries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = `/admin/nurseries?page=${currentPage}&size=${pageSize}&isVerified=false`;
      if (searchTerm.trim()) {
        endpoint = `/admin/search-nursery?name=${encodeURIComponent(searchTerm)}&page=${currentPage}&size=${pageSize}&isVerified=false`;
      }
      
      const response = await api.get(endpoint);
      console.log('Nursery Backend Response:', response.data); // Debug log
      console.log('First Nursery:', response.data.content?.[0]); // Debug first nursery
      console.log('All Nursery Fields:', response.data.content?.[0] ? Object.keys(response.data.content[0]) : 'No nurseries'); // Debug all fields
      setNurseries(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching nurseries:', err);
      setError('Failed to load nurseries');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNursery = async (nurseryId, verified) => {
    try {
      setActionLoading(prev => ({ ...prev, [nurseryId]: true }));
      
      await api.patch('/admin/verify-nursery', {
        nurseryId: nurseryId,
        isVerified: verified
      });

      // Show success toast
      setToast({
        type: 'success',
        message: verified ? 'Nursery Verified Successfully!' : 'Nursery Rejected'
      });

      // Remove nursery from list
      setNurseries(prev => prev.filter(nursery => nursery.id !== nurseryId));
      
      // Hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
      
    } catch (err) {
      console.error('Error verifying nursery:', err);
      setToast({
        type: 'error',
        message: 'Failed to process request'
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setActionLoading(prev => ({ ...prev, [nurseryId]: false }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nursery Verification</h1>
                <p className="text-gray-600 mt-1">Manage nursery verification requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Pending Verification</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by nursery name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(0);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          </form>
        </motion.div>

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}

        {/* Nurseries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Nurseries</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPendingNurseries}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredNurseries.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No Matching Nurseries' : 'No Pending Nurseries'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'All nurseries have been verified!'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nursery ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nursery Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNurseries.map((nursery, index) => (
                      <motion.tr
                        key={nursery.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{nursery.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {nursery.name || nursery.nurseryName || nursery.businessName || `Nursery #${nursery.id}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {nursery.user?.username || nursery.username || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {nursery.user?.email || nursery.email || nursery.contactEmail || nursery.businessEmail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {nursery.licenceNumber || nursery.licenseNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(nursery.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleVerifyNursery(nursery.id, true)}
                              disabled={actionLoading[nursery.id]}
                              className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              {actionLoading[nursery.id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleVerifyNursery(nursery.id, false)}
                              disabled={actionLoading[nursery.id]}
                              className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              {actionLoading[nursery.id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {currentPage + 1} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-700">
                        {currentPage + 1}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NurseryVerification;
