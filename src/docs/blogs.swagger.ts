/**
 * @swagger
 * components:
 *   parameters:
 *      PageParam:
 *        in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 0
 *          required: false
 *        description: Page number for pagination
 *      LimitParam:
 *         in: query
 *         name: limit
 *         schema:
 *          type: string
 *          default: 0
 *          required: false
 *         description: Number of items per page
 *      SearchParam:
 *        in: query
 *        name: search
 *        schema:
 *          type: string
 *          required: false
 *        description: Filter by seach keyword
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve a list of all blogs from the database
 *     tags: [Blogs]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: A list of blogs
 */
/**
 * @swagger
 * /blogs/{category}:
 *   get:
 *     summary: Get blogs by category
 *     description: Retrieve a list of all blogs matching specified category
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Filter by category
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: A list of blogs
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create blog
 *     description: Add a new blog to the database
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "This is Our new blog post"
 *               content:
 *                 type: string
 *                 example: "This is the blog content"
 *               category:
 *                 type: string
 *                 example: "category"
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Blog with the same title already exists
 *       401:
 *         description: Authorization required!
 *       422:
 *         description: Invalid input
 */

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update blog
 *     description: Update a blog in the database
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog-ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "This is Our new blog post"
 *               content:
 *                 type: string
 *                 example: "This is the blog content"
 *               category:
 *                 type: string
 *                 example: "category"
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Blog with the same title already exists
 *       401:
 *         description: Unauthorized access!
 *       404:
 *         description: Blog not found!
 *       422:
 *         description: Invalid input
 */

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete blog
 *     description: Delete blog wiht the provided blog-id from the databse
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog-ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized access!
 *       404:
 *         description: Blog not found!
 *       422:
 *         description: Invalid input
 */
