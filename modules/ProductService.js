/* eslint-disable  no-var */
/* eslint-disable  no-restricted-syntax */
/* eslint-disable  vars-on-top */
// const { products } = require('../config');
const fs = require('fs');
const _ = require('lodash');

const sortProductByNameInAsc = (productList) => {
  productList.sort((p1, p2) => ((p1.name > p2.name) ? 1 : ((p2.name > p1.name) ? -1 : 0)));
};

const getProductJsonFile = async () => {
  try {
    const productList = await fs.readFileSync('product.json').toString();
    return JSON.parse(productList);
  } catch (err) {
    console.error('Error while retrieving products list', err);
    throw err;
  }
};

const getProductList = async (number) => {
  try {
    const products = await getProductJsonFile();
    sortProductByNameInAsc(products);
    return products.slice(0, number + 1);
  } catch (err) {
    console.error('Error', err);
    throw err;
  }
};

const updateList = async (productList) => {
  console.log('Writing new product list');
  try {
    await fs.writeFileSync('product.json', JSON.stringify(productList, null, 2), 'utf8');
    console.log('Done');
    return;
  } catch (err) {
    console.error('Error while writing new product list into json', err);
    throw err;
  }
};

const saveProduct = async (productDetails) => {
  const newProductList = [];
  const products = await getProductJsonFile();
  const {
    previousBarcode,
    barcode: newBarcode,
    brand: newBrand,
    name: newProductName,
  } = productDetails;

  for (const product of products) {
    const { barcode, brand, name } = product;
    if (parseInt(barcode, 10) === previousBarcode) {
      newProductList.push({
        barcode: parseInt(newBarcode, 10),
        brand: newBrand,
        name: newProductName,
      });
    } else {
      newProductList.push({
        barcode: parseInt(barcode, 10),
        brand,
        name,
      });
    }
  }

  try {
    await updateList(newProductList);
    return true;
  } catch (err) {
    console.log('Error', err);
    throw err;
  }
};

const searchByBrandAndProductName = async (brandName, productName) => {
  let productList = [];
  const filterdProductList = [];

  try {
    productList = await getProductJsonFile();
  } catch (err) {
    console.error('Error', err);
    throw err;
  }

  for (const product of productList) {
    const { brand, name } = product;
    let toDisplay = false;

    if (brandName !== 'none') {
      if (brand.toUpperCase().indexOf(brandName.toUpperCase()) > -1) {
        toDisplay = true;
      }
    }

    if (productName !== 'none') {
      if (name.toUpperCase().indexOf(productName.toUpperCase()) > -1) {
        toDisplay = true;
      }
    }

    if (toDisplay) {
      filterdProductList.push(product);
    }
  }

  sortProductByNameInAsc(filterdProductList);
  return filterdProductList;
};

const getProductDetailsByUPC = async (upc) => {
  const products = await getProductJsonFile();
  const product = products.find(p => p.barcode === parseInt(upc, 10));
  return product;
};

const checkIsNewBarcodeExists = async (newUpc) => {
  const product = await getProductDetailsByUPC(newUpc);
  return (!_.isEmpty(product));
};

module.exports = {
  getProductList,
  searchByBrandAndProductName,
  getProductDetailsByUPC,
  checkIsNewBarcodeExists,
  saveProduct,
};
