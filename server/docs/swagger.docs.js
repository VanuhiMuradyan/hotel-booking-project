/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already registered
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/update/password:
 *   patch:
 *     summary: Update password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */

/**
 * @swagger
 * /api/auth/update/email:
 *   patch:
 *     summary: Update email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newEmail]
 *             properties:
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated
 */

/**
 * @swagger
 * /api/auth/update/profile:
 *   patch:
 *     summary: Update profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/auth/admin/signup:
 *   post:
 *     summary: Create admin (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 */


/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hotels
 */

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel details
 *       404:
 *         description: Hotel not found
 */

/**
 * @swagger
 * /api/hotels/admin/my-hotels:
 *   get:
 *     summary: Get admin's hotels
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin hotels
 */

/**
 * @swagger
 * /api/hotels/add:
 *   post:
 *     summary: Add hotel (Admin only)
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, city, country, price, availableRooms]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               price:
 *                 type: number
 *               availableRooms:
 *                 type: number
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Hotel created
 */

/**
 * @swagger
 * /api/hotels/delete/{id}:
 *   delete:
 *     summary: Delete hotel (Admin only)
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel deleted
 */




/**
 * @swagger
 * /api/booking/create/{id}:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [checkInDate, checkOutDate, numberOfGuests]
 *             properties:
 *               checkInDate:
 *                 type: string
 *               checkOutDate:
 *                 type: string
 *               numberOfGuests:
 *                 type: number
 *               roomsCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking created
 */

/**
 * @swagger
 * /api/booking/my-bookings:
 *   get:
 *     summary: Get user bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */

/**
 * @swagger
 * /api/booking/cancel/{id}:
 *   patch:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */

/**
 * @swagger
 * /api/booking/admin/all:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all bookings
 */

/**
 * @swagger
 * /api/booking/admin/status/{id}:
 *   patch:
 *     summary: Update booking status (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Status updated
 */


/**
 * @swagger
 * /api/rating/{id}:
 *   post:
 *     summary: Add rating/comment
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rate:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating added
 */

/**
 * @swagger
 * /api/rating/{id}:
 *   get:
 *     summary: Get ratings by hotel
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ratings
 */

/**
 * @swagger
 * /api/rating/{id}/comment:
 *   patch:
 *     summary: Update comment
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commentId, content]
 *             properties:
 *               commentId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 */

/**
 * @swagger
 * /api/rating/{id}:
 *   delete:
 *     summary: Delete rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating deleted
 */
