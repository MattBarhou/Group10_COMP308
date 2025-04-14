"use client";
import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../lib/auth";

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

// Inline styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
  },
  nav: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1rem",
  },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    color: "#4B5563",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  main: {
    flexGrow: 1,
    padding: "2rem",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#4B5563",
    marginBottom: "1.5rem",
    textDecoration: "none",
  },
  businessHeader: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  businessHeaderContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  businessTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  businessCategory: {
    display: "inline-block",
    backgroundColor: "#EBF5FF",
    color: "#1E40AF",
    fontSize: "0.875rem",
    fontWeight: "500",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    marginBottom: "1rem",
  },
  businessDescription: {
    color: "#4B5563",
    marginBottom: "1.5rem",
  },
  businessContact: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    marginBottom: "1rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#4B5563",
    fontSize: "0.875rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  dealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  dealCard: {
    backgroundColor: "#EBF5FF",
    borderRadius: "0.5rem",
    overflow: "hidden",
  },
  dealHeader: {
    padding: "1rem",
    borderBottom: "1px solid #BFDBFE",
  },
  dealTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: "0.5rem",
  },
  dealContent: {
    padding: "1rem",
  },
  dealDescription: {
    color: "#4B5563",
    marginBottom: "1rem",
  },
  dealMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  dealDiscount: {
    display: "inline-block",
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    fontWeight: "bold",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    marginTop: "0.5rem",
  },
  dealDate: {
    display: "flex",
    justifyContent: "space-between",
  },
  reviewForm: {
    marginBottom: "2rem",
  },
  reviewTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  ratingContainer: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  starButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    fontSize: "1.5rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    minHeight: "100px",
  },
  button: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
  },
  disabledButton: {
    opacity: "0.5",
    cursor: "not-allowed",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  reviewCard: {
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: "1.5rem",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  reviewAuthor: {
    fontWeight: "500",
    color: "#111827",
  },
  reviewStars: {
    color: "#F59E0B",
    display: "flex",
  },
  reviewText: {
    color: "#4B5563",
    marginBottom: "1rem",
  },
  reviewDate: {
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  sentimentBadge: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500",
    marginBottom: "0.75rem",
  },
  reviewResponse: {
    backgroundColor: "#F9FAFB",
    padding: "1rem",
    borderRadius: "0.375rem",
    marginTop: "1rem",
  },
  responseHeader: {
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#111827",
  },
  responseText: {
    color: "#4B5563",
    marginBottom: "0.5rem",
  },
  responseDate: {
    fontSize: "0.75rem",
    color: "#6B7280",
  },
  responseForm: {
    marginTop: "1rem",
  },
  responseTextarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #D1D5DB",
    marginBottom: "0.75rem",
    minHeight: "80px",
  },
  responseButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    fontWeight: "500",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  noContent: {
    textAlign: "center",
    padding: "2rem",
    color: "#6B7280",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem 0",
  },
  spinner: {
    width: "3rem",
    height: "3rem",
    border: "0.25rem solid #E5E7EB",
    borderTop: "0.25rem solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: "1rem",
    borderRadius: "0.375rem",
    marginBottom: "1rem",
    color: "#B91C1C",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    borderTop: "1px solid #E5E7EB",
    padding: "1.5rem",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default function BusinessDetails() {
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [responseTexts, setResponseTexts] = useState({});

  // Use auth with try-catch to handle cases where context might not be available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Very Positive":
        return { backgroundColor: "#D1FAE5", color: "#065F46" };
      case "Positive":
        return { backgroundColor: "#E0F2FE", color: "#0369A1" };
      case "Neutral":
        return { backgroundColor: "#F3F4F6", color: "#4B5563" };
      case "Negative":
        return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
      case "Very Negative":
        return { backgroundColor: "#FEE2E2", color: "#7F1D1D" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#4B5563" };
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}>
              Community App
            </Link>
            <div style={styles.navLinks}>
              <Link href="/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/businesses" style={styles.navLink}>
                Businesses
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
            </div>
          </div>
        </main>

        <footer style={styles.footer}>
          <p>
            © {new Date().getFullYear()} Community Engagement App. All rights
            reserved.
          </p>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}>
              Community App
            </Link>
            <div style={styles.navLinks}>
              <Link href="/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/businesses" style={styles.navLink}>
                Businesses
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <div style={styles.errorContainer}>
              <p>Error loading business: {error.message}</p>
            </div>
          </div>
        </main>

        <footer style={styles.footer}>
          <p>
            © {new Date().getFullYear()} Community Engagement App. All rights
            reserved.
          </p>
        </footer>
      </div>
    );
  }

  const business = data?.getBusinessById;

  if (!business) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}>
              Community App
            </Link>
            <div style={styles.navLinks}>
              <Link href="/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/businesses" style={styles.navLink}>
                Businesses
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          <div style={styles.content}>
            <div style={styles.errorContainer}>
              <p>Business not found.</p>
            </div>
          </div>
        </main>

        <footer style={styles.footer}>
          <p>
            © {new Date().getFullYear()} Community Engagement App. All rights
            reserved.
          </p>
        </footer>
      </div>
    );
  }

  const isBusinessOwner = auth?.user?.id === business.ownerId;
  const averageRating = getAverageRating(business.reviews);
  const activeDeals =
    business.deals?.filter(
      (deal) => deal.active && new Date(deal.endDate) >= new Date()
    ) || [];

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logo}>
            Community App
          </Link>
          <div style={styles.navLinks}>
            <Link href="/dashboard" style={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/businesses" style={styles.navLink}>
              Businesses
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>
          <Link href="/businesses" style={styles.backLink}>
            ← Back to businesses
          </Link>

          {/* Business Header */}
          <div style={styles.businessHeader}>
            <div style={styles.businessHeaderContent}>
              <h1 style={styles.businessTitle}>{business.name}</h1>
              <div style={styles.businessCategory}>{business.category}</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", color: "#F59E0B" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                  {averageRating} ({business.reviews?.length || 0} reviews)
                </span>
              </div>

              <p style={styles.businessDescription}>{business.description}</p>

              <div style={styles.businessContact}>
                <div style={styles.contactItem}>
                  📍 <span>{business.address}</span>
                </div>
                <div style={styles.contactItem}>
                  📱 <span>{business.phone}</span>
                </div>
                <div style={styles.contactItem}>
                  ✉️ <span>{business.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Deals */}
          {activeDeals.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Current Deals</h2>
              <div style={styles.dealsGrid}>
                {activeDeals.map((deal) => (
                  <div key={deal.id} style={styles.dealCard}>
                    <div style={styles.dealHeader}>
                      <h3 style={styles.dealTitle}>{deal.title}</h3>
                    </div>
                    <div style={styles.dealContent}>
                      <p style={styles.dealDescription}>{deal.description}</p>

                      <div style={styles.dealMeta}>
                        <div style={styles.dealDate}>
                          <span>Starts:</span>
                          <span>{formatDate(deal.startDate)}</span>
                        </div>
                        <div style={styles.dealDate}>
                          <span>Ends:</span>
                          <span>{formatDate(deal.endDate)}</span>
                        </div>

                        {deal.discount && (
                          <div style={styles.dealDiscount}>
                            {deal.discount}% OFF
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Customer Reviews</h2>

            {/* Write a Review Form */}
            {auth?.user && !isBusinessOwner && (
              <div style={styles.reviewForm}>
                <h3 style={styles.reviewTitle}>Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Rating</label>
                    <div style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={styles.starButton}
                        >
                          {rating >= star ? "★" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="reviewText" style={styles.label}>
                      Your Review
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      style={styles.textarea}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    style={{
                      ...styles.button,
                      ...(reviewLoading ? styles.disabledButton : {}),
                    }}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {business.reviews?.length > 0 ? (
              <div style={styles.reviewsList}>
                {business.reviews.map((review) => {
                  const sentimentStyle = review.sentimentFeedback
                    ? getSentimentColor(review.sentimentFeedback.sentiment)
                    : { backgroundColor: "#F3F4F6", color: "#4B5563" };

                  return (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <span style={styles.reviewAuthor}>Anonymous User</span>
                        <div style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {review.rating >= star ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p style={styles.reviewText}>{review.text}</p>

                      {review.sentimentFeedback && (
                        <div
                          style={{
                            ...styles.sentimentBadge,
                            ...sentimentStyle,
                          }}
                        >
                          {review.sentimentFeedback.sentiment}
                        </div>
                      )}

                      <div style={styles.reviewDate}>
                        Posted on {formatDate(review.createdAt)}
                      </div>

                      {/* Business Owner Response */}
                      {review.response && review.response.text && (
                        <div style={styles.reviewResponse}>
                          <p style={styles.responseHeader}>
                            Response from the owner:
                          </p>
                          <p style={styles.responseText}>
                            {review.response.text}
                          </p>
                          <div style={styles.responseDate}>
                            Responded on {formatDate(review.response.createdAt)}
                          </div>
                        </div>
                      )}

                      {/* Response Form for Business Owner */}
                      {isBusinessOwner && !review.response && (
                        <div style={styles.responseForm}>
                          <textarea
                            placeholder="Write your response to this review..."
                            value={responseTexts[review.id] || ""}
                            onChange={(e) =>
                              setResponseTexts({
                                ...responseTexts,
                                [review.id]: e.target.value,
                              })
                            }
                            style={styles.responseTextarea}
                          ></textarea>
                          <button
                            onClick={() => handleResponseSubmit(review.id)}
                            disabled={
                              !responseTexts[review.id] || respondLoading
                            }
                            style={{
                              ...styles.responseButton,
                              ...(!responseTexts[review.id] || respondLoading
                                ? styles.disabledButton
                                : {}),
                            }}
                          >
                            Respond
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.noContent}>
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>
          © {new Date().getFullYear()} Community Engagement App. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
