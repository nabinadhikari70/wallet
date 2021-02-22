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

const resetPasscodeFields = () => {
  $('#inputPasscode').val('');
  $('#inputConfirmPasscode').val('');
  $('#inputVerifyPasscode').val('');
  $('#inputMnemonic').val('');
};

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
