var crcTable = null;

function makeCRCTable() {
    let c;
    const crcTable = [];
    for(let n =0; n < 256; n++){
        c = n;
        for(let k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

export function calculateCRC32(data: Uint8Array): number {
    let crc32 = 0xffffffff;
    crcTable ??= makeCRCTable();

    for(let byte of data) {
        let lookupIndex = (crc32 ^ byte) & 0xff;
        crc32 = (crc32 >>> 8) ^ crcTable[lookupIndex];
    }

    return crc32 ^ 0xffffffff;
}