"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../lib/auth";
import { FaStore, FaPlus, FaEdit } from "react-icons/fa";

const GET_MY_BUSINESSES = gql`
  query GetMyBusinesses {
    getBusinessesByOwnerId {
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

const CREATE_BUSINESS = gql`
  mutation CreateBusiness($input: BusinessInput!) {
    createBusiness(input: $input) {
      id
      name
    }
  }
`;

export default function ManageBusinesses() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading, error, data, refetch } = useQuery(GET_MY_BUSINESSES);

  const [createBusiness, { loading: createLoading }] = useMutation(
    CREATE_BUSINESS,
    {
      onCompleted: () => {
        setShowForm(false);
        reset();
        refetch();
      },
    }
  );

  const onSubmit = (data) => {
    createBusiness({
      variables: {
        input: {
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          category: data.category,
        },
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Your Businesses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showForm ? "Cancel" : "Add Business"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Create New Business</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Business Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Business name is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create Business"}
              </button>
            </div>
          </form>
        </div>
      )}

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
        <>
          {data?.getBusinessesByOwnerId?.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center dark:bg-gray-800">
              <FaStore className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Businesses Yet</h2>
              <p className="text-gray-600 mb-6 dark:text-gray-400">
                You haven't created any businesses yet. Create your first
                business to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Create Your First Business
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.getBusinessesByOwnerId.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-semibold">{business.name}</h2>
                      <Link
                        href={`/businesses/${business.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </Link>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-400">
                      {business.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {business.category}
                      </span>

                      <Link
                        href={`/businesses/${business.id}/edit`}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                    </div>
                  </div>

                  <div className="bg-gray-50 border-t px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex justify-between">
                      <Link
                        href={`/businesses/${business.id}/deals`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Manage Deals
                      </Link>
                      <Link
                        href={`/businesses/${business.id}/reviews`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Reviews
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
