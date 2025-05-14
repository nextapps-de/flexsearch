let table, timer;

const cache = new Map();

function toRadix(number, radix = 255) {

    if (!table) {
        table = Array(radix);

        for (let i = 0; i < radix; i++) table[i] = i + 1;
        table = String.fromCharCode.apply(null, table);
    }

    let rixit,
        residual = number,
        result = "";


    while (!0) {
        rixit = residual % radix;
        result = table.charAt(rixit) + result;
        residual = 0 | residual / radix;
        if (!residual) break;
    }

    return result;
}

export default function (str) {
    if (timer) {
        if (cache.has(str)) {
            return cache.get(str);
        }
    } else {
        timer = setTimeout(clear, 1);
    }


    const result = toRadix("number" == typeof str ? str : lcg(str));

    2e5 < cache.size && cache.clear();
    cache.set(str, result);


    return result;
}

function lcg(str) {
    let range = 4294967295;
    if ("number" == typeof str) {
        return str & range;
    }
    let crc = 0;
    for (let i = 0; i < str.length; i++) {
        crc = (crc * 33 ^ str.charCodeAt(i)) & range;
    }

    return crc + 2147483648;
}

function clear() {
    timer = null;
    cache.clear();
}