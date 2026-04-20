const startApp = (event) => {
  event.preventDefault();

  const name = document.getElementById('welcome-name').value.trim();

  if (!name) {
    alert('名前を入力してください');
    return;
  }

  localStorage.setItem('care-name', name);

  document.getElementById('welcome-screen').style.display = 'none';

  document.getElementById('main-screen').style.display = 'block';
};

const switchTab = (name) => {

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    if (tab.getAttribute('onclick') === `switchTab('${name}')`) {
      tab.classList.add('active');
    }
  });

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.style.display = 'none';
  });

  document.getElementById('panel-' + name).style.display = 'block'
};

let records = JSON.parse(localStorage.getItem('care-records') || '[]');

const addRecord = (event, type) => {
  event.preventDefault();

  let date = '';
  let data = {};

  if (type === 'vital') {
    date = document.getElementById('v-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }
    data = {
      temp: document.getElementById('v-temp').value,
      spo2: document.getElementById('v-spo2').value,
      hr: document.getElementById('v-hr').value,
      rr: document.getElementById('v-rr').value,
      weight: document.getElementById('v-weight').value,
      memo: document.getElementById('v-memo').value,
    };
  } else if (type === 'care') {
    date = document.getElementById('s-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }

    data = {
      site: document.getElementById('s-site').value,
      amount: document.getElementById('s-amount').value,
      color: document.getElementById('s-color').value,
      memo: document.getElementById('s-memo').value,
    };
  } else if (type === 'meal') {
    date = document.getElementById('m-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }

    data = {
      method: document.getElementById('m-method').value,
      amount: document.getElementById('m-amount').value,
      time: document.getElementById('m-time').value,
      content: document.getElementById('m-content').value,
      memo: document.getElementById('m-memo').value,
    };
  } else if (type === 'respirator') {
    date = document.getElementById('r-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }

    data = {
      mode: document.getElementById('r-mode').value,
      fio2: document.getElementById('r-fio2').value,
      peep: document.getElementById('r-peep').value,
      memo: document.getElementById('r-memo').value,
    };
  } else if (type === 'drug') {
    date = document.getElementById('d-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }

    data = {
      name: document.getElementById('d-name').value,
      amount: document.getElementById('d-amount').value,
      method: document.getElementById('d-method').value,
      result: document.getElementById('d-result').value,
      memo: document.getElementById('d-memo').value,
    };
  } else if (type === 'excretion') {
    date = document.getElementById('e-date').value;

    if (!date) {
      alert('日付を選択してください');
      return;
    }

    data = {
      type: document.getElementById('e-type').value,
      amount: document.getElementById('e-amount').value,
      memo: document.getElementById('e-memo').value,
    };
  }

  records.push({
    id: Date.now(),
    type: type,
    date: date,
    data: data
  });

  localStorage.setItem('care-records', JSON.stringify(records));

  showKeep();
  renderLog();
};

const showKeep = () => {
  const keep = document.getElementById('keep');
  keep.classList.add('show');
  setTimeout(() => {
    keep.classList.remove('show');
  }, 2000);
};

const LABELS = {
  vital: 'バイタル',
  care: '吸引',
  meal: '胃瘻・経管',
  respirator: '呼吸器',
  drug: 'お薬',
  excretion: '排泄',
};

const fmt = (dt) => {
  const d = new Date(dt);
  return (d.getMonth() + 1) + '/' + d.getDate() + '' + String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0');
};

const bodyText = (r) => {
  const d = r.data;
  const parts = [];
  if (r.type === 'vital') {
    if (d.temp) parts.push('体温 ' + d.temp + '℃');
    if (d.spo2) parts.push('SpO₂ ' + d.spo2 + '%');
    if (d.hr) parts.push('心拍 ' + d.hr);
    if (d.rr) parts.push('呼吸 ' + d.rr);
    if (d.weight) parts.push('体重 ' + d.weight + 'g');
  } else if (r.type === 'care') {
    if (d.site) parts.push(d.site);
    if (d.amount) parts.push(d.amount);
    if (d.color) parts.push(d.color);
  } else if (r.type === 'meal') {
    if (d.method) parts.push(d.method);
    if (d.amount) parts.push(d.amount + 'ml');
    if (d.time) parts.push(d.time + '分');
    if (d.content) parts.push(d.content);
  } else if (r.type === 'respirator') {
    if (d.mode) parts.push(d.mode);
    if (d.fio2) parts.push('FiO₂ ' + d.fio2 + '%');
    if (d.peep) parts.push('PEEP ' + d.peep);
  } else if (r.type === 'drug') {
    if (d.name) parts.push(d.name);
    if (d.amount) parts.push(d.amount);
    if (d.method) parts.push(d.method);
    if (d.result) parts.push(d.result);
  } else if (r.type === 'excretion') {
    if (d.type) parts.push(d.type);
    if (d.amount) parts.push(d.amount);
  }
  return parts.join(' · ');
};

const renderLog = () => {
  const el = document.getElementById('log-list');
  if(records.length === 0) {
    el.innerHTML = '<p class="empty">まだ記録がありません</p>';
    return;
  }

  let html = '<p class="count">' + records.length + '件の記録</p>';

  records.forEach((r) => {
    html += `
    <article class="rec">
      <time class="rec-time">${fmt(r.date)}</time>
      <span class="badge">${LABELS[r.type] || r.type}</span>
      <p class="rec-body">${bodyText(r)}</p>
      
      ${r.data.memo ? `<p class="rec-memo">${r.data.memo}</p>` : ''}
      
      <button class="btn-del" onclick="delRec(${r.id})">削除</button>
    </article>
  `;
  });

  el.innerHTML = html;
};

const delRec = (id) => {
  if (!confirm('この記録を削除しますか？')) return;
  records = records.filter((r) => r.id !== id);
  localStorage.setItem('care-records', JSON.stringify(records));
  renderLog();
};

const savedName = localStorage.getItem('care-name');
if (savedName) {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'block';
}

