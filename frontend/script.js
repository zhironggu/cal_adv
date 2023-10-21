var willSum = "";
//获取文本框id
var idText = document.getElementById("textBox");


const textBox = document.getElementById('textBox');
const overlay = document.getElementById('overlay');
const dropdown = document.getElementById('dropdown');
const historyList = document.getElementById('history');
dropdown.addEventListener('click', function () {
    dropdown.style.display = 'none';
})
overlay.addEventListener('click', function () {
    if (dropdown.style.display == "block") {
        dropdown.style.display = 'none';

    } else {
        document.getElementById("overlay").addEventListener("click", function () {
              axios.get("http://127.0.0.1:3000/getHistory").then(res => {
                let result = res.data;
                if (result.length == 0) {
                    const newLi = document.createElement('li');
                    newLi.textContent = "暂无历史记录"
                    historyList.appendChild(newLi);
                } else {
                    historyList.innerHTML = '';
                    for (var i = 0; i < result.length; i++) {
                        console.log(historyList)
                        const newLi = document.createElement('li');
                        newLi.textContent = result[i].expression;
                        historyList.appendChild(newLi);
                    }
                }

            })
        });
        dropdown.style.display = 'block';

    }
});


function compute(v) {
    if (v.innerText == "AC") {//清零
        willSum = "";
        idText.value = "0";

    } else if (v.innerText == "Back") {//回退
        if (idText.value.length > 0) {
            willSum = willSum.substring(0, willSum.length - 1);
            idText.value = willSum;
        }

    } else if (cheak(v.innerText) == true) {//小数点和运算符处理
        var ch;
        if (v.innerText == "X") {//乘法处理
            ch = "*";
        } else {
            ch = v.innerText
        }
        if (ch != willSum.charAt(willSum.length - 1) && !cheak(willSum.charAt(willSum.length - 1))) {
            willSum += ch;
            idText.value = willSum;
        }

    } else if (v.innerText == "=") {
        //求值
        window.eval("willSum = " + idText.value)

        idText.value = idText.value + "=" + willSum;
        willSum = "";
        axios.post("http://127.0.0.1:3000/addHistory", {"expression": idText.value}).then(res => {
            console.log(res)
        })

    } else {
        willSum += v.innerText;
        idText.value = willSum;
    }

}

var cheak = function (x) {
    var ch = ["+", "-", "X", "/", "%", "."];
    for (var i = 0; i < ch.length; i++) {
        if (ch[i] == x) {
            return true;
        }
    }
    return false;
}

document.getElementById("calculate-deposit").onclick = () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const time = parseFloat(document.getElementById("time").value);
    axios.get(`http://127.0.0.1:3000/getDepositInterestRate?time=${time}`)
        .then(res => {
            const rate = res.data.rate;
            const interest = amount * (rate / 100) * (time / 12);
            document.getElementById("result").textContent = `存款利息：${interest.toFixed(2)}`;
        });
};


document.getElementById("calculate-loan").onclick = () => {
    const amount = parseFloat(document.getElementById("amount").value);
    const time = parseFloat(document.getElementById("time").value);
    if (time < 6) {D

        alert("贷款时间不能低于6个月!")
        return;
    }
    axios.get(`http://127.0.0.1:3000/getLendingRate?time=${time}`)
        .then(res => {
            const rate = res.data.rate;
            const interest = amount * (rate / 100 / 12) * time;
            document.getElementById("result").textContent = `贷款利息：${interest.toFixed(2)}`;
        });
};

