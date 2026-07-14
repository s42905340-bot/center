let students = JSON.parse(localStorage.getItem('myCenterData')) || [];
let groups = JSON.parse(localStorage.getItem('myGroups')) || ["المجموعة الأولى"];

const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: groups, datasets: [{ label: 'عدد الطلاب', data: [], backgroundColor: '#3498db' }] }
});

function checkLogin() {
    let inputPass = document.getElementById('passInput').value;
    let savedPass = localStorage.getItem('myCenterPass') || "1234";

    if (inputPass === savedPass) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        alert("كلمة المرور خطأ!");
    }
}

function addGroup() {
    let name = document.getElementById('newGroupInput').value;
    if(name) { groups.push(name); localStorage.setItem('myGroups', JSON.stringify(groups)); updateSystem(); }
}

function updateSystem() {
    let select = document.getElementById('groupSelect');
    select.innerHTML = groups.map(g => `<option>${g}</option>`).join('');
    
    let tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td>${s.name}</td><td>${s.group}</td><td>${s.fees}</td>
            <td>
                <button onclick="deleteStudent(${i})" style="background:#e74c3c; padding: 5px;">حذف</button>
                <button onclick="window.open('https://wa.me/')" style="background:#25d366; padding: 5px;">واتساب</button>
            </td>
        </tr>`).join('');
    
    let totalFees = students.reduce((sum, s) => sum + parseFloat(s.fees || 0), 0);
    document.getElementById('statsText').innerText = "إجمالي الطلاب: " + students.length + " | الإيرادات: " + totalFees + " جنيه";
    
    myChart.data.labels = groups;
    myChart.data.datasets[0].data = groups.map(g => students.filter(s => s.group === g).length);
    myChart.update();
    localStorage.setItem('myCenterData', JSON.stringify(students));
}

function addStudent() {
    let name = document.getElementById('studentName').value;
    let group = document.getElementById('groupSelect').value;
    let fees = document.getElementById('feesPaid').value;
    if(name) { students.push({name, group, fees}); updateSystem(); }
}

function deleteStudent(i) { students.splice(i, 1); updateSystem(); }

function searchStudent() {
    let query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#studentTable tbody tr').forEach(row => {
        row.style.display = row.cells[0].innerText.toLowerCase().includes(query) ? "" : "none";
    });
}

function changePassword() {
    let newPass = document.getElementById('newPassInput').value;
    if (newPass) {
        localStorage.setItem('myCenterPass', newPass);
        alert("تم تغيير كلمة المرور بنجاح!");
        document.getElementById('newPassInput').value = "";
    } else {
        alert("الرجاء إدخال كلمة مرور جديدة.");
    }
}
function addTeacher() {
    let name = prompt("Enter Teacher Name:");
    if(name) {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = name;
        document.getElementById("teachersList").appendChild(li);
    }
}

function addStudent() {
    let name = prompt("Enter Student Name:");
    if(name) {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = name;
        document.getElementById("studentsList").appendChild(li);
    }
}
// وظيفة حذف الطالب أو المدرس عند الضغط على اسمه
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('list-group-item')) {
        if (confirm("هل تريد حذف هذا الاسم؟")) {
            e.target.remove();
        }
    }
});
// وظيفة الإضافة
function addItem(type) {
    let name = prompt("Enter Name:");
    if (!name) return;
    let listId = type === 'teachers' ? 'teachersList' : 'studentsList';
    renderItem(listId, name);
    saveData();
}

// وظيفة عرض العنصر مع أزرار التحكم
function renderItem(listId, name) {
    let ul = document.getElementById(listId);
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `<span>${name}</span> 
    <div>
        <button class="btn btn-sm btn-warning me-2" onclick="editItem(this)">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="this.parentElement.parentElement.remove(); saveData();">Delete</button>
    </div>`;
    ul.appendChild(li);
}

// وظيفة التعديل
function editItem(btn) {
    let span = btn.parentElement.parentElement.querySelector('span');
    let newName = prompt("Edit Name:", span.textContent);
    if (newName) span.textContent = newName;
    saveData();
}

// حفظ البيانات في المتصفح
function saveData() {
    localStorage.setItem("data", document.body.innerHTML);
}

// تحميل البيانات عند فتح الموقع
window.onload = () => {
    let saved = localStorage.getItem("data");
    if (saved) document.body.innerHTML = saved;
};