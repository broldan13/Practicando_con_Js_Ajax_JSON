import stripeKeys from "./stripe-keys.js";
//console.log(StripeKeys);

const d = document,
    $products = d.getElementById("products"),
    $templete = d.getElementById("template-products").content,
    $fragment = d.createDocumentFragment(),
    fetchOptions = {
        headers:{
            Authorization:`Bearer ${stripeKeys.secret}`
        }
    };
const moneyFormat = (num)=> `$ ${num.slice(0,-2)}.${num.slice(-2)}`;
/*
Mi primera solución (Esta solución es un poco mas lenta al hacer el proceso)

fetch("https://api.stripe.com/v1/products",{
    headers:{
        Authorization:`Bearer ${stripeKeys.secret}`
    },
})
.then(res => {
    //console.log(res);
    return res.json();
})
.then(json=>{
    console.log(json);
})
.catch();

fetch("https://api.stripe.com/v1/prices",{
    headers:{
        Authorization:`Bearer ${stripeKeys.secret}`
    },
})
.then(res => {
    //console.log(res);
    return res.json();
})
.then(json=>{
    console.log(json);
})
.catch()
.finally();*/

Promise.all([
    fetch("https://api.stripe.com/v1/products",fetchOptions),
    fetch("https://api.stripe.com/v1/prices",fetchOptions)
])
    .then(responses=> Promise.all(responses.map(res => res.json())))
    .then((json)=>{
        let dataProducts = json[0].data,
            dataPrices = json[1].data;
        //console.log(dataProducts,dataPrices);
        dataPrices.forEach((el)=>{
            let productFilter = dataProducts.filter((product)=> product.id === el.product);
            //console.log(productFilter);
            $templete.querySelector(".product").setAttribute("data-price", el.id);
            $templete.querySelector("img").src=productFilter[0].images[0];
            $templete.querySelector("img").alt=productFilter[0].name;
            $templete.querySelector("figcaption").innerHTML=`
            <b>${productFilter[0].name}</b>
            <br>
            ${productFilter[0].description}
            <br>
            <br>
           <b> ${moneyFormat(el.unit_amount_decimal)} ${el.currency.toUpperCase()} </b>
            `;
            let $clone = d.importNode($templete,true);
            $fragment.appendChild($clone);
        });
        $products.appendChild($fragment);
    });

    d.addEventListener("click",(e)=>{
        if (e.target.matches(".product *")){
            let price = e.target.parentElement.getAttribute("data-price");
            //console.log(price);
            Stripe(stripeKeys.public)
            .redirectToCheckout({
                lineItems:[{price:price, quantity:1}],
                mode:"payment",
                successUrl:"http://127.0.0.1:5500/ejercicios_ajax/assets/stripe_success.html",
                cancelUrl:"http://127.0.0.1:5500/ejercicios_ajax/assets/stripe_cancel.html",
            });
        };
    });