// 1. 登录/注册弹窗控制
function openLogin() {
  const modal = document.getElementById('loginBox');
  modal.classList.add('active');
}

function closeLogin() {
  const modal = document.getElementById('loginBox');
  modal.classList.remove('active');
}

// 2. 登录 / 注册 选项卡切换
document.getElementById('loginTab').addEventListener('click', function () {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
});

document.getElementById('registerTab').addEventListener('click', function () {
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
});

// 3. 用户名验证
function validateUsername(username) {
    const phoneReg = /^1[3-9]\d{9}$/;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneReg.test(username) || emailReg.test(username);
}

// 4. 密码强度检测
function checkPasswordStrength() {
    const pwd = document.getElementById('regPassword').value;
    const tip = document.getElementById('passwordStrength');
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/i.test(pwd)) strength++;

    if (strength === 0) tip.innerHTML = '';
    else if (strength <= 1) tip.innerHTML = '<span class="strength-weak">弱</span>';
    else if (strength <= 3) tip.innerHTML = '<span class="strength-medium">中</span>';
    else tip.innerHTML = '<span class="strength-strong">强</span>';
}

// 5. 注册逻辑
document.getElementById('registerBtn').addEventListener('click', function () {
    let username = document.getElementById('regUsername').value.trim();
    let password = document.getElementById('regPassword').value.trim();
    let confirmPwd = document.getElementById('regConfirmPassword').value.trim();

    if (!username || !password || !confirmPwd) {
        alert('请输入用户名、密码和确认密码');
        return;
    }
    if (password !== confirmPwd) {
        alert('两次输入的密码不一致');
        return;
    }
    if (!validateUsername(username)) {
        alert('用户名必须是手机号或邮箱格式');
        return;
    }
    if (password.length < 6) {
        alert('密码长度至少6位');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('用户名已存在');
        return;
    }
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('注册成功！');
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regConfirmPassword').value = '';
});

// 6. 登录逻辑
document.getElementById('loginBtn').addEventListener('click', function () {
    let username = document.getElementById('loginUsername').value.trim();
    let password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
        alert('登录成功！');
        closeLogin();
        localStorage.setItem('currentUser', username);
        document.querySelector('.login-link').innerText = '我的账户';
        document.querySelector('.login-link').onclick = openAccountModal;
    } else {
        alert('用户名或密码错误');
    }
});

// ------------------------------
// 购物车功能
// ------------------------------
let cartList = [];
const cartDom = document.querySelector('.cart');
cartDom.innerHTML = `🛒 购物车`;

cartDom.addEventListener('click', openCart);

function openCart() {
    renderCartList();
    document.getElementById('cartModal').classList.add('active');
}
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function renderCartList() {
    const body = document.getElementById('cartBody');
    if (cartList.length === 0) {
        body.innerHTML = '🛒 购物车为空～';
        return;
    }

    let total = 0;
    cartList.forEach(item => total += item.price);

    body.innerHTML = `
        ${cartList.map((item, idx) => `
            <div style="padding:10px 0;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                <div>${idx + 1}. ${item.name} 　¥${item.price}</div>
                <button onclick="removeItem(${idx})" style="color:red;border:none;background:none;cursor:pointer;">移除</button>
            </div>
        `).join('')}
        <div style="text-align:right;margin-top:15px;font-size:16px;font-weight:bold;">
            合计：¥${total}
        </div>
    `;
}

function removeItem(index) {
    cartList.splice(index, 1);
    renderCartList();
    cartDom.innerHTML = cartList.length === 0 ? `🛒 购物车` : `🛒 购物车 (${cartList.length})`;
}

function closePayModal(){
    document.getElementById('paySuccessModal').classList.remove('active');
}

function checkout() {
    if (cartList.length === 0) {
        alert('购物车为空！');
        return;
    }
    let total = cartList.reduce((sum, item) => sum + item.price, 0);
    alert(`结算成功！共 ${cartList.length} 件商品，合计 ¥${total}`);
    closeCart();
    document.getElementById('paySuccessModal').classList.add('active');
    cartList = [];
    cartDom.innerHTML = `🛒 购物车`;
}

const addBtns = document.querySelectorAll('.add-cart-btn');
const bookNames = ['人生海海', '朝花夕拾', '追风筝的人', '百年孤独'];
const bookPrices = [45, 32, 38, 58];
addBtns.forEach((btn, idx) => {
    btn.addEventListener('click', function () {
        cartList.push({ name: bookNames[idx], price: bookPrices[idx] });
        cartDom.innerHTML = `🛒 购物车 (${cartList.length})`;
        alert('已加入购物车');
    });
});

// 智能搜索
const books = [
    { name: '人生海海', author: '麦家', category: '文学小说', price: 45.00, rating: 4.5 },
    { name: '朝花夕拾', author: '鲁迅', category: '文学小说', price: 32.00, rating: 5.0 },
    { name: '追风筝的人', author: '卡勒德·胡赛尼', category: '文学小说', price: 38.00, rating: 4.5 },
    { name: '百年孤独', author: '加西亚·马尔克斯', category: '文学小说', price: 58.00, rating: 5.0 },
];

document.getElementById('searchInput').addEventListener('input', function () {
    const keyword = this.value.trim();
    const type = document.getElementById('searchType').value;
    const resultBox = document.getElementById('searchResult');

    if (!keyword) {
        resultBox.innerHTML = '';
        return;
    }

    const filtered = books.filter(book => {
        if (type === 'name') return book.name.includes(keyword);
        if (type === 'author') return book.author.includes(keyword);
        if (type === 'category') return book.category.includes(keyword);
    });

    resultBox.innerHTML = filtered.map(book => `
        <div class="item">
            <strong>${book.name}</strong> - ${book.author}
            <br>¥${book.price}
        </div>
    `).join('');
});

// ------------------------------
// ✅ ✅ ✅ 最终正确：我的账户逻辑
// ------------------------------
function openAccountModal() {
    // 只打开账户！不打开登录！
    closeLogin();
    closeCart();
    document.getElementById('accountModal').classList.add('active');
}

function closeAccountModal() {
    document.getElementById('accountModal').classList.remove('active');
}

// 切换账号 → 关闭账户 → 打开登录
function switchAccount() {
    closeAccountModal();
    openLogin();
}

// 退出登录 → 关闭账户 → 打开登录
function logout() {
    localStorage.removeItem('currentUser');
    document.querySelector('.login-link').innerText = '登录';
    document.querySelector('.login-link').onclick = openLogin;
    closeAccountModal();
    openLogin();
    alert('已退出登录');
}

// 页面加载
window.addEventListener('load', function() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        document.querySelector('.login-link').innerText = '我的账户';
        document.querySelector('.login-link').onclick = openAccountModal;
    } else {
        document.querySelector('.login-link').innerText = '登录';
        document.querySelector('.login-link').onclick = openLogin;
    }
});