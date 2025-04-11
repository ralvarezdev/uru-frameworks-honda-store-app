const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')
const functions = require('firebase-functions/v2')
const serviceAccount = require(
  '../../uru-frameworks-honda-store-firebase-adminsdk.json')

// Initialize the Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Firebase Firestore instance
const firestore = getFirestore(app);

// Check if the user is authenticated
function checkAuth(context) {
  if (!context?.auth || !context?.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated',
      'User must be authenticated.'
    );
  }

  return context.auth.uid;
}

// Get the current pending cart reference for the user
async function getCurrentPendingCartRef(userId) {
  const cartRef = firestore.collection('carts').where('owner',
    '==',
    userId
  ).where('status', '==', 'pending');
  return await cartRef.get();
}

// Get a product data by ID
async function getProductDataById(productId) {
  const productRef = firestore.collection('products').doc(productId);
  const productSnapshot = await productRef.get();

  // Check if the product exists
  if (!productSnapshot.exists) {
    throw new functions.https.HttpsError('not-found', 'Product not found.');
  }

  return [productRef, productSnapshot.data()];
}

// Check if the product is active
async function checkProductActive(productData) {
  if (!productData?.active) {
    throw new functions.https.HttpsError('unavailable',
      'This product is currently unavailable.'
    );
  }
}

// Check if the product has stock
async function checkProductStock(productData, stock) {
  if (productData?.stock <= 0) {
    throw new functions.https.HttpsError('unavailable',
      'This product is out of stock.'
    );
  }

  if (stock && productData?.stock < stock) {
    throw new functions.https.HttpsError('unavailable',
      'Not enough stock available.'
    );
  }
}

// Validate if the field is a string
function validateStringField(fieldValue, fieldName) {
  if (!fieldValue) {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} is required.`
    );
  }

  if (typeof fieldValue !== 'string' || fieldValue.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} must be a non-empty string.`
    );
  }
}

// Validate if the field is a boolean
function validateBooleanField(fieldValue, fieldName) {
  if (!fieldValue) {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} is required.`
    );
  }

  if (typeof fieldValue !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} must be a boolean.`
    );
  }
}

// Validate if the field is positive
function validatePositiveNumberField(fieldValue, fieldName) {
  if (!fieldValue) {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} is required.`
    );
  }

  if (typeof fieldValue !== 'number' || fieldValue <= 0) {
    throw new functions.https.HttpsError('invalid-argument',
      `${fieldName} must be a positive number.`
    );
  }
}

// Function to create a user
exports.createUser = functions.https.onCall(async (data, context) => {
  // Validate input data
  const {uid, first_name, last_name} = data;
  for (const fieldKey of Object.keys({
    'UID': uid,
    'First name': first_name,
    'Last name': last_name,
  })) {
    validateStringField(data[fieldKey], fieldKey);
  }

  // Create a new user object
  const newUser = {
    uid: uid,
    first_name: first_name,
    last_name: last_name,
  };

  // Save the user to Firestore
  await firestore.collection('users').doc(uid).set(newUser);

  return {message: 'User created successfully.'};
});

// Function to get a user by ID
exports.getUserByd = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Retrieve the user document
  const userDoc = await firestore.collection('users').doc(userId).get();

  // Return the user data
  const userData = userDoc.data();
  return {first_name: userData.first_name, last_name: userData.last_name};
});

// Function to add a product to the cart
exports.addProductToCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId, quantity} = data;
  validateStringField(productId, 'Product ID');
  validatePositiveNumberField(quantity, 'Quantity');

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);

  // Get the product data
  const productData = await getProductDataById(productId);

  // Check if the product is active
  await checkProductActive(productData);

  // Check if the product has stock
  await checkProductStock(productData, quantity);

  if (cartSnapshot.empty) {
    // Create a new cart
    const newCart = {
      owner: userId,
      status: 'pending',
      products: {
        [productId]: {
          id: productId,
          price: productData.price,
          quantity: quantity,
        },
      },
    };
    await firestore.collection('carts').add(newCart);
  } else {
    const cartDocument = cartSnapshot.docs[0];
    const cartData = cartDocument.data();
    const existingProduct = cartData.products && cartData.products[productId];

    const updatedProducts = {...cartData.products};

    // Check if the product already exists in the cart
    if (existingProduct) {
      // Update the quantity of the existing product
      updatedProducts[productId].quantity += quantity;
    } else {
      updatedProducts[productId] = {
        id: productId,
        price: productData.price,
        quantity: quantity,
      };
    }

    await cartDocument.ref.update({products: updatedProducts});
  }

  return {message: 'Product added to cart successfully.'};
});

// Function to remove a product from the cart
exports.removeProductFromCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId} = data;
  validateStringField(productId, 'Product ID');

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);
  if (cartSnapshot.empty) {
    throw new functions.https.HttpsError('not-found',
      'No pending cart found for this user.'
    );
  }

  // Get the cart document
  const cartDocument = cartSnapshot.docs[0];
  const cartData = cartDocument.data();
  if (!cartData?.products[productId]) {
    throw new functions.https.HttpsError('not-found',
      'Product not found in the cart.'
    );
  }

  // Remove the product from the cart
  const updatedProducts = {...cartData.products};
  delete updatedProducts[productId];

  await cartDocument.ref.update({products: updatedProducts});

  return {message: 'Product removed from cart successfully.'};
});

// Function to update the quantity of a product in the cart
exports.updateProductQuantityInCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId, quantity} = data;
  validateStringField(productId, 'Product ID');
  validatePositiveNumberField(quantity, 'Quantity');

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);
  if (cartSnapshot.empty) {
    throw new functions.https.HttpsError('not-found',
      'No pending cart found for this user.'
    );
  }

  // Get the cart document
  const cartDocument = cartSnapshot.docs[0];
  const cartData = cartDocument.data();
  if (!cartData?.products[productId]) {
    throw new functions.https.HttpsError('not-found',
      'Product not found in the cart.'
    );
  }

  // Get the product data
  const [, productData] = await getProductDataById(productId);

  // Check if the product is active
  await checkProductActive(productData);

  // Check if the product has stock
  await checkProductStock(productData, quantity);

  const updatedProducts = {...cartData.products};
  updatedProducts[productId].quantity = quantity;

  await cartDocument.ref.update({products: updatedProducts});

  return {message: 'Product quantity updated successfully.'};
});

// Function to get the cart
exports.getCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);
  if (cartSnapshot.empty) {
    throw new functions.https.HttpsError('not-found',
      'No pending cart found for this user.'
    );
  }

  // Get the cart document
  const cartDocument = cartSnapshot.docs[0];
  const cartData = cartDocument.data();

  return {cart: cartData};
});

// Function to clear the cart
exports.clearCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);
  if (cartSnapshot.empty) {
    throw new functions.https.HttpsError('not-found',
      'No pending cart found for this user.'
    );
  }

  // Get the cart document
  const cartDocument = cartSnapshot.docs[0];

  await cartDocument.ref.update({products: {}});

  return {message: 'Cart cleared successfully.'};
});

// Function to check out the cart
exports.checkoutCart = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Get the current pending cart
  const cartSnapshot = await getCurrentPendingCartRef(userId);
  if (cartSnapshot.empty) {
    throw new functions.https.HttpsError('not-found',
      'No pending cart found for this user.'
    );
  }

  // Get the cart document
  const cartDocument = cartSnapshot.docs[0];

  // Perform checkout logic here (e.g., payment processing, order creation)

  // Update the cart status to 'completed'
  await cartDocument.ref.update({status: 'completed'});

  return {message: 'Checkout completed successfully.'};
});

// Function to create a new product
exports.createProduct = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {title, description, price, stock, active, brand, tags, image_url} = data;
  for (const fieldKey of Object.keys({
    'Title': title,
    'Description': description,
    'Brand': brand,
    'Image URL': image_url,
  })) {
    validateStringField(data[fieldKey], fieldKey);
  }
  for (const fieldKey of Object.keys({
    'Price': price,
    'Stock': stock,
  })) {
    validateStringField(data[fieldKey], fieldKey);
  }
  validateBooleanField(active, 'Active');

  // Create a new product object
  const newProduct = {
    title: title,
    description: description,
    price: price,
    stock: stock,
    active: active,
    brand: brand,
    tags: Array.isArray(tags) ? tags : [],
    owner: userId,
    image_url: image_url,
  };
  const productRef = await firestore.collection('products').add(newProduct);

  return {message: 'Product created successfully.', productId: productRef.id};
});

// Function to update a product
exports.getProducts = functions.https.onCall(async (data, context) => {
  // Validate input data
  const {limit = 10, offset = 0} = data;
  for (const fieldKey of Object.keys({
    'Limit': limit,
    'Offset': offset,
  })) {
    validatePositiveNumberField(data[fieldKey], fieldKey);
  }

  // Get the products
  const productsRef = firestore.collection('products')
    .where('active', '==', true)
    .limit(limit)
    .offset(offset);
  const productSnapshot = await productsRef.get();
  const products = [];
  productSnapshot.forEach(doc => {
    products.push({id: doc.id, ...doc.data()});
  });

  // Get the total count of active products
  const totalCountSnapshot = await firestore.collection('products').where(
    'active',
    '==',
    true
  ).count().get();
  const totalCount = totalCountSnapshot.data().count;

  return {products, totalCount};
});

// Function to get a product by ID
exports.getProductById = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId} = data;
  validateStringField(productId, 'Product ID');

  // Get the product data
  const [productRef, productData] = await getProductDataById(productId);

  // Check if the product is active if the user is not the owner
  if (productData.owner !== userId) {
    await checkProductActive(productData);
  }

  return {product: {id: productRef.id, ...productData}};
});

// Function to update a product
exports.updateProduct = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId, title, description, price, stock, active, brand, tags, image_url} = data;
  validateStringField(productId, 'Product ID');

  // Build the updates object
  const updates = {};
  for (const fieldKey of Object.keys({
    title,
    description,
    price,
    stock,
    active,
    brand,
    tags,
    image_url,
  })) {
    if (data[fieldKey] !== undefined) {
      updates[fieldKey] = data[fieldKey];
    }
  }

  // Get the product data
  const [productRef, productData] = await getProductDataById(productId);
  if (productData.owner !== userId) {
    throw new functions.https.HttpsError('permission-denied',
      'You are not the owner of this product.'
    );
  }

  await productRef.update({...updates});

  return {message: 'Product updated successfully.'};
});

// Function to remove a product
exports.removeProduct = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  const userId = checkAuth(context);

  // Validate input data
  const {productId} = data;
  validateStringField(productId, 'Product ID');

  // Get the product data
  const [productRef, productData] = await getProductDataById(productId);
  if (productData.owner !== userId) {
    throw new functions.https.HttpsError('permission-denied',
      'You are not the owner of this product.'
    );
  }
  await productRef.delete();

  return {message: 'Product removed successfully.'};
});
