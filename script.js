const urlLogin = 'http://157.230.108.157:3000/accounting/member';
const login = document.querySelector('#login');
const loginReg = document.querySelector('#loginReg');
const butLog = document.querySelector('#butLog');
const butReg = document.querySelector('#butReg');
const butAdd = document.querySelector('#addRec');
const modalRec = document.querySelector('#wrapper');
const closeModal = document.querySelector('#closeModal');
const aboutUser = document.querySelector('#aboutUser');
const userInfo = document.querySelector('#currUser');
const addCategory = document.querySelector('#addCategory');
const modalCategory = document.querySelector('#wAddCat');
const saveCat = document.querySelector('#saveCat');
const cancelCat = document.querySelector('#cancelCat');
const exit = document.querySelector('#exit');
const mainBlock = document.querySelector('MAIN');
const loginPage = document.querySelector('#logPage');
const dashboard = document.querySelector('#dashboard');
const accounts = document.querySelector('#accounts');
const records = document.querySelector('#records');
const userName = document.querySelector('#userName');
const addedCategory = document.querySelector('#addedCategory');
const chooseCat = document.querySelector('#chooseCat');
const modalAccount = document.querySelector('#modalAccount');
const closeModalAccount = modalAccount.querySelector('.close');
const accountName = modalAccount.querySelector('#accountName');
const saveModalAccount = modalAccount.querySelector('.save');
const accountContainer = document.querySelector('.accounts');
const butAddAccount = document.querySelector('.addAcc');
const amount = document.querySelector('#amount');
const addRecord = document.querySelector('#addRecord');
const chCount = document.querySelector('#chCount');
const countForRecords = document.querySelector('#countForRecords');
const tbodyCounts = document.querySelector('TBODY');
const tbody = document.querySelector('#tbodyTrans');
const infocounts = document.querySelector('#infocounts');

//Отрисовка данных
function analiticCounts() {
    let category = [];
    infocounts.innerHTML = '';
    (async function foo2() {
        let response = await fetch('http://157.230.108.157:3000/accounting/category');
        let user = await response.json();
        let nUser = user.filter(f=>f['memberId'] === +localStorage.getItem('userID'));
        nUser.forEach(e=>category.push(e['name']))
    }());
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(resp => resp.json())
        .then(data => {
            let counts = data.filter(e => {
                return +localStorage.getItem('userID') === +e['memberId']
            });
            counts.forEach(e=>{
                let container = document.createElement('DIV');
                let countName = document.createElement('DIV');
                countName.innerHTML = e['currency'];
                container.append(countName);
                let info = document.createElement('DIV');
                let income = 0;
                let expense = 0;
                console.log(e);
                let arr = [];
                e['transactions'].forEach(element=> {
                    switch (element['type']) {
                        case 'income':
                            income += element.count;
                            break;
                        case 'expense':
                            expense += element.count;
                            break;
                    }
                    let el = {};
                    el['count'] = +element.count;
                    el['category'] = element['category'];
                    arr.push(el)
                });
                category.forEach(ff=>{
                    let nArr = arr.filter(el=>{
                        return el['category']===ff
                    });
                    let sum = 0;
                    let categ = nArr[0] && nArr[0]['category'] || '';
                    if (nArr.length){
                        nArr.forEach(sumElem=>{
                            if (sumElem){
                                sum+=sumElem['count']
                            }
                        })
                    }
                    console.log(e['currency']);
                    console.log(`Категория: ${categ}, Сумма: ${sum}`);
                    let infoCategory = document.createElement('DIV');
                    if (categ){
                        infoCategory.innerHTML = `${categ}: <b>${sum} ${e['currency']}</b>`;
                        container.append(infoCategory)
                    }

                });
                info.innerHTML = `<span>income: <b>${income} ${e['currency']}</b></span><br><span>expense: <b>${expense} ${e['currency']}</b></span>`;
                info.classList.add('bot');
                container.append(info);
                infocounts.append(container);
            })

        })
}

//Счета страница
function renderAcc() {
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(res=>res.json())
        .then(data=>{
            tbodyCounts.innerHTML = '';
            data.filter(e=>e['memberId'] === +localStorage.getItem('userID')).forEach(elem=>{
                let row = document.createElement('TR');
                let transactions = document.createElement('TD');
                let cellBalans = document.createElement('TD');
                let cellCurrency = document.createElement('TD');
                let cellId = document.createElement('TD');
                cellId.innerHTML = elem['id'];
                row.append(cellId);
                cellCurrency.innerHTML = elem['currency'];
                cellBalans.innerHTML = elem['value'];
                transactions.innerHTML = elem['transactions'].length;
                row.append(cellCurrency);
                row.append(cellBalans);
                row.append(transactions);
                let cellDel = document.createElement('TD');
                cellDel.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
                cellDel.classList.add('trash');
                row.append(cellDel);
                tbodyCounts.append(row)
            })
        })
}
renderAcc();


//Отрисовка транзакций
function counts() {
    countForRecords.innerHTML = '';
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(resp => resp.json())
        .then(data =>{
            data.filter(e=>{
               return +localStorage.getItem('userID') === +e['memberId']
            }).forEach(e=>{
                let option = new Option(e['currency'], e['id']);
                countForRecords.append(option);
            });
        });
}
counts();
function renderRecords(){
    tbody.innerHTML = '';
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(resp => resp.json())
        .then(data =>{
            data.filter(e=>{
                return +localStorage.getItem('userID') === +e['memberId']
            }).forEach(e=>{
                if (+e['id'] === +countForRecords.value){
                    e['transactions'].forEach(e=>{
                        let row = document.createElement('TR');
                        let cellId = document.createElement('TD');
                        cellId.innerHTML = e['id'];
                        row.append(cellId);
                        let cellCount = document.createElement('TD');
                        cellCount.innerHTML = e['count'];
                        row.append(cellCount);
                        let cellCategory = document.createElement('TD');
                        cellCategory.innerHTML = e['category'];
                        row.append(cellCategory);
                        let cellType = document.createElement('TD');
                        cellType.innerHTML = e['type'];
                        row.append(cellType);
                        let cellDel = document.createElement('TD');
                        cellDel.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
                        cellDel.classList.add('trash');
                        row.append(cellDel);
                        tbody.append(row);
                    });
                }
            })
        })
}
countForRecords.addEventListener('change', renderRecords);
tbody.addEventListener('click',e=>{
    let target = e.target;
    if (target.classList.contains('trash') || target.tagName === 'I'){
        let id = target.closest('TR');
        fetch('http://157.230.108.157:3000/accounting/transactions/'+id.firstElementChild.innerHTML,{
            method: 'DELETE'
        });
        id.remove()
    }
});
tbodyCounts.addEventListener('click',e=>{
    let target = e.target;
    if (target.classList.contains('trash') || target.tagName === 'I'){
        let id = target.closest('TR');
        fetch('http://157.230.108.157:3000/accounting/account/'+id.firstElementChild.innerHTML,{
            method: 'DELETE'
        });
        id.remove()
    }
});



//добавить транзакцию
function findRadio() {
    let rad = document.querySelectorAll('[name=trans]');
    let radCheck = document.querySelectorAll('[name=trans]:checked');
    if (radCheck.length !== 0){
        for (let i of rad){
            if (i.checked){
                return i.value

            }
        }
    }else{
        return false
    }


}
function addTransaction(){
    if (findRadio()){
        fetch('http://157.230.108.157:3000/accounting/transactions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                accountId: +chCount.value,
                count: +amount.value,
                category: chooseCat.value,
                type: findRadio()
            })
        });
        modalRec.style.display = 'none';
    }else{
        alert('Please select "income" or "expense"!')
    }
}
//Сортировка таблицы
const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
    );

    for(const tBody of target.closest('table').tBodies)
        tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for(const cell of target.parentNode.cells)
        cell.classList.toggle('sorted', cell === target);
};

document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));




//Отрисовка суммы после транзакции
function foo(){
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(res => res.json())
        .then(data=>{
            let count = document.querySelectorAll('.account >SPAN:last-of-type');
            data.forEach(element=>{
                if (+element['id'] === +chCount.value){
                    count.forEach(e=>{
                        if (+e.dataset.accountId===+chCount.value){
                            e.innerHTML=element['value'];
                        }
                    })
                }
            })

        });
}

addRecord.addEventListener('click',()=>{
    addTransaction();
    chooseCount();
    renderAccounts()
    setTimeout(renderRecords, 0);
    foo();
    analiticCounts();
    counts()
});

// Добавить счет

butAddAccount.addEventListener('click',()=>modalAccount.hidden = false);
saveModalAccount.addEventListener('click', AddAccount);
closeModalAccount.addEventListener('click', ()=>modalAccount.hidden = true);
function AddAccount(){
    fetch('http://157.230.108.157:3000/accounting/account', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({memberId: +localStorage.getItem('userID'), currency: accountName.value, value: 0})
    });
    let container = document.createElement('DIV');
    container.classList.add('account');
    let currency = document.createElement('SPAN');
    let value = document.createElement('SPAN');
    currency.innerHTML = accountName.value;
    value.innerHTML = '0';
    container.append(currency);
    container.append(value);
    accountContainer.prepend(container);
    modalAccount.hidden = true;
}
function chooseCount() {
    chCount.innerHTML = '';
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(response => response.json())
        .then(data => {
            data.forEach(e=>{
                if (+e['memberId'] === +localStorage.getItem('userID')){
                    let option = document.createElement('OPTION');
                    option.innerHTML = e.currency;
                    option.value = e.id;
                    chCount.prepend(option);
                }
            })
        })
}


function renderAccounts(){
    accountContainer.innerHTML = '';
    fetch('http://157.230.108.157:3000/accounting/account')
        .then(response => response.json())
        .then(data => {
            data.forEach(e=>{
                if (+e['memberId'] === +localStorage.getItem('userID')){
                    let container = document.createElement('DIV');
                    container.classList.add('account');
                    let currency = document.createElement('SPAN');
                    let value = document.createElement('SPAN');
                    currency.innerHTML = e['currency'];
                    value.innerHTML = e['value'];
                    value.dataset.accountId = e['id'];
                    container.append(currency);
                    container.append(value);
                    accountContainer.prepend(container);
                }
            })
        })
}

//Добавление категории
addCategory.addEventListener('click',()=>{
    modalCategory.style.display = 'flex';
    addedCategory.value = '';
});
cancelCat.addEventListener('click',()=>{
    modalCategory.style.display = 'none';
});
// Переключение логин регистрация
const tabs = document.querySelector('#tabs');
const log = document.querySelector('#lo');
const reg = document.querySelector('#re');
const logTab = document.querySelector('#logTab');
const regTab = document.querySelector('#regTab');

tabs.addEventListener('click', e=>{
    if (e.target === log){
        logTab.style.display = 'flex';
        regTab.style.display = 'none';
        log.classList.add('onClick');
        reg.classList.remove('onClick');
    }else if (e.target === reg) {
        logTab.style.display = 'none';
        regTab.style.display = 'flex';
        log.classList.remove('onClick');
        reg.classList.add('onClick');
    }
});
function render() {
    userName.innerHTML = localStorage.getItem('currentUser')
}
render();




// Reg пользователя
function RegUser() {
        fetch(urlLogin, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: loginReg.value})
        });
        location.hash = '#dashboard';
        renderAccounts();
        renderCategories();
        fetch(urlLogin)
            .then(response => response.json())
            .then(data => {
                for (let user of data){
                    if (user.login === loginReg.value){
                        location.hash = '#dashboard';
                        localStorage.setItem('currentUser', user.login);
                        localStorage.setItem('userID', user.id);
                        userName.innerHTML = localStorage.getItem('currentUser')
                    }
                }
            });
}

function LogUser(){
        changeLocation();
        fetch(urlLogin)
            .then(response => response.json())
            .then(data => {
                for (let user of data){
                    if (user.login === login.value){
                        location.hash = '#dashboard';
                        localStorage.setItem('currentUser', user.login);
                        localStorage.setItem('userID', user.id);
                        userName.innerHTML = localStorage.getItem('currentUser')
                    }
                }
                if (location.hash !== '#dashboard'){
                    alert('The user does not exist. Please register!')
                }
            })


}
butLog.addEventListener('click', LogUser);
butReg.addEventListener('click', RegUser);





//EXIT
exit.addEventListener('click',()=>{
    location.hash = '#logPage';
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userID');
    accountContainer.innerHTML = '';
    countForRecords.innerHTML = '';
    changeLocation();
});





// Модальное окно(добавление транзакции)
butAdd.addEventListener('click',()=>{
    modalRec.style.display = 'block';
    renderCategories();
    chooseCount();
});
closeModal.addEventListener('click', ()=>modalRec.style.display = 'none');
userInfo.addEventListener('click',()=>{
    if (aboutUser.style.display === 'flex'){
        aboutUser.style.display = 'none'
    }else {
        aboutUser.style.display = 'flex'
    }
});




// Добавление категории
function AddCategory() {
    fetch('http://157.230.108.157:3000/accounting/category', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({memberId: +localStorage.getItem('userID'), name: addedCategory.value})});
    modalCategory.style.display = 'none';
    let option = new Option(addedCategory.value, addedCategory.value);
    chooseCat.append(option);
}
saveCat.addEventListener('click', AddCategory);

function renderCategories() {
    chooseCat.innerHTML = '';
    fetch('http://157.230.108.157:3000/accounting/category')
        .then(res => res.json())
        .then(data=>{
            let obj = data.filter(e=>{
               return +e['memberId'] === +localStorage.getItem('userID');
            });
            obj.forEach(e=>{
                let option = document.createElement('OPTION');
                option.value = e['name'];
                option.innerHTML = e['name'];
                chooseCat.append(option)
            })
        })
}
let logomenu = document.querySelector('#logomenu');
let menu = document.querySelector('UL');
function toggleMenu() {
    if (menu.style.display === "none") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

logomenu.addEventListener('click', (e)=>{
    if(e.target.closest('.menu')){
        toggleMenu()
    }
});



// Сохранение состояния страницы при перезагрузке

let title = document.querySelector('TITLE');
function closeAll() {
    loginPage.style.display = 'none';
    dashboard.hidden = true;
    accounts.hidden = true;
    records.hidden = true;
    mainBlock.hidden = false;
}
function changeLocation() {
    closeAll();

    switch (location.hash) {
        case '#dashboard':
            dashboard.hidden = false;
            renderAccounts();
            analiticCounts();
            title.innerHTML = 'dashboard'
            break;
        case '#accounts':
            accounts.hidden = false;
            title.innerHTML = 'accounts'
            renderAcc();
            break;
        case '#records':
            records.hidden = false
            counts();
            title.innerHTML = 'records';
            renderRecords();
            break;
        default:
            loginPage.style.display = 'flex';
            mainBlock.hidden = true;
            title.innerHTML = 'LOG'
            break;
    }
}
window.addEventListener('hashchange', changeLocation);
changeLocation();
