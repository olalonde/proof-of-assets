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

    var res;
    var html = '';

    try {
      var partial_tree = blproof.deserializePartialTree($('#partial_tree').val());
      var expected_root = JSON.parse($('#expected_root').val());

      res = blproof.verifyTree(partial_tree, expected_root);
    }
    catch (err) {
      html += 'Verification failed!';
      html += '<br><br>';
      html += err.message;

      $('#verification').removeClass('alert-success').addClass('alert-danger').html(html);
      return;
    }

    html += 'Verification successful!';
    html += '<br><br>';
    html += 'User: ' + res.user;
    html += '<br>';
    html += 'Balance: ' + res.value;

    $('#verification').removeClass('alert-danger').addClass('alert-success').html(html);
    $('#verify_results').show();
  });
});

$(function () {
  $.get('accounts.json', function (data) {
    $('#accounts').html(data);

    $('#btn_generate').trigger('click');
  }, 'text');
});

