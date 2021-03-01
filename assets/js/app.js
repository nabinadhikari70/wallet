$(document).ready(function () {
  let passcode;
  resetSendForm();
  loadWallet();

  $('input[type=radio][name=network]').change(function () {
    saveCurrentNetwork(this.value);
    window.location.reload();
  });

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
    fetchBalance(address);
    $('#hasWallet').removeAttr('style');
    $('#walletAddress').html(address);
    $('#mnemonicPhrase').html(mnemonic);
  } else {
    $('#walletActionButtons').removeAttr('style');
  }
};

const fetchBalance = (address) => {
  const network = getNetworkByName();
  const { url, name } = network;
  $('#' + name).attr('checked', true);
  const provider = new ethers.providers.JsonRpcProvider(url);
  provider
    .getBalance(address)
    .then((balance) => {
      const myBalance = ethers.utils.formatEther(balance);
      $('#myBalance').html(myBalance);
    })
    .catch((err) => {
      console.log('ERR:', err);
    });
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

const sendEther = async () => {
  try {
    const sendToAddress = $('#inputSendToAddress').val();
    const sendAmount = $('#inputAmount').val();
    if (!sendAmount || !sendToAddress)
      return alert('Recepient address and amount is required!');

    $('#sendEther').html('Sending ether, please wait....');
    const wallet = await loadFromPrivateKey();
    await wallet.sendTransaction({
      to: sendToAddress,
      value: ethers.utils.parseEther(sendAmount.toString()),
    });
    resetSendForm();
    alert(`${sendAmount} ethers sent to an address ${sendToAddress}`);
    window.location.reload();
  } catch (err) {
    console.log('ERR:==>', err);
    alert('OOPS!, Transaction failed!');
    window.location.reload();
  }
};

const loadFromPrivateKey = async () => {
  const privateKey = getPrivatekey();
  if (!privateKey) return null;
  let wallet = await new ethers.Wallet(privateKey);
  if (!wallet) throw Error('Wallet not found');
  const network = getNetworkByName();
  const { url } = network;
  const provider = new ethers.providers.JsonRpcProvider(url);
  wallet = wallet.connect(provider);
  return wallet;
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
