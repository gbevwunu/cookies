'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const modalBg = select('.modal-bg');
const modalOne = select('.modal-one');
const acceptBtn = select('.accept');
const settingsBtn = select('.settings');
const modalTwo = select('.modal-two');
const saveBtn= select('.save');

function showModal() {
    modalOne.classList.add('block');
    modalBg.classList.add('modal-bg-dark');
}

function printAllCookies() {
    print(`Browser: ${getCookie('Browser')}`);
    print(`Operating system: ${getCookie('Operating system')}`);
    print(`Screen width: ${getCookie('Screen width')}`);
    print(`Screen height: ${getCookie('Screen height')}`);
}

onEvent('load', window, () => {
    if (!document.cookie.length > 0) {
        setTimeout(showModal, 2000);
    } else {
       printAllCookies();
    }
});

onEvent('click', settingsBtn, () => {
    modalTwo.classList.add('block');
});

function setAllCookies() {
    setCookie('Browser', getBrowser(), 15);
    setCookie('Operating system', getOS(), 15);
    setCookie('Screen width', getScreenWidth(), 15);
    setCookie('Screen height', getScreenHeight(), 15);
    print('Cookies saved succesfully');
}

function removeModals() {
    modalOne.classList.remove('block');
    modalTwo.classList.remove('block');
    modalBg.classList.remove('modal-bg-dark');
}

onEvent('click', acceptBtn, () => {
    setAllCookies();
    printAllCookies();
    removeModals();
});

function setPreferences(arr) {
    let options = ['Browser', 'Operating system', 'Screen width', 'Screen height']
    let functions = [getBrowser(), getOS(), getScreenWidth(), getScreenHeight()];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            setCookie(`${options[i]}`, functions[i], 15);
        }
    }
    allRejected(arr);
    print('Cookies saved successfully');
}

function allRejected(arr) {
    if (arr.every(ele => !ele.checked)) {
        setCookie('Cookies', 'All rejected', 15);
    }
}

onEvent('click', saveBtn, () => {
    let inputs = selectAll('.modal-two input');
    setPreferences(inputs);
    removeModals();
})

function getBrowser() {
    let browserArr = navigator.userAgent.split(' ');
    for (let i = browserArr.length - 1; i >= 0;  i--) {
        if (browserArr[i].match(/firefox/i)) {
            return encodeURIComponent(`Firefox`);
        } else if (browserArr[i].match(/edg/i)) {
            return encodeURIComponent(`Edge`);
        } else {
            return encodeURIComponent(`Chrome`);
        }
    }
}

function getOS() {
    if (navigator.userAgent.indexOf("Windows") != -1) {
        return encodeURIComponent(`Windows`);
    } else if (navigator.userAgent.indexOf("Mac OS") != -1) {
        return encodeURIComponent(`Mac OS`);
    } else {
        return encodeURIComponent(`Linux`);
    } 
}

function getScreenHeight() {
    return encodeURIComponent(`${window.innerHeight}px`);
}

function getScreenWidth() {
    return encodeURIComponent(`${window.innerWidth}px`);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : 'rejected';
}

function setCookie(name, value, life) {
    document.cookie = `${name}=${value}; path=/; max-age=${life}; SameSite=Lax`;
}