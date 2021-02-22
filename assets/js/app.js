$(document).ready(function () {
  let passcode;
  loadWallet();

  $('#inputPasscode').on('input', function (e) {
    const { value } = e.target;
    if (value.length === 6) {
      passcode = value;
      resetPasscodeFields();
      $('#passcodeComp').hide();
      $('#confirmPasscodeComp').removeAttr('style');
      $('#inputConfirmPasscode').focus();
    }
  });

  $('#inputConfirmPasscode').on('input', function (e) {
    const { value } = e.target;
    if (value.length === 6) {
      if (value === passcode) {
        $('#loading').html('Creating your wallet. Please wait...');
        $('#walletActionButtons').hide();
        togglePasscodeModal();
        return createWallet(value);
      }
      alert('Please type correct passcode!');
    }
  });

  $('#inputVerifyPasscode').on('input', function (e) {
    const { value } = e.target;
    if (value.length === 6) {
      passcode = value;
      toggleCheckPasscodeModal();
      toggleMnemonicRestoreModal();
    }
  });

  $('#btnSubmitMnemonic').on('click', function () {
    const phrase = $('#inputMnemonic').val();
    if (phrase.length < 10) {
      alert('Please enter your 12 word phrase');
      return;
    }
    toggleMnemonicRestoreModal();
    $('#loading').html('Restoring your wallet. Please wait...');
    $('#walletActionButtons').hide();
    return createWallet(passcode, phrase);
  });
});

// ====================
const loadWallet = async () => {
  const wallet = getEncryptedWallet();
  const address = getAddress();
  const mnemonic = getMnemonic();
  if (wallet && address) {
    $('#hasWallet').removeAttr('style');
    $('#walletAddress').html(address);
    $('#mnemonicPhrase').html(mnemonic);
  } else {
    $('#walletActionButtons').removeAttr('style');
  }
};

const createWallet = async (passcode, mnemonic) => {
  try {
    if (!passcode) {
      throw Error('Passcode must be set first');
    }
    let wallet = getEncryptedWallet();
    if (wallet) return { wallet: null, encryptedWallet: wallet };
    if (mnemonic) wallet = ethers.Wallet.fromMnemonic(mnemonic);
    else wallet = ethers.Wallet.createRandom();
    const { address, privateKey } = wallet;
    const { phrase } = wallet.mnemonic;
    const encryptedWallet = await wallet.encrypt(passcode.toString());
    saveMnemonic(phrase);
    saveEncryptedWallet(encryptedWallet);
    saveAddress(address);
    savePrivateKey(privateKey);
    window.location.reload();
  } catch (err) {
    console.log('ERR==>', err);
    alert('Invalid wallet info');
  }
};

const toggleCheckPasscodeModal = () => {
  resetPasscodeFields();
  $('#mdlCheckPasscode').modal('toggle');
};

const togglePasscodeModal = () => {
  resetPasscodeFields();
  $('#mdlPasscode').modal('toggle');
};

const toggleMnemonicRestoreModal = () => {
  $('#mdlMnemonicRestore').modal('toggle');
};
