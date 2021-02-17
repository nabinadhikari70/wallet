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
    console.log({ value });
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
});

// ====================
const loadWallet = async () => {
  let wallet = getEncryptedWallet();
  if (wallet) {
    $('#walletActionButtons').removeAttr('style');
  } else {
    $('#hasWallet').removeAttr('style');
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
    const encryptedWallet = await wallet.encrypt(passcode.toString());
    saveEncryptedWallet(encryptedWallet);
    saveAddress(address);
    savePrivateKey(privateKey);
    window.location.reload();
  } catch (err) {
    console.log('ERR==>', err);
  }
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
const saveEncryptedWallet = (wallet) => {
  localStorage.setItem('encWallet', wallet);
};

const getEncryptedWallet = () => {
  localStorage.getItem('encWallet');
};

const savePrivateKey = (privateKey) => {
  localStorage.setItem('privateKey', privateKey);
};

const getPrivatekey = () => {
  localStorage.getItem('privateKey');
};

const saveAddress = (address) => {
  localStorage.setItem('address', address);
};

const getAddress = () => {
  localStorage.getItem('address');
};
// ===========END Local Storage ===========

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
