window.inventoryData = [];
window.onload = () => {
    fetch('inventory_data.json')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Do something with the data, such as storing it in a global variable
        window.inventoryData = data;
      })
      .catch(error => console.error(error));
  };

window.tempArr = []
window.latestObj = {}
window.quantityVal = 1;

const recognitionBtn = document.querySelector('#recognition-btn');
const transcription = document.querySelector('#transcription');


const productName = document.getElementById('productName');
const brand = document.getElementById('brand');
const category = document.getElementById('category');
const quantity = document.getElementById('quantity');
const sizing = document.getElementById('sizing');

const buttonAdd = document.getElementById("buttonAdd");

// Create a new SpeechRecognition object
const recognition = new webkitSpeechRecognition();

// Set the language
recognition.lang = 'en-US';

// Start recognition when the button is clicked
recognitionBtn.addEventListener('click', () => {
  recognition.start();

});

// Adding event listeners for when speech is recognized
recognition.addEventListener('result', (event) => {
  const transcript = event.results[0][0].transcript;
  transcription.textContent = transcript;


  const searchString = transcript;
    let relevantObject = null;
    let maxMatchCount = 0;

// loop through each object in inventoryData array
for (let i = 0; i < inventoryData.length; i++) {
  let currentObject = inventoryData[i];
  let currentMatchCount = 0;

  // count the number of times a word in the search string appears in the current object's properties
  for (let property in currentObject) {
    if (typeof currentObject[property] === "string") {
      let words = currentObject[property].split(" ");
      for (let j = 0; j < words.length; j++) {
        if (searchString.includes(words[j])) {
          currentMatchCount++;
        }
      }
    }
  }

  // update the relevantObject if the current object has the most matching words
  if (currentMatchCount > maxMatchCount) {
    relevantObject = currentObject;
    maxMatchCount = currentMatchCount;
  }
}

if(relevantObject){
  
    productName.textContent = relevantObject.item;
    brand.textContent = relevantObject.brand;
    category.textContent = relevantObject.category;
    quantity.textContent = relevantObject.quantity;
    sizing.textContent = `${relevantObject.sizing} ${relevantObject.sizing_unit}`;
    latestObj = relevantObject

    if (tempArr.indexOf(latestObj) !== -1) {
      document.getElementById("buttonReplace").style.display = "block";
    } 
  }else{
    
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(function() {
      notification.style.display = 'none';
    }, 2000); 

  const randomNumber = Math.floor(Math.random() * inventoryData.length);
  console.log('called')
  productName.textContent = inventoryData[randomNumber].item;
  brand.textContent = inventoryData[randomNumber].brand;
  category.textContent = inventoryData[randomNumber].category;
  quantity.textContent = inventoryData[randomNumber].quantity;
  sizing.textContent = `${inventoryData[randomNumber].sizing} ${inventoryData[randomNumber].sizing_unit}`;  
  latestObj = inventoryData[randomNumber]
  
}

});

buttonAdd.addEventListener("click", function() {
  document.getElementById("buttonReplace").style.display = "none";
    if (Object.keys(latestObj).length === 0) {
        console.log('The object is empty');
      }else{

        var index = tempArr.findIndex(function(obj) {
          return obj === latestObj; // compare object references
        });
        if (tempArr.indexOf(latestObj) !== -1) {
          tempArr[index].quantity = parseInt(tempArr[index].quantity) + quantityVal;
          console.log()
        }else{
        tempArr.push(latestObj);
        }
        productName.textContent = 'Product Name';
        brand.textContent = 'Brand';
        category.textContent = 'Type';
        quantity.textContent = 'Quantity';
        sizing.textContent = 'Weight';
        latestObj = {}
        updateTable();
        
      }
      
});

document.getElementById("buttonReplace").addEventListener("click", function() {
  document.getElementById("buttonReplace").style.display = "none";
  
  var matchingIndexes = [];
  tempArr.forEach(function(obj, index) {
    if (obj === latestObj) {
      matchingIndexes.push(index);
    }
  });
  if (matchingIndexes.length > 0) {
    matchingIndexes.forEach(function(index) {

      tempArr[index].quantity  = quantityVal;
    });
  }

  if (matchingIndexes[0] !== -1) {
    tempArr[matchingIndexes[0]] = latestObj;
    productName.textContent = 'Product Name';
    brand.textContent = 'Brand';
    category.textContent = 'Type';
    quantity.textContent = 'Quantity';
    sizing.textContent = 'Weight';
    latestObj = {}
    updateTable();
  }
});

function generateTableRows(arr) {
    let tableRows = "";
    for (let i = 0; i < arr.length; i++) {
      let row = `
        <tr>
          <td>${arr[i].item}</td>
          <td>${arr[i].brand}</td>
          <td>${arr[i].sub_type}</td>
          <td>${arr[i].sizing} ${arr[i].sizing_unit}</td>
          <td>${arr[i].quantity}</td>
        </tr>
      `;
      tableRows += row;
    }
    return tableRows;
  }
  
  // Function to update table with new data
  function updateTable() {
    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = generateTableRows(tempArr);
  }
  

recognition.addEventListener('end', (event) => {
    recognitionBtn.classList.remove('btn-listening');
});

recognition.addEventListener('start', () => {
    recognitionBtn.classList.add('btn-listening');
  });

//popup


const btn = document.getElementById("quantity");

const popupInput = document.getElementById('popupInput');
const calculatorButtons = document.querySelectorAll('.calculatorButton');
const popup = document.getElementById("popup");

const closeBtn = document.getElementsByClassName("close")[0];


const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");

// When the user clicks the button, open the popup
btn.onclick = function() {
  popup.style.display = "block";
}

calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      popupInput.value += button.textContent;
    });
  });

  
closeBtn.onclick = function() {
  popup.style.display = "none";
}

cancelBtn.onclick = function() {
  popup.style.display = "none";
}

submitBtn.onclick = function() {
  const inputVal = popupInput.value;
  quantity.textContent = inputVal;
  quantityVal = parseInt(inputVal);
  // console.log("Input value:", inputVal);
  popupInput.value=1
  popup.style.display = "none";
}
 
window.onclick = function(event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
}
