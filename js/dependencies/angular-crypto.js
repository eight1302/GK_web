angular.module('ngCrypto', [])
    .provider('$crypto', function CryptoKeyProvider() {
        var cryptoKey;

        this.setCryptographyKey = function(value) {
            cryptoKey = value;
        };

        var configEcb7 = {
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        };

        this.$get = [function(){
            return {
                getCryptoKey: function() {
                    return cryptoKey
                },

                encrypt: function(message, key) {
                    if (key === undefined) {
                        key = cryptoKey;
                    }
                    var key  = CryptoJS.enc.Base64.parse(key);
                    return CryptoJS.AES.encrypt(message, key ,configEcb7).toString();
                },

                decrypt: function(message, key) {
                    if (key === undefined) {
                        key = cryptoKey;
                    }
                    var key  = CryptoJS.enc.Base64.parse(key);
                    return CryptoJS.AES.decrypt(message, key, configEcb7).toString(CryptoJS.enc.Utf8);
                }
            }
        }];
    });
