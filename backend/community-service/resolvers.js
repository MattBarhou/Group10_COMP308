const Post = require('./models/Post');
const HelpRequest = require('./models/HelpRequest');
const EmergencyAlert = require('./models/EmergencyAlert');
const Event = require('./models/Event');

const resolvers = {
    User: {
        __resolveReference: async (user) => {
            // Return the user reference with only the id
            // This tells Apollo Federation this is a reference to a User
            return { ...user };
        },
        posts: async (user) => await Post.find({ author: user.id }),
        helpRequests: async (user) => await HelpRequest.find({ requester: user.id }),
        emergencyAlerts: async (user) => await EmergencyAlert.find({ reporter: user.id }),
        events: async (user) => await Event.find({ organizer: user.id })
    },

    Post: {
        __resolveReference: async (post) => await Post.findById(post.id),
        author: async (post) => ({ __typename: 'User', id: post.author })
    },

    HelpRequest: {
        __resolveReference: async (helpRequest) => await HelpRequest.findById(helpRequest.id),
        requester: async (helpRequest) => ({ __typename: 'User', id: helpRequest.requester }),
        matchedVolunteers: async (helpRequest) => helpRequest.matchedVolunteers.map(id => ({ __typename: 'User', id }))
    },

    EmergencyAlert: {
        __resolveReference: async (alert) => await EmergencyAlert.findById(alert.id),
        reporter: async (alert) => ({ __typename: 'User', id: alert.reporter })
    },

    Event: {
        __resolveReference: async (event) => await Event.findById(event.id),
        organizer: async (event) => ({ __typename: 'User', id: event.organizer }),
        volunteers: async (event) => event.volunteers.map(id => ({ __typename: 'User', id }))
    },

    Query: {
        posts: async () => await Post.find(),
        helpRequests: async () => await HelpRequest.find(),
        emergencyAlerts: async () => await EmergencyAlert.find(),
        events: async () => await Event.find(),
        post: async (_, { id }) => await Post.findById(id),
        helpRequest: async (_, { id }) => await HelpRequest.findById(id),
        emergencyAlert: async (_, { id }) => await EmergencyAlert.findById(id),
        event: async (_, { id }) => await Event.findById(id)
    },

    Mutation: {
        createPost: async (_, { title, content, type }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const post = new Post({
                title,
                content,
                author: user.id,
                type,
                summary: content.length > 100 ? content.substring(0, 100) + '...' : null
            });
            return await post.save();
        },

        createHelpRequest: async (_, { title, description }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const request = new HelpRequest({
                title,
                description,
                requester: user.id
            });
            return await request.save();
        },

        createEmergencyAlert: async (_, { title, description, severity, location }, { user }) => {
            if (!user) throw new Error('Authentication required');
            if (!user.id) throw new Error('Invalid user ID');

            const alert = new EmergencyAlert({
                title,
                description,
                reporter: user.id,
                severity,
                location
            });
            return await alert.save();
        },

        createEvent: async (_, { title, description, date, location }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const event = new Event({
                title,
                description,
                organizer: user.id,
                date,
                location,
                suggestedTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
            return await event.save();
        },

        volunteerForEvent: async (_, { eventId }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const event = await Event.findById(eventId);
            if (!event) throw new Error('Event not found');

            if (!event.volunteers.includes(user.id)) {
                event.volunteers.push(user.id);
                await event.save();
            }
            return event;
        },

        volunteerForHelpRequest: async (_, { requestId }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const request = await HelpRequest.findById(requestId);
            if (!request) throw new Error('Help request not found');

            if (!request.matchedVolunteers.includes(user.id)) {
                request.matchedVolunteers.push(user.id);
                request.status = 'IN_PROGRESS';
                await request.save();
            }
            return request;
        }
    }
};

module.exports = resolvers; 