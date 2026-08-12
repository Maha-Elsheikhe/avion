let cartData = JSON.parse(localStorage.getItem('cart'))

let main = document.querySelector('main')

cartData.map((ele) => {
  let row = document.createElement('div')
  row.classList.add('row')
  let content = document.createElement('div')
  content.classList.add('content')
  let operations = document.createElement('div')
  operations.classList.add('operations')
  let total = document.createElement('div')
  total.classList.add('total')
  let image = document.createElement('img')
  let title = document.createElement('h3')
  let description = document.createElement('p')
  let contentPlus = document.createElement('div')

  image.src = ele.img
  title.textContent = ele.title
  description.textContent = ele.description
  contentPlus.appendChild(title)
  contentPlus.appendChild(description)
  content.appendChild(image)
  content.appendChild(contentPlus)
  let span1 = document.createElement('span')
  span1.textContent = `-`
  let span2 = document.createElement('span')
  span2.textContent = `+`
  let num = document.createElement('label')
  let del = document.createElement('span')
  del.textContent = 'delete'
  del.style = `color: white;background-color: red; border-radius: 10%`

  span1.onclick = () => {
    if (ele.quantity > 1) {
      num.textContent = parseInt(ele.quantity) - 1
      ele.quantity -= 1
      total.textContent = `total: $${ele.price * ele.quantity}`
      cartData.splice(cartData.indexOf(ele), 1, ele)
      localStorage.setItem('cart', JSON.stringify(cartData))
    } else num.textContent = parseInt(ele.quantity)
  }
  span2.onclick = () => {
    if (parseInt(ele.quantity) < 1000) {
      num.textContent = parseInt(ele.quantity) + 1
      ele.quantity += 1
      total.textContent = `total: $${ele.price * ele.quantity}`
      cartData.splice(cartData.indexOf(ele), 1, ele)
      localStorage.setItem('cart', JSON.stringify(cartData))
    } else num.textContent = parseInt(ele.quantity)
  }
  del.onclick = () => {
    cartData.splice(cartData.indexOf(ele), 1)
    del.parentElement.parentElement.style.display = 'none'
    localStorage.setItem('cart', JSON.stringify(cartData))
  }
  num.textContent = parseInt(ele.quantity)
  total.textContent = `total: $${ele.price * ele.quantity}`
  operations.appendChild(span1)
  operations.appendChild(num)
  operations.appendChild(span2)
  operations.appendChild(del)

  row.appendChild(content)
  row.appendChild(operations)
  row.appendChild(total)
  main.appendChild(row)
})
let last = document.createElement('div')
last.classList.add('last')
let left = document.createElement('div')
let right = document.createElement('div')
let pTotal = document.createElement('p')
let check = document.createElement('button')
left.textContent = 'Taxes and shipping are calculated at checkout'
let subTotal = 0
for (let i = 0; i < cartData.length; i++) {
  subTotal += parseInt(cartData[i].price) * parseInt(cartData[i].quantity)
}
console.log(subTotal)

pTotal.textContent = `SubTotal $${subTotal}`
right.appendChild(pTotal)
right.appendChild(check)
last.appendChild(left)
last.appendChild(right)
document.body.appendChild(last)
