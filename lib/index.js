var bitcoinsig = require('./bitcoinsig');


function verify_signature (addr, sig, message) {
  var res = bitcoinsig.verifyMessage(sig, message);

  if (!res) return false;

  return (res === addr);
}

function verify_signatures (obj) {
  var message = obj.id;
  
  for (var i = 0; i < obj.signatures.length; i++) {
    var addr = obj.signatures[i].address;
    var sig = obj.signatures[i].signature;

    if (!verify_signature(addr, sig, message))
      return false;
  }
  return true;
}

module.exports.verifySignatures = verify_signatures;
