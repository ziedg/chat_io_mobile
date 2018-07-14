
export function emailValidator(email) {
    if(email.value == "" || !email.value ){
        return null;
    }
    var valid = /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/.test(email.value);
    if (!valid)
    {
        return {'isInvalidEmail':true};
    }
    return null;
}



