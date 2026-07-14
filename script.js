let students = JSON.parse(localStorage.getItem('myCenterData')) || [];
let groups = JSON.parse(localStorage.getItem('myGroups')) || ["المجموعة الأولى"];

const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: groups, datasets: [{ label: 'عدد الطلاب', data: [], backgroundColor: '#3498db' }] }
});

function checkLogin() {
    if(document.getElementById('passInput').value === "1234") {
        document.getElementById('loginPage').style.display = "none";
        document.getElementById('mainContent').style.display = "block";
        updateSystem();
    } else { alert("كلمة مرور خطأ"); }
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