const user = {
    _id: '1',
    name: 'Pavel',
    email: 'pasha@gmail.com',
    picture: 'https://cloudinary.com/asa',
};

module.exports = {

    Query: {
        me: () => user
    }
};
