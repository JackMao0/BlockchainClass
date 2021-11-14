import Utils from 'web3-utils';

function getWeiName(tokendecimals = 18): Utils.Unit {
    let weiname = 'ether' as Utils.Unit;
    switch (tokendecimals) {
        case 3:
            weiname = "Kwei";
            break;
        case 6:
            weiname = 'mwei';
            break;
        case 9:
            weiname = 'gwei';
            break;
        case 12:
            weiname = 'microether';
            break;
        case 15:
            weiname = 'milliether';
            break;
        case 18:
            weiname = 'ether';
            break;

    }
    return weiname;
}

const numberToString = (n: number) => n.toLocaleString('fullwide', { useGrouping: false })

export { getWeiName, numberToString }