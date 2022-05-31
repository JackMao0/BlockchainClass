module.exports = {
    //通过小数点多少位，转换对应的数据
    "getweiname":function getweiname(tokendecimals = 18) {
            weiname = 'ether';
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
                    weiname = 'microether ';
                    break;
                case 15:
                    weiname = 'milliether';
                    break;
                case 18:
                    weiname = 'ether';
                    break;

            }
            return weiname;
        },

};

