const express = require('express');
// const path = require('path');
const url = require('url');
const _ = require('lodash');
const productSvc = require('../modules/ProductService');
const RestRes = require('../modules/RestResponse');

const router = express.Router();

router.use('/', (req, res, next) => {
  console.log(`Req: ${req.originalUrl}`);
  next();
});

router.get('/search/brand/:brand/name/:productName', async (req, res) => {
  const { brand, productName } = req.params;
  try {
    const filteredProductList = await productSvc.searchByBrandAndProductName(brand, productName);
    return res.send(new RestRes('OK', filteredProductList));
  } catch (err) {
    res.status(500);
    return res.send(new RestRes('NOK', null, err.message));
  }
});

router.get('/list/:limit', async (req, res) => {
  const { limit } = req.params;
  try {
    const productList = await productSvc.getProductList(limit);
    return res.send(new RestRes('OK', productList));
  } catch (err) {
    res.status(500);
    return res.send(new RestRes('NOK', null, err.message));
  }
});

router.get('/edit/:code', (req, res) => {
  const { code } = req.params;
  return res.redirect(url.format({
    pathname: '/edit_product.html',
    query: {
      code,
    },
  }));
});

router.get('/details/:code', async (req, res) => {
  const { code } = req.params;
  const product = await productSvc.getProductDetailsByUPC(code);
  return res.send(new RestRes('OK', product));
});

router.put('/update', async (req, res) => {
  const {
    previousBarcode,
    barcode,
    brand,
    name,
  } = req.body;

  if (_.isNull(previousBarcode) || _.isNull(barcode) || _.isEmpty(brand) || _.isEmpty(name)) {
    console.log('Incomplete params');
    res.status(400);
    return res.send(new RestRes('NOK', null, 'Missing required fields.'));
  }

  if (barcode !== previousBarcode) {
    const isBarcodeExists = await productSvc.checkIsNewBarcodeExists(barcode);
    if (isBarcodeExists) {
      console.log('new barcode existed');
      res.status(409);
      return res.send(new RestRes('NOK', null, 'The newly inserted barcode is already existed in the product list.'));
    }
  }

  try {
    await productSvc.saveProduct(req.body);
    return res.send(new RestRes('OK', null, 'Successful'));
  } catch (err) {
    res.status(500);
    return res.send(new RestRes('NOK', null, err.message));
  }
});

module.exports = {
  router,
};
