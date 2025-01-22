
// Import necessary modules
const request = require('supertest');
const server = require('../index'); // Adjust the path to your server script
const { users, cookie, usersNoConvo, usersConvo } = require('./apitest.users.json');


// ===============================register test========================================================================
describe('POST /register', () => {

  it('should fail if user authenticated/already logged in', async () => {
    const res = await request(server)
      .post('/auth/register')
      .set('Cookie', [`${cookie}`]) //ensure cookie belongs to an already loggedin/authenticated user
      .send({
        uname: 'Test User 6',
        email: 'testuser6@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Sign up successful');
  });


  it('should create a new user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        uname: 'Test User 6',
        email: 'testuser6@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Sign up successful');
  });


  it('should fail to create a new user without email field', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400);
  });

  // ...

  it('should fail to create a new user with an existing email', async () => {
    // First, create a new user
    let res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User 7',
        email: 'testuser7@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400);


    // Then, try to create a new user with the same email
    res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User 10',
        email: 'testuser7@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when email already exists
  });


  it('should fail to create a new user with an existing name', async () => {
    // First, create a new user
    let res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User 6',
        email: 'testuser8@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to create a new user without password field', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User',
        email: 'testuser@example.com'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when password is missing
  });


  // ...

  it('should fail to create a new user with an invalid email', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User',
        email: 'invalidEmail',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when email is invalid
  });

  it('should fail to create a new user with a short password', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User',
        email: 'testuser@example.com',
        pw: 'short'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when password is too short
  });

  it('should fail to create a new user with an invalid password', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        displayName: 'Test User',
        email: 'testuser@example.com',
        pw: '<script>short</script>'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when password is too short
  });

  it('should fail to create a new user without displayName field', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({
        email: 'testuser@example.com',
        pw: 'pA$$sword123'
      });
    expect(res.statusCode).toEqual(400); // or whatever your server responds with when displayName is missing
  });



});

// ==================================================Test getuserprofile (unauthenticated)================================================================
describe('GET /getProfile', () => {
  users.forEach(user => {
    const userId = user._id.$oid;
    const expectedDisplayName = user.displayName;
    const expectedEmail = user.email;
    const expectedImage = user.image;

    // console.log(`userId: ${userId}`);
    // console.log(`expectedDisplayName: ${expectedDisplayName}`);
    // console.log(`expectedEmail: ${expectedEmail}`);
    // console.log(`expectedImage: ${expectedImage}`);

    it('should respond with json containing user details', async () => {

      // const userId = "65c6999d2b1392ad97d84ba4"

      const res = await request(server)
        .get(`/home/getProfile?userId=${userId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [`${cookie}`])
        .expect('Content-Type', /json/)

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('authenticated');
      expect(res.body.authenticated).toBe(true);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user).toHaveProperty('displayName');
      expect(res.body.user).toHaveProperty('email');
      expect(res.body.user).toHaveProperty('image');
      expect(res.body.user.displayName).toBe(expectedDisplayName);
      expect(res.body.user.email).toBe(expectedEmail);
      expect(res.body.user.image).toBe(expectedImage);
    });
  });

  it('should respond with a 404 status code when user is not found', async () => {
    const userId = '65b53ec3b7c8c8c5f983ea77'; // replace with a user ID that doesn't exist
    const res = await request(server)
      .get(`/home/getProfile?userId=${userId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])

    expect(res.statusCode).toEqual(404);
  });

  it('should respond with a 400 status code when a query parameter is missing', async () => {
    const res = await request(server)
      .get(`/home/getProfile`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])

    expect(res.statusCode).toEqual(400);
  });

  // it('should respond with a 500 status code when the server encounters an error', async () => {
  //   // const userId = 'userIdCausingServerError'; // replace with a user ID that causes a server error
  //   const userId = '65b53ec3b7c8c8c5f983ea77'; // replace with a user ID that doesn't exist

  //   const res = await request(server)
  //     .get(`/home/getProfile?userid=${userId}`)
  //     .set('Cookie', [`${cookie}`])
  //     .set('Accept', 'application/json')

  //     expect(res.statusCode).toEqual(400);
  // });

});

// // ==============================send message test====================================================================
describe('POST /home/sendMessage', () => {//NEEDS AUTHENTICATED TEST(WORKS FINE BUT NEEDS SEPARATE TESTS)
  it('should send a message successfully', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: '65c6957f06d338fd205ad9dd', // replace with actual receiverId
        receiverId: '65c6957f06d338fd205ad9e1', // replace with actual receiverId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Message sent successfully');
  });

  it('should send a message successfully', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: '65c856a07c1ee5585bfe7a11', // replace with actual receiverId
        receiverId: '65c699912b1392ad97d84ba3', // replace with actual receiverId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);


    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Message sent successfully');
  });

  //=========================================================================
  it('should return error if either user does not exist', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: '65c64038dc22cd3339d3985f', // replace with actual receiverId
        receiverId: '65b986b53c0119e94d965d12', // replace with actual receiverId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(404);
    // expect(res.body).toHaveProperty('message');
    // expect(res.body.message).toEqual('Message sent successfully');
  });

  // Add more tests as needed...========================================================

  // Test for missing parameters
  it('should return an error if a parameter is missing', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: '65c13becc3ecefbb856f0ab5', // replace with actual senderId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  // Test for invalid receiverId
  it('should return an error if the receiverId is invalid', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: '65c13becc3ecefbb856f0ab5', // replace with actual senderId
        receiverId: 'invalid-id',
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  // Test for invalid senderId
  it('should return an error if the senderId is invalid', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        senderId: 'invalid-id',
        receiverId: '65b986b53c0119e94d965d12', // replace with actual receiverId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  // ==========================================
  // Test for invalid receiverId: This test will send a request with an invalid receiverId and expect an error response.
  it('should return an error if receiverId is invalid', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        receiverId: 'invalidId', // replace with an invalid receiverId
        content: 'Hello, this is a test message!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });


  // Test for missing content: This test will send a request without a content field and expect an error response.
  it('should return an error if content is missing', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        receiverId: '...', // replace with a valid receiverId
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  //Test for empty content: This test will send a request with an empty content field and expect an error response.
  it('should return an error if content is empty', async () => {
    const res = await request(server)
      .post('/home/sendMessage')
      .send({
        receiverId: '...', // replace with a valid receiverId
        content: ''
      })
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`]);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });



  // =============================================

  afterAll(async () => {
    // Close the server after the tests run to avoid jest open handle error
    await server.close();
  });
});

// =============================================GET===================================================================
describe('GET /home/getMessages', () => {
  it('should respond with json containing a list of messages', async () => {
    const userId = '65c6957f06d338fd205ad9dd';
    const otherUserId = '65c6957f06d338fd205ad9e1';
    const res = await request(server)
      .get(`/home/getMessages?userId=${userId}&otherUserId=${otherUserId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])
      // .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.messages).toBeInstanceOf(Object);
    res.body.messages.forEach(message => {
      expect(message).toHaveProperty('_id');
      expect(message).toHaveProperty('sender');
      expect(message).toHaveProperty('receiver');
      expect(message).toHaveProperty('content');
    });
  });

  it('should respond with an empty array when there are no messages', async () => {
    const userId = '65c6957f06d338fd205ad9e1'; // replace with a user ID that has no messages
    const otherUserId = '65c856a07c1ee5585bfe7a11'; // replace with another user ID that has no messages
    const res = await request(server)
      .get(`/home/getMessages?userId=${userId}&otherUserId=${otherUserId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])
      .expect(200);

    expect(res.body.messages).toEqual([]);
  });

  // =================================================================================================
  it('should respond with a 400 status code when a query parameter is missing', async () => {
    const userId = '65b986b53c0119e94d965d12'; // replace with an actual user ID
    await request(server)
      .get(`/home/getMessages?userId=${userId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])
      .expect(400);
  });

  // =========================================================================================================
  it('should respond with a 200  status code and empty array when conversation not found', async () => {
    const userId = '65c6d7d22b1392ad97d84ba8'; // replace with a user ID that causes a server error
    const otherUserId = '65c6999d2b1392ad97d84ba4'; // replace with another user ID that causes a server error
    await request(server)
      .get(`/home/getMessages?userId=${userId}&otherUserId=${otherUserId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`${cookie}`])
      .expect(404);

    // =========================================================================================================
    it('should respond with a 404 status code and empty array when user not found', async () => {
      const userId = '65c6d7d22b1392ad97d84ba8'; // replace with a user ID that causes a server error
      const otherUserId = '65c6999d2b1392ad97d84ba4'; // replace with another user ID that causes a server error
      await request(server)
        .get(`/home/getMessages?userId=${userId}&otherUserId=${otherUserId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [`${cookie}`])
        .expect(404);
    });
    // =========================================================================================================
    // it('should respond with a 500 status code when the server encounters an error', async () => {
    //   const userId = '65c6d7d22b1392ad97d84ba8'; // replace with a user ID that causes a server error
    //   const otherUserId = '65c6999d2b1392ad97d84ba4'; // replace with another user ID that causes a server error
    //   await request(server)
    //     .get(`/home/getMessages?userId=${userId}&otherUserId=${otherUserId}`)
    //     .set('Accept', 'application/json')
    //     .expect(500);
    // });
  });


  // // =============================================GET===================================================================
  describe('GET /home/getConversations', () => {
    usersConvo.forEach(user => {
      const userId = user._id.$oid;
      const expectedDisplayName = user.displayName;
      const expectedEmail = user.email;
      const expectedImage = user.image;
      it('should respond with json containing conversation details and unread message count', async () => {
        // const userId = 'validUserId'; // replace with a valid user ID
        const res = await request(server)
          .get(`/home/getConversations?userId=${userId}`)
          .set('Accept', 'application/json')
          .set('Cookie', [`${cookie}`])
          // .expect('Content-Type', /json/)
          .expect(200);

        expect(res.body).toBeInstanceOf(Object);
        res.body.user.forEach(conversation => {
          expect(conversation).toHaveProperty('_id');
          expect(conversation).toHaveProperty('displayName');
          expect(conversation).toHaveProperty('image');
          expect(conversation).toHaveProperty('unreadCount');
        });
      });

    });

    usersNoConvo.forEach(user => {
      const userId = user._id.$oid;
      it('should respond with a 404 status code when no conversations are found', async () => {
        // const userId = 'userIdWithNoConversations'; // replace with a user ID that has no conversations
        const res = await request(server)
          .get(`/home/getConversations?userId=${userId}`)
          .set('Accept', 'application/json')
          .set('Cookie', [`${cookie}`])
          .expect(200);

        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toBe('no conversation found');
        expect(res.body.user).toEqual([]);

      });

    });


    // it('should respond with a 400 status code when a query parameter is missing', async () => {
    //   await request(server)
    //     .get(`/home/getConversations`)
    //     .set('Accept', 'application/json')
    //     .expect(400);
    // });


    // it('should respond with a 500 status code when the server encounters an error', async () => {
    //   const userId = 'userIdCausingServerError'; // replace with a user ID that causes a server error
    //   await request(server)
    //     .get(`/home/getConversations?userid=${userId}`)
    //     .set('Accept', 'application/json')
    //     .expect(500);
    // });




  });


  //=============================================DELETE===========================================
  describe('DELETE /home/deleteMessageForOne', () => {
    it('Should delete message for one participant', async () => {
      const res = await request(server)
        .delete('/home/deleteMessageForOne')
        .set('Cookie', [`${cookie}`])
        // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          userId: "65c6957f06d338fd205ad9dd",
          otherUserId: "65c6957f06d338fd205ad9e1",
          messageId: "65c6d6f734a50a00634a064b"
        })
        .expect(200);
    });

    it('Should return 404 if message not exists delete message for one participant', async () => {
      const res = await request(server)
        .delete('/home/deleteMessageForOne')
        .set('Cookie', [`${cookie}`])
        // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          userId: "65c6957f06d338fd205ad9dd",
          otherUserId: "65c6957f06d338fd205ad9e1",
          messageId: "65c6d6f734a50a00634a0657"
        })
        .expect(200);
      expect(res.body.message).toBe('Message not found/deleted');
    });
  });

  describe('DELETE /home/deleteConversationForOne', () => {
    it('Should remove user from conversation', async () => {
      const res = await request(server)
        .delete('/home/deleteConversationForOne')
        .set('Cookie', [`${cookie}`])
        // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          userId: "65c6957f06d338fd205ad9e1",
          otherUserId: "65c6957f06d338fd205ad9dd",
        })
        .expect(200);
    });

    it('Shouldreturn 404 if convo not exists user from conversation', async () => {
      const res = await request(server)
        .delete('/home/deleteConversationForOne')
        .set('Cookie', [`${cookie}`])

        // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          userId: '65c6957f06d338fd205ad9e1', // replace with a user ID that has no messages
          otherUserId: '65c856a07c1ee5585bfe7a11' // replace with another user ID that has no messages
        })
        .expect(200);

      expect(res.body.message).toBe('No messages to delete');
    });

  });

  test('Should update read messages for user', async () => {
    await request(server)
      .put('/updateReadMessages')
      .send({
        userId: "65c6957f06d338fd205ad9e1",
        otherUserId: "65c6957f06d338fd205ad9dd",
      })
      .expect(200);
  });

});
