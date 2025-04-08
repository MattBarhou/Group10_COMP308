const natural = require('natural');
const { WordTokenizer } = natural;
const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;
const tokenizer = new WordTokenizer();

// Initialize the sentiment analyzer with English language and AFINN lexicon
const analyzer = new Analyzer("English", stemmer, "afinn");

// List of positive and negative words to enhance the analysis
const positiveWords = ['great', 'good', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic', 'delicious', 'love', 'perfect'];
const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointing', 'worst', 'hate'];

/**
 * Analyze the sentiment of text
 * @param {string} text - The text to analyze
 * @returns {number} - Sentiment score (-5 to 5)
 */
const analyzeSentiment = (text) => {
    if (!text) return 0;

    // Convert to lowercase and tokenize
    const tokens = tokenizer.tokenize(text.toLowerCase());
    if (!tokens || tokens.length === 0) return 0;

    // Get base sentiment score
    let score = analyzer.getSentiment(tokens);

    // Enhance score based on specific words
    tokens.forEach(token => {
        if (positiveWords.includes(token)) {
            score += 0.5;
        } else if (negativeWords.includes(token)) {
            score -= 0.5;
        }
    });

    // Normalize score to be between -5 and 5
    score = Math.max(-5, Math.min(5, score * 5));

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

    if (score <= -2) {
        sentiment = 'Very Negative';
        feedback = 'This review expresses significant concerns. Immediate attention may be required.';
    } else if (score < 0) {
        sentiment = 'Negative';
        feedback = 'This review has a negative sentiment. Consider addressing the concerns raised.';
    } else if (score === 0) {
        sentiment = 'Neutral';
        feedback = 'This review has a neutral sentiment. Consider finding ways to improve customer satisfaction.';
    } else if (score <= 2) {
        sentiment = 'Positive';
        feedback = 'This review has a positive sentiment. Keep up the good work!';
    } else {
        sentiment = 'Very Positive';
        feedback = 'This review is extremely positive. Excellent job!';
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