/* eslint-disable  no-var */
/* eslint-disable  no-restricted-syntax */
/* eslint-disable  vars-on-top */
/* eslint-disable  no-alert */

function renderProductTable(productList) {
  const table = document.getElementById('productListTable');
  const tableBody = table.getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  for (const product of productList) {
    const { barcode, brand, name } = product;

    var newRow = tableBody.insertRow(tableBody.rows.length);
    newRow.insertCell(0).appendChild(document.createTextNode(barcode));
    newRow.insertCell(1).appendChild(document.createTextNode(brand));
    newRow.insertCell(2).appendChild(document.createTextNode(name));


    var editBtn = document.createElement('input');
    editBtn.type = 'button';
    editBtn.onclick = (function () { return function () { editProduct(barcode); }; }());
    editBtn.value = 'Edit';
    newRow.insertCell(3).appendChild(editBtn);
  }
}

function editProduct(barcode) {
  // alert(barcode);
  window.location = `/product/edit/${barcode}`;
}

async function search() {
  var brandTextField = document.getElementById('brand');
  var prdtNameTextField = document.getElementById('productName');

  var brandVal = brandTextField.value;
  var nameVal = prdtNameTextField.value;

  if (brandVal === '' && nameVal === '') {
    alert('Both product brand and name fields should not be empty.');
  } else {
    let products = [];
    const brandParam = brandVal !== '' ? brandVal : 'none';
    const nameParam = nameVal !== '' ? nameVal : 'none';
    const url = `/product/search/brand/${brandParam}/name/${nameParam}`;

    try {
      const res = await axios({
        method: 'GET',
        url,
      });
      products = res.data.data;
    } catch (err) {
      console.error(err);
      alert('Opps!! Something went wrong!');
    }

    renderProductTable(products);
  }
}

function filter() {
  const table = document.getElementById('productListTable');
  const tableBody = table.getElementsByTagName('tbody')[0];

  var brandTextField = document.getElementById('brand');
  var prdtName = document.getElementById('productName');

  var brandVal = brandTextField.value.toUpperCase();
  var nameVal = prdtName.value.toUpperCase();

  var tableRows = tableBody.getElementsByTagName('tr');

  if (brandVal !== '' || nameVal !== '') {
    for (const row of tableRows) {
      var brandCell = row.getElementsByTagName('td')[1];
      var nameCell = row.getElementsByTagName('td')[2];

      var brandToShow = false;
      var nameToShow = false;

      if (brandCell && brandVal !== '') {
        var textVal = brandCell.textContent || brandCell.innerText;
        console.log(`Brand: ${textVal}`);
        if (textVal.toUpperCase().indexOf(brandVal) > -1) {
          brandToShow = true;
        }
        console.log(`Brand to show: ${brandToShow}`);
      }

      if (nameCell && nameVal !== '') {
        var textVal = nameCell.textContent || nameCell.innerText;
        if (textVal.toUpperCase().indexOf(nameVal) > -1) {
          nameToShow = true;
        }
        console.log(`Name to show: ${nameToShow}`);
      }

      if (brandToShow || nameToShow) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  } else {
    for (const row of tableRows) {
      row.style.display = '';
    }
  }
}


async function displayProducts() {
  let products = [];
  try {
    const res = await axios({
      method: 'GET',
      url: '/product/list/20',
    });
    products = res.data.data;
  } catch (err) {
    console.error(err);
    alert('Opps!! Something went wrong!');
  }

  renderProductTable(products);
}

function makeTableSortable() {
  const table = document.getElementById('productListTable');
  sorttable.makeSortable(table);
}

function init() {
  makeTableSortable();
  displayProducts();
}
