function error (e, tab) {
  $('#' + tab + '_results').hide();
  $('#' + tab + ' .flash h4').html(e.name || 'Error');
  $('#' + tab + ' .flash p').html(e.message || e);
  $('#' + tab + ' .flash').show();
}

function serialize (obj) {
  return JSON.stringify(obj, undefined, 2);
}

// Track tab in URL
// see http://stackoverflow.com/questions/12131273/twitter-bootstrap-tabs-url-doesnt-change
$(function(){
  var hash = window.location.hash;
  hash && $('.navbar-nav a[href="' + hash + '"]').tab('show');

  $('.navbar-nav a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});

// Generate
$(function () {
  $('#btn_generate').on('click', function (e) {
    e.preventDefault();
    $('#generate .flash').hide();

    var private_keys = $('#private_keys').val().split(',');
    private_keys.forEach(function (val, i) { private_keys[i] = val.trim(); });
    var message = $('#message').val();

    var proof = baproof.signAll(private_keys, message);

    $('#asset_proof').html(serialize(proof));

    $('#generate_results').show();
  });
});

// Verify
$(function () {
  $('#btn_verify').on('click', function (e) {
    e.preventDefault();
    $('#verify .flash').hide();

    var proof = JSON.parse($('#asset_proof_verify').val());

    var res = baproof.verifySignatures(proof);

    var html = '';
    if (res) {
      html = 'Proof verified successfuly!';
      $('#verification').removeClass('alert-danger').addClass('alert-success').html(html);
    }
    else {
      html += 'Verification failed!';
      $('#verification').removeClass('alert-success').addClass('alert-danger').html(html);
    }

    $('#verification').html(html);
    $('#verify_results').show();

    // Retrieve total amount controled by addresses
    var addresses = [];
    proof.signatures.forEach(function (obj) {
      addresses.push(obj.address);
    });

    try {
      baproof.getBalance(addresses, function (err, balance) {
        if (err) {
          html += JSON.stringify(err);
        }
        else {
          html += '<h3>Balance: ' + balance + '</h3>';
        }
        $('#verification').html(html);
      });
    }
    catch (err) {}
  });
});

// Initialize
$(function () {
  $('#btn_generate').trigger('click');
});

