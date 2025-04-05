const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;

// Initialize the sentiment analyzer
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

/**
 * Analyze the sentiment of text
 * @param {string} text - The text to analyze
 * @returns {number} - Sentiment score (-5 to 5)
 */
const analyzeSentiment = (text) => {
    if (!text) return 0;

    // Tokenize the text into words
    const words = text.toLowerCase().split(/\s+/);

    // Get the sentiment score
    const score = analyzer.getSentiment(words);

    return score;
};

/**
 * Get sentiment feedback based on score
 * @param {number} score - Sentiment score
 * @returns {object} - Sentiment feedback
 */
const getSentimentFeedback = (score) => {
    let sentiment;
    let feedback;

    if (score < -0.5) {
        sentiment = 'Negative';
        feedback = 'This review has a negative sentiment. Consider addressing the concerns raised.';
    } else if (score < 0.2) {
        sentiment = 'Neutral';
        feedback = 'This review has a neutral sentiment. Consider finding ways to improve customer satisfaction.';
    } else {
        sentiment = 'Positive';
        feedback = 'This review has a positive sentiment. Great job!';
    }

    return {
        score,
        sentiment,
        feedback
    };
};

module.exports = {
    analyzeSentiment,
    getSentimentFeedback
}; 