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

  $('#btnSubmitMnemonic').on('click', function () {
    console.log('Hey');
    const phrase = $('#inputMnemonic').val();
    if (phrase.length < 10) {
      alert('Please enter your 12 word phrase');
      return;
    }
    console.log('SUBMIT');
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

const checkPasscodeModal = () => {
  resetPasscodeFields();
  $().modal('toggle');
};

const togglePasscodeModal = () => {
  resetPasscodeFields();
  $('#mdlPasscode').modal('toggle');
};

const toggleMnemonicRestoreModal = () => {
  $('#mdlMnemonicRestore').modal('toggle');
};

const resetPasscodeFields = () => {
  $('#inputPasscode').val('');
  $('#inputConfirmPasscode').val('');
};

// =========== Local Storage ===========
const saveMnemonic = (mnemonic) => {
  localStorage.setItem('mnemonic', mnemonic);
};

const getMnemonic = () => {
  return localStorage.getItem('mnemonic');
};

const saveEncryptedWallet = (wallet) => {
  localStorage.setItem('encWallet', wallet);
};

const getEncryptedWallet = () => {
  return localStorage.getItem('encWallet');
};

const savePrivateKey = (privateKey) => {
  localStorage.setItem('privateKey', privateKey);
};

const getPrivatekey = () => {
  return localStorage.getItem('privateKey');
};

const saveAddress = (address) => {
  localStorage.setItem('address', address);
};

const getAddress = () => {
  return localStorage.getItem('address');
};
// ===========END Local Storage ===========

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
