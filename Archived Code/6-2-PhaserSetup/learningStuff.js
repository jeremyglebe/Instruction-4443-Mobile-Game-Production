console.log("Hello World!"); console.log("Goodbye!");

let username = "Jeremy";

console.log(`${username} is a stupid name! Pick a different one!`);

let a;
var b;
const c = 'CONSTANT VALUE OF SOME KIND';

let arr = [1, 2, 2.5, "Toast", ['a', 'b', 'c']];
console.log(arr);
console.log(arr[3]);

let obj = {
    x: 100,
    y: 23.2,
    name: "Joe",
    hp: 150,
    attack: function () {
        console.log(`${this.name} attacked the enemy!`);
    }
}
console.log(obj);
obj.attack();
obj.y = 25;
obj["y"] = 25;
obj["attack"]();

for (let i = 0; i < 10; i++) {
    console.log(i);
}

console.log("line1\nline2");

function doThing(stuff) {
    return `Did the thing with the ${stuff}`;
}
console.log(doThing("things"));

let f = function () {
    console.log("F in the chat.");
}
f();

function runOnAll(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        func(arr[i]);
    }
}
runOnAll([1, 2, 3, 4],
    function (x) {
        console.log(`x=${x}`);
    }
);

let x = 10;
let y = 6;
function runTwice(func) {
    func();
    func();
}
runTwice(
    () => {
        x *= 2;
        y *= 3;
        console.log(`${x}, ${y}`);
    }
);