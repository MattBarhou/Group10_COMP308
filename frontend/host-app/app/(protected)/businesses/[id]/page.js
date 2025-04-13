"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../lib/auth";
import {
  FaStore,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaTag,
  FaStar,
  FaUser,
} from "react-icons/fa";

const GET_BUSINESS = gql`
  query GetBusiness($id: ID!) {
    getBusinessById(id: $id) {
      id
      name
      description
      address
      phone
      email
      category
      ownerId
      deals {
        id
        title
        description
        startDate
        endDate
        discount
        active
      }
      reviews {
        id
        rating
        text
        userId
        createdAt
        sentimentScore
        sentimentFeedback {
          sentiment
          feedback
        }
        response {
          text
          createdAt
        }
      }
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
      rating
      text
      createdAt
      sentimentScore
    }
  }
`;

const RESPOND_TO_REVIEW = gql`
  mutation RespondToReview($input: ReviewResponseInput!) {
    respondToReview(input: $input) {
      id
      response {
        text
        createdAt
      }
    }
  }
`;

export default function BusinessDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [responseTexts, setResponseTexts] = useState({});

  const { loading, error, data, refetch } = useQuery(GET_BUSINESS, {
    variables: { id },
  });

  const [createReview, { loading: reviewLoading }] = useMutation(
    CREATE_REVIEW,
    {
      onCompleted: () => {
        setRating(5);
        setReviewText("");
        refetch();
      },
    }
  );

  const [respondToReview, { loading: respondLoading }] = useMutation(
    RESPOND_TO_REVIEW,
    {
      onCompleted: () => {
        setResponseTexts({});
        refetch();
      },
    }
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    createReview({
      variables: {
        input: {
          businessId: id,
          rating,
          text: reviewText,
        },
      },
    });
  };

  const handleResponseSubmit = (reviewId) => {
    respondToReview({
      variables: {
        input: {
          reviewId,
          text: responseTexts[reviewId],
        },
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isBusinessOwner =
    data?.getBusinessById && user?.id === data.getBusinessById.ownerId;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>Error loading business: {error.message}</p>
        </div>
      </div>
    );
  }

  const business = data?.getBusinessById;

  if (!business) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Business not found.</p>
        </div>
      </div>
    );
  }

  const getAverageRating = () => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const sum = business.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return (sum / business.reviews.length).toFixed(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`h-5 w-5 ${
                        parseFloat(getAverageRating()) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getAverageRating()} ({business.reviews.length} reviews)
                </span>
              </div>
              <p className="text-gray-600 mb-6 dark:text-gray-400">
                {business.description}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-4 md:mt-0 dark:bg-gray-700">
              <span className="text-sm font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full block text-center mb-3 dark:bg-blue-900 dark:text-blue-300">
                {business.category}
              </span>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-2" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <span>{business.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      {business.deals && business.deals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
          <div className="border-b px-6 py-4 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Current Deals</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {business.deals
                .filter(
                  (deal) => deal.active && new Date(deal.endDate) >= new Date()
                )
                .map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900"
                  >
                    <div className="flex items-center mb-2">
                      <FaTag className="text-blue-600 mr-2 dark:text-blue-300" />
                      <h3 className="text-lg font-medium">{deal.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3 dark:text-gray-400">
                      {deal.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      {deal.discount && (
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {deal.discount}% off
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-400">
                        Valid until {formatDate(deal.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 dark:bg-gray-800">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
        </div>

        {/* Write a Review Form */}
        {user && !isBusinessOwner && (
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <FaStar
                        className={`h-8 w-8 ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="reviewText"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Your Review
                </label>
                <textarea
                  id="reviewText"
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="p-6">
          {business.reviews.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to leave a review!
            </p>
          ) : (
            <div className="space-y-6">
              {business.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b pb-6 last:border-0 last:pb-0 dark:border-gray-700"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="font-medium">{review.userId}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`h-5 w-5 ${
                            review.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-2 dark:text-gray-400">
                    {review.text}
                  </p>

                  {review.sentimentFeedback && (
                    <div
                      className={`text-xs inline-block px-2 py-1 rounded-full mb-3
                      ${
                        review.sentimentFeedback.sentiment === "Very Positive"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : review.sentimentFeedback.sentiment === "Positive"
                          ? "bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : review.sentimentFeedback.sentiment === "Neutral"
                          ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          : review.sentimentFeedback.sentiment === "Negative"
                          ? "bg-orange-50 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {review.sentimentFeedback.sentiment}
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Posted on {formatDate(review.createdAt)}
                  </div>

                  {/* Business Owner Response */}
                  {review.response && review.response.text && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-2 dark:bg-gray-700">
                      <p className="text-sm font-medium mb-1">
                        Response from the owner:
                      </p>
                      <p className="text-gray-600 mb-1 dark:text-gray-400">
                        {review.response.text}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Responded on {formatDate(review.response.createdAt)}
                      </div>
                    </div>
                  )}

                  {/* Response Form for Business Owner */}
                  {isBusinessOwner && !review.response && (
                    <div className="mt-3">
                      <textarea
                        placeholder="Write your response to this review..."
                        value={responseTexts[review.id] || ""}
                        onChange={(e) =>
                          setResponseTexts({
                            ...responseTexts,
                            [review.id]: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        rows="2"
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => handleResponseSubmit(review.id)}
                          disabled={!responseTexts[review.id] || respondLoading}
                          className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          Respond
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
