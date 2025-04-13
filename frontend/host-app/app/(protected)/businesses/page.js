"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import {
  FaSearch,
  FaStore,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const GET_BUSINESSES = gql`
  query GetBusinesses {
    getBusinesses {
      id
      name
      description
      category
      address
      phone
      email
    }
  }
`;

export default function Businesses() {
  const { loading, error, data } = useQuery(GET_BUSINESSES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = data?.getBusinesses
    ? [...new Set(data.getBusinesses.map((business) => business.category))]
    : [];

  const filteredBusinesses = data?.getBusinesses
    ? data.getBusinesses.filter((business) => {
        const matchesSearch =
          searchTerm === "" ||
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "" || business.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Local Businesses</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>Error loading businesses: {error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Link href={`/businesses/${business.id}`} key={business.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800">
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FaStore className="text-blue-500 h-5 w-5 mr-2" />
                    <h2 className="text-xl font-semibold">{business.name}</h2>
                  </div>

                  <p className="text-gray-600 mb-4 dark:text-gray-400">
                    {business.description}
                  </p>

                  <div className="text-sm text-gray-500 space-y-2 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{business.address}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{business.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 dark:bg-gray-700">
                  <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {business.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {filteredBusinesses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No businesses found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
