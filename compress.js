let table = null;
const radix = 512;


export default function(str, level){

    if(!table){
        table = new Array(radix);
        for(let i = 0; i < radix; i++) table[i] = i + 33;
        table = String.fromCharCode.apply(null, table);
    }

    return str;
}

function crc(data, crc = 0, prime = 0) {
    for(let i = 0, t, z; i < data.length; i++, crc &= 0xFFFF) {
        t = (crc >> 8) ^ data.charCodeAt(i);
        z = t;
        t ^= t >> 1;
        t ^= t >> 2;
        t ^= t >> 4;
        t &= 1;
        t |= z << 1;
        crc = (crc << 8) ^ (t << 15) ^ (t << 1) ^ (t);
    }
    return (prime ? (crc ^ 0) % prime : (crc ^ 0));
}

// 1252 3106 3841 [5559] 6191 7623 [[10239]
function crc2(str, crc = 0, prime = 5559) {
    for(let i = 0; i < str.length; i++) {
        crc += (crc << 2) - crc + str.charCodeAt(i);
    }
    return prime ? (crc >>> 0) % prime : crc >>> 0;
}
