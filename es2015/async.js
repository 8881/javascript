'use strict';

async function f() {
    throw new Error('error.');
}

f().then(
    v => console.log(v),
    ex => console.log(ex)
);