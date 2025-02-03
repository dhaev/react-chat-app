const request = require('supertest');
// const server = require('../index');

// ===============================register test========================================================================
describe('POST /register', () => {

    // it('should fail if user authenticated/already logged in', async () => {
    //   const res = await request(server)
    //     .post('/auth/register')
    //     .set('Cookie', [`${cookie}`]) //ensure cookie belongs to an already loggedin/authenticated user
    //     .send({
    //       uname: 'Test User 6',
    //       email: 'testuser6@example.com',
    //       pw: 'pA$$sword123'
    //     });
    //   expect(res.statusCode).toEqual(200);
    //   expect(res.body).toHaveProperty('message', 'Sign up successful');
    // });
  
  
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
  