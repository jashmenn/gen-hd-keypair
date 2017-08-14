const bcoin = require('bcoin');
const chalk = require('chalk');

/**
 * To understand these see:
 * * BIP32 https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
 * * BIP39 https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 * * BIP44 https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 **/
function run(argv) {
  let network = bcoin.network.get(argv.network);
  let childIdx = argv.index || 0;

  let mnemonic = argv.mnemonic
    ? bcoin.hd.Mnemonic.fromPhrase(argv.mnemonic)
    : new bcoin.hd.Mnemonic();

  // Generate the master key
  let master = bcoin.hd.fromMnemonic(mnemonic, network);

  // Derive the first BIP44 external address.
  // See: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#examples
  let key = master.derive(childIdx);
  let keyring = new bcoin.keyring(key.privateKey, network);

  let info = {
    mnemonic: mnemonic.getPhrase(),
    xprivkey: master.toJSON().xprivkey,
    xpubkey: master.xpubkey(),
    derived: {
      private: keyring.toSecret(),
      address: keyring.getAddress('base58'),
    }
  };

  if (argv.json) {
    console.log(JSON.stringify(info, null, 2));
  } else {
    console.log(
      '🔒 ',
      chalk.blue('Root mnemonic (') + chalk.red('private') + chalk.blue('):'),
      chalk.magenta(info.mnemonic)
    );
    console.log(
      '🔒 ',
      chalk.blue('Master xprivkey (') + chalk.red('private') + chalk.blue('):'),
      chalk.magenta(info.xprivkey)
    );
    console.log(
      '⭐ ',
      chalk.blue('Master xpubkey (') + chalk.green('public') + chalk.blue('):'),
      chalk.green(info.xpubkey)
    );
    console.log('-----');
    console.log(
      '🔒 ',
      chalk.blue('WIF [' + childIdx + '] (') + chalk.red('private') + chalk.blue('):'),
      chalk.magenta(info.derived.private)
    );
    console.log(
      '⭐ ',
      chalk.blue('Receiving Address [' + childIdx + '] (') +
        chalk.green('public') +
        chalk.blue('):'),
      chalk.green(info.derived.address)
    );

  }
}

module.exports = run;
