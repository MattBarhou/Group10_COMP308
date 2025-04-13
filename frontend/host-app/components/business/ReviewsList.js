import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { FaStar, FaUser } from "react-icons/fa";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../lib/auth";
import { formatDate } from "../../lib/date-utils";

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

export default function ReviewsList({
  reviews,
  businessId,
  isBusinessOwner,
  onRefetch,
}) {
  const { user } = useAuth();
  const [responseTexts, setResponseTexts] = useState({});

  const [respondToReview, { loading: respondLoading }] = useMutation(
    RESPOND_TO_REVIEW,
    {
      onCompleted: () => {
        setResponseTexts({});
        if (onRefetch) onRefetch();
      },
    }
  );

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

  if (!reviews || reviews.length === 0) {
    return (
      <Card heading="Customer Reviews">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to leave a review!
        </p>
      </Card>
    );
  }

  return (
    <Card heading="Customer Reviews">
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b pb-6 last:border-0 last:pb-0 dark:border-gray-700"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2" />
                <span className="font-medium">
                  {review.user?.username || review.userId}
                </span>
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
                  <Button
                    onClick={() => handleResponseSubmit(review.id)}
                    disabled={!responseTexts[review.id] || respondLoading}
                    size="small"
                  >
                    Respond
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
