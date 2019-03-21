/* eslint-disable  no-var */
/* eslint-disable  no-restricted-syntax */
/* eslint-disable  vars-on-top */
/* eslint-disable  no-alert */

const CONTACT_REGEX = /^\d+$/;
let previousCode = '';

function backToProductListPage() {
  window.location = '/';
}

function validateNumber(ele) {
  // const ele = ;
  const { value } = ele;
  // console.log(value);
  if (value !== '') {
    if (!CONTACT_REGEX.test(value)) {
      ele.value = value.replace(/[^\d+$]/, '');
    }
  }
}

function validateUPC12(upcCode) {
  console.log(upcCode.toString().length);
  return upcCode.toString().length === 12;
}

async function getProductDetails(upcCode) {
  try {
    const product = await axios.get(`/product/details/${upcCode}`);
    return product.data.data;
  } catch (err) {
    console.error(err);
    alert('Opps!! Something went wrong!');
  }
  return null;
}

async function populateData(code) {
  const product = await getProductDetails(code);
  if (product) {
    const { barcode, name, brand } = product;

    var upcCodeTextField = document.getElementById('upcCode');
    var brandTextField = document.getElementById('brand');
    var productNameTextField = document.getElementById('productName');

    upcCodeTextField.value = barcode;
    brandTextField.value = brand;
    productNameTextField.value = name;
  }
}

function updateProductDetails(productDetails) {
  return axios.put('/product/update', productDetails);
}

async function save() {
  var upcCodeTextField = document.getElementById('upcCode');
  var brandTextField = document.getElementById('brand');
  var productNameTextField = document.getElementById('productName');

  const upcCode = upcCodeTextField.value;
  const brand = brandTextField.value;
  const productName = productNameTextField.value;

  if (_.isEmpty(upcCode)) {
    alert('UPC12 barcode should not be blank');
    return;
  }

  if (_.isEmpty(brand)) {
    alert('Brand name should not be blank');
    return;
  }

  if (_.isEmpty(productName)) {
    alert('Product name should not be blank');
    return;
  }

  const isUpcCodeValid = validateUPC12(upcCode);
  if (!isUpcCodeValid) {
    alert('Invalid UPC12 barcode given, it must only contain 12 digits');
    return;
  }

  try {
    const res = await updateProductDetails({
      previousBarcode: parseInt(previousCode, 10),
      barcode: parseInt(upcCode, 10),
      brand,
      name: productName,
    });

    const responseBody = res.data;
    if (responseBody.status === 'OK') {
      alert('Update product details successful.');
      backToProductListPage();
    }
  } catch (err) {
    console.error(err);
    const statusCode = err.response.status;
    if (statusCode === 409) {
      alert('The barcode given is already existed in the product list, please insert a unique barcode');
    } else {
      alert('Opps!! Something went wrong!');
    }
  }
}

function cancelEdit() {
  window.history.back();
  // window.location = '/';
}

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('code') && urlParams.get('code') !== '') {
    previousCode = urlParams.get('code');
    populateData(previousCode);
  } else {
    cancelEdit();
  }
}
