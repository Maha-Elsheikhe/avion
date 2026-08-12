const getData = async () => {
  try {
    const response = await fetch("./js/data.json")
      .then((result) => {
        return result.json();
      })
      .then((myData) => {
        let newData = [];
        myData.forEach((element) => newData.push(...element.items));
        //store data in local storage
        localStorage.getItem("data") === null
          ? localStorage.setItem("data", JSON.stringify(newData))
          : localStorage.getItem("data");
        //get data from local storage
        return newData;
      });
    return response;
  } catch {
    console.log(Error(`Not found`));
  }
};
getData();

const localStorageData = JSON.parse(localStorage.getItem("data"));

let categoryLst1 = document.getElementById("categorylst");
let selectDiv = document.getElementById("select");

fetch("./js/data.json")
  .then((result) => {
    return result.json();
  })
  .then((myData) => {
    myData.map(function (e) {
      let p = document.createElement("p");
      p.textContent = e.category;
      p.id = e.category;
      selectDiv.appendChild(p);
      selectDiv.addEventListener("click", filterCategoryCard);
      for (let i = 0; i < selectDiv.children.length; i++) {
        selectDiv.children[i].onmouseenter = () =>
          (selectDiv.children[i].style.backgroundColor = "pink");
        selectDiv.children[i].onmouseleave = () =>
          (selectDiv.children[i].style.backgroundColor = "white");
      }
    });
  });

categoryLst1.onmouseenter = () => (selectDiv.style.display = "block");
categoryLst1.onmouseleave = () => (selectDiv.style.display = "none");

let sec = document.body.appendChild(document.createElement("section"));
sec.classList.add("sec");

function buildForm(
  formId,
  imageId,
  priceId,
  titleId,
  categoryId,
  descriptionId,
  confirmId,
  cancelId
) {
  let formDiv = document.createElement("div");
  formDiv.id = formId;
  formDiv.innerHTML = `
  <form>
      <div>
        <label for="">Load image:</label>
        <img id="${imageId}" src="" alt="">
      </div>
      <div>
        <label for="${titleId}">Title:</label>
        <input id="${titleId}" name="${titleId}" type="text">
      </div>
      <div>
        <label for="${priceId}">Price:</label>
        <input id="${priceId}" name="${priceId}" type="number">
      </div>
      <div>
        <label for="${categoryId}">Category:</label>
        <select id="${categoryId}" name="${categoryId}">
        </select>
      </div>
      <div>
        <label for="${descriptionId}">Description:</label>
        <textarea id="${descriptionId}" name="${descriptionId}" cols="30" rows="10"></textarea>
      </div>
      <div class="btns">
        <label class="error" for=""></label>
        <button type="submit" id="${confirmId}">Confirm</button>
        <button type="button" id="${cancelId}">Cancel</button>
      </div>
    </form>`;
  formDiv.style.display === "none"
    ? (formDiv.style.display = "block")
    : (formDiv.style.display = "none");
  let btnCancel = document.getElementById(`${cancelId}`);
  // btnCancel.onclick = function () {
  //   formDiv.style.display = 'none'
  // }
  document.body.appendChild(formDiv);
}
buildForm(
  "detailsEditForm",
  "image1",
  "price1",
  "title1",
  "category1",
  "description1",
  "confirmEdit",
  "cancelEdit"
);

let sendData = document.querySelector(".sendData");
let editForm = document.getElementById("detailsEditForm");
let cancelEdit = document.getElementById("cancelEdit");
let imageEdit = document.getElementById("image1");
let titleEdit = document.getElementById("title1");
let priceEdit = document.getElementById("price1");
let categoryEdit = document.getElementById("category1");
let descEdit = document.getElementById("description1");
let confirmEdit = document.getElementById("confirmEdit");

const cartData = [];
function createDetailsCard(card, ele) {
  let details = document.createElement("div");
  let btnDetails = document.createElement("a");
  details.classList.add("details");
  btnDetails.textContent = "View Details";
  btnDetails.href = "#details";
  details.appendChild(btnDetails);
  card.appendChild(details);
  card.onmouseenter = () => (details.style.transform = "rotateX(0deg)");
  card.onmouseleave = () => (details.style.transform = "rotateX(90deg)");
  btnDetails.onclick = function () {
    btnDetails.href = "#details";
    sendData.productID = ele.title;

    let detailsSec = document.getElementById("details");
    let imageDetails = document.createElement("img");
    let titleDetails = document.createElement("h1");
    let priceDetails = document.createElement("strong");
    let descDetails = document.createElement("p");
    let amount = document.createElement("div");
    let btnEdit = document.createElement("button");
    let btnAddToCart = document.createElement("button");
    let divImage = document.createElement("div");
    let index = 1;
    amount.classList.add("amount");
    let span1 = document.createElement("span");
    span1.textContent = `-`;
    let span2 = document.createElement("span");
    span2.textContent = `+`;
    let num = document.createElement("label");
    num.textContent = index;
    span1.onclick = () => {
      if (index > 1) {
        num.textContent = index - 1;
        index -= 1;
      } else num.textContent = index;
      console.log(index);
    };
    span2.onclick = () => {
      if (index < 1000) {
        num.textContent = index + 1;
        index += 1;
      } else num.textContent = index;
      console.log(index);
    };
    amount.appendChild(span1);
    amount.appendChild(num);
    amount.appendChild(span2);
    btnAddToCart.onclick = () => {
      let item = {
        "img-src": ele["img-src"],
        title: ele.title,
        price: ele.price,
        category: ele.category,
        description: ele.description,
        quantity: index,
      };
      if (isItemInCart(item)) console.log("items is already in cart");
      else cartData.push(item);
      localStorage.setItem("cart", JSON.stringify(cartData));
    };

    if (ele.title === sendData.productID) {
      detailsSec.style.height = "70vh";
      detailsSec.innerHTML = "";
      imageDetails.src = ele["img-src"];
      titleDetails.textContent = ele.title;
      priceDetails.textContent = `${ele.price}$`;
      descDetails.textContent = ele.description;
      btnEdit.textContent = "Edit";
      btnAddToCart.textContent = "Add To Cart";
    }

    divImage.appendChild(imageDetails);
    let divDetails = document.createElement("div");
    divDetails.id = "divDetails";
    divDetails.appendChild(titleDetails);
    divDetails.appendChild(priceDetails);
    divDetails.appendChild(descDetails);
    divDetails.appendChild(amount);
    divDetails.appendChild(btnAddToCart);
    divDetails.appendChild(btnEdit);
    detailsSec.appendChild(divImage);
    detailsSec.appendChild(divDetails);

    btnEdit.addEventListener("click", function () {
      editForm.style.display = "block";
      titleEdit.value = ele.title;
      priceEdit.value = ele.price;
      categoryEdit.value = ele.category;
      descEdit.value = ele.description;
      cancelEdit.onclick = () => (editForm.style.display = "none");
    });

    confirmEdit.onclick = function (e) {
      e.preventDefault();
      for (let i = 0; i < localStorageData.length; i++) {
        if (localStorageData[i].title === ele.title) {
          localStorageData[i].title = titleEdit.value;
          localStorageData[i].price = priceEdit.value;
          localStorageData[i].category = categoryEdit.value;
          localStorageData[i].description = descEdit.value;
        }
      }
      localStorage.removeItem("data");
      localStorage.setItem("data", JSON.stringify(localStorageData));
      buildCards(JSON.parse(localStorage.getItem("data")));
    };
  };
}

console.log(cartData);

const isItemInCart = (item) => {
  for (let i = 0; i < cartData.length; i++) {
    if (item.title === cartData[i].title) return true;
  }
  return false;
};

function createCard(ele) {
  let card = document.createElement("div");
  let title = document.createElement("p");
  let price = document.createElement("p");
  let image = document.createElement("img");
  let captionCard = document.createElement("div");
  card.classList.add("card");
  captionCard.classList.add("captionCard");
  title.textContent = ele.title;
  price.textContent = `${ele.price}$`;
  sec.appendChild(card);
  card.appendChild(image);
  captionCard.appendChild(title);
  captionCard.appendChild(price);
  card.appendChild(captionCard);
  createDetailsCard(card, ele);
}

function buildCards(data) {
  sec.innerHTML = "";
  data.map((element) => createCard(element));
}

let search = document.getElementById("searchInput");

function filterCategoryCard(htmlElement) {
  let product = localStorageData.filter(
    (element) => element.category === htmlElement.target.id
  );
  sec.innerHTML = "";
  product.map((element) => createCard(element));
  if (htmlElement.target.id === "All") {
    localStorageData.map((element) => createCard(element));
    return;
  }
}
function filterSearchCard() {
  sec.innerHTML = "";
  localStorageData.map(function (ele) {
    if (ele.title.toLowerCase().trim().includes(search.value.toLowerCase())) {
      createCard(ele);
    }
  });
}

search.addEventListener("keyup", () => filterSearchCard());

let asc = document.querySelector("#sortPrice > p");
let desc = document.querySelector("#sortPrice").lastElementChild;
asc.addEventListener("click", () => sortAsc());
desc.addEventListener("click", () => sortDesc());

function sortAsc() {
  let sortedProducts = [...localStorageData.sort((a, b) => b.price - a.price)];
  sec.innerHTML = "";
  sortedProducts.map(function (ele) {
    createCard(ele);
  });
}

function sortDesc() {
  let sortedProducts = [...localStorageData.sort((a, b) => a.price - b.price)];
  sec.innerHTML = "";
  sortedProducts.map(function (ele) {
    createCard(ele);
  });
}

buildForm(
  "addForm",
  "image",
  "price",
  "title",
  "category",
  "description",
  "confirmAdd",
  "cancelAdd"
);
let formAdd = document.getElementById("addForm");
let btnAdd = document.getElementById("add");
btnAdd.addEventListener("click", showAdd);
function showAdd() {
  formAdd.style.display = "block";
}
let btnCancel = document.getElementById("cancelAdd");
btnCancel.addEventListener("click", cancelAdd);
function cancelAdd() {
  formAdd.style.display = "none";
}

let confirmAdd = document.getElementById("confirmAdd");

addForm.addEventListener("submit", confirm);
let inputImage = document.getElementById("image");
let inputPrice = document.getElementById("price");
let inputTitle = document.getElementById("title");
let inputDESC = document.getElementById("description");
let lblError = document.querySelector(".error");
let titleRegex = /[a-zA-Z]/gi;
let priceRegex = /[0-9]/g;

//select options
let select = document.getElementById("category");
fetch("./js/data.json")
  .then((res) => res.json())
  .then((res) => {
    res.map(function (e) {
      let opt = document.createElement("option");
      opt.textContent = e.category;
      opt.value = e.category;
      select.appendChild(opt);
    });
  });

function confirm(e) {
  e.preventDefault();
  lblError.textContent = "";
  if (
    inputPrice.value < 0 ||
    priceRegex.test(inputPrice.value) === false ||
    inputPrice.value === ""
  )
    lblError.textContent = "*Please full the price greater than 0";
  if (titleRegex.test(inputTitle.value) === false || inputTitle.value === "")
    lblError.textContent = "*Please full the title";
  if (inputDESC.value === "")
    lblError.textContent = "*Please full the description";
  if (lblError.textContent === "") {
    localStorageData.push({
      "img-src": inputImage.value,
      title: inputTitle.value,
      price: inputPrice.value,
      description: inputDESC.value,
      category: select.value,
    });
    localStorage.setItem("data", JSON.stringify(localStorageData));
    // console.log(localStorageData[localStorageData.length - 1])
    buildCards(JSON.parse(localStorage.getItem("data")));
  }
}

buildCards(JSON.parse(localStorage.getItem("data")));
