function setNumberFormGroupToError(selector) {
    $(selector).addClass('has-error');
    $(selector).removeClass('has-success');
}

function setNumberFormGroupToSuccess(selector) {
    $(selector).removeClass('has-error');
    $(selector).addClass('has-success');
}

function setNumberFormGroupToNormal(selector) {
    $(selector).removeClass('has-error');
    $(selector).removeClass('has-success');
}

function forceBlurIos() {
    if (!isIos()) {
        return;
    }
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input);
    input.focus();
    input.parentNode.removeChild(input);
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
