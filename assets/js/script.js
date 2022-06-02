let cart = [];
let modalQtd = 1;
let modalKey = 0;
let modalPrice = 0;

// constante para evitar repetições de querySelector, querySelectorAll
const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

// mapear a lista dos produtos no arquivo dados.js para o html
// clonar a estrutura dentro de models no html e preenche-la com os dados
dadosJson.map((item, index) => {
    let jsonItem = qs('.models .item').cloneNode(true);
    // preencher as informações
    // para saber qual é a chave do item
    jsonItem.setAttribute('data-key', index);
    jsonItem.querySelector('.item--img img').src = item.img;
    jsonItem.querySelector('.item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    jsonItem.querySelector('.item--name').innerHTML = item.name;
    jsonItem.querySelector('.item--desc').innerHTML = item.description;

    // evento para ao clicar o add aparecer o modal com as informações do produto
    jsonItem.querySelector('a').addEventListener('click', (elemento) => {
        // bloquear a ação natural da tag a
        elemento.preventDefault();

        // pegar a informação de qual index é para aparecer no modal
        let key = elemento.target.closest('.item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;
        modalPrice = qs('.itemInfo--actualPrice').innerHTML = dadosJson[key].price[2].toFixed(2);

        qs('.itemBig img').src = dadosJson[key].img;
        qs('.itemInfo h1').innerHTML = dadosJson[key].name;
        qs('.itemInfo--desc').innerHTML = dadosJson[key].description;
        qs('.itemInfo--size.selected').classList.remove('selected');

        qsa('.itemInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
                qs('.itemInfo--actualPrice').innerHTML = `R$ ${dadosJson[key].price[sizeIndex].toFixed(2)}`;
            }
            size.querySelector('span').innerHTML = dadosJson[key].sizes[sizeIndex];
            size.addEventListener('click', () => {
                qs('.itemInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');

                qs('.itemInfo--actualPrice').innerHTML = `R$ ${dadosJson[key].price[sizeIndex].toFixed(2)}`;
                modalPrice = dadosJson[key].price[sizeIndex];
            });
        });

        qs('.itemInfo--qtd').innerHTML = modalQtd;

        qs('.itemWindowArea').style.opacity = 0;
        qs('.itemWindowArea').style.display = 'flex';
        setTimeout(() => {
            qs('.itemWindowArea').style.opacity = 1;
        }, 200);
    });
    // adiciona quantidade de produtos no html
    qs('.item-area').append(jsonItem);
});


// Eventos do Modal
function closeModal() {
    qs('.itemWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.itemWindowArea').style.display = 'none';
    }, 500);
}
qsa('.itemInfo--cancelButton, .itemInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

qs('.itemInfo--qtdMenos').addEventListener('click', () => {
    if (modalQtd > 1) {
        modalQtd--;
        qs('.itemInfo--qtd').innerHTML = modalQtd;
    }
});

qs('.itemInfo--qtdMais').addEventListener('click', () => {
    modalQtd++;
    qs('.itemInfo--qtd').innerHTML = modalQtd;
});

qsa('.itemInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (elemento) => {
        qs('.itemInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

qs('.itemInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.itemInfo--size.selected').getAttribute('data-key'));
    let identifier = dadosJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qtd += modalQtd;
    } else {
        cart.push({
            identifier,
            id: dadosJson[modalKey].id,
            size,
            qtd: modalQtd,
            price: parseFloat(modalPrice)
        });
    }
    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qs('aside').style.left = '0';
    }
});

qs('.menu-closer').addEventListener('click', () => {
    qs('aside').style.left = '100vw';
});

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        qs('aside').classList.add('show');
        // não incluir o mesmo item mais de uma vez
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let jsonItem = dadosJson.find((item) => item.id == cart[i].id);

            subtotal += cart[i].price * cart[i].qtd;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            let itemSizeName;

            switch (cart[i].size) {
                case 0:
                    itemSizeName = 'P';
                    break;
                case 1:
                    itemSizeName = 'M';
                    break;
                case 2:
                    itemSizeName = 'G';
                    break;
            }

            let itemName = `${jsonItem.name} (${itemSizeName})`;

            cartItem.querySelector('img').src = jsonItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = itemName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtdMenos').addEventListener('click', () => {

                if (cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtdMais').addEventListener('click', () => {
                cart[i].qtd++;
                updateCart();
            });

            qs('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }

}