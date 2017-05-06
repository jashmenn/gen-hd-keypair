const bcoin = require("bcoin");

/**
 * To understand these see:
 * * BIP32 https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 * * BIP39 https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * * BIP44 https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 **/
function run(argv) {
  let network = argv.network;

  let mnemonic = argv.mnemonic
    ? bcoin.hd.Mnemonic.fromPhrase(argv.mnemonic)
    : new bcoin.hd.Mnemonic();

  // Generate the master key
  let master = bcoin.hd.fromMnemonic(mnemonic, network);

  // Derive the first BIP44 external address.
  // See: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#examples
  let key = master.derive("m/44'/0'/0'/0/0");
  let keyring = new bcoin.keyring(key.privateKey, network);

  console.log("🔒  Root mnemonic (private): ", mnemonic.getPhrase());
  console.log("🔒  Master xprivkey (private): ", master.toJSON().xprivkey);
  console.log("-----");
  console.log("🔒  First WIF (private): ", keyring.toSecret());
  console.log("☀️  First receiving address (public): ", keyring.getAddress("base58"));
}

module.exports = run;
