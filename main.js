const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const apple = '@'
let life = 1;
let remainingMoves = 50;


class Field {
    constructor(field = [
        []
    ]) {
        this.field = field;
        this.locationX = 0;
        this.locationY = 0;
        // Set the "home" position before the game starts
        this.field[0][0] = pathCharacter;
    }

    runGame() {
        let playing = true;
        while (playing) {
            this.print();
            console.log(`Life Total: ${life}`);
            console.log(`Remaining Moves: ${remainingMoves}`)
            this.askQuestion();
            if (!this.isInBounds()) {
                console.log('Sorry, you have fell off the map!');
                playing = false;
                break;
            } else if (this.isHole() && life === 0) {
                console.log('You have died.');
                playing = false;
                break;
            } 
            else if (this.isHat()) {
                console.log('Hey you have found your hat!');
                playing = false;
                break;
            } else if (remainingMoves === 0) {
                remainingMoves--;
                console.log('To slow, you have died.');
                playing = false;
                break;
            }
            // Update the current location on the map
            if (this.isHole() && life > 0){
                console.log('You have lost a life');
                life -= 1;
                this.field[this.locationY][this.locationX] = fieldCharacter;
        }
            if (this.field[this.locationY][this.locationX] === apple){
                console.log('You have gained a life')
                this.field[this.locationY][this.locationX] = fieldCharacter;
                life += 1;
            }
            if (this.field[this.locationY][this.locationX] === pathCharacter ){
                this.field[this.locationY][this.locationX] = fieldCharacter;
            } else {
                this.field[this.locationY][this.locationX] = pathCharacter;
            };
        }
    }

    askQuestion() {
        const answer = prompt('Which way? ').toUpperCase();
        
        switch (answer) {
            case 'W':
                this.locationY -= 1;
                remainingMoves--;
                break;
            case 'S':
                this.locationY += 1;
                remainingMoves--;
                break;
            case 'A':
                this.locationX -= 1;
                remainingMoves--;
                break;
            case 'D':
                this.locationX += 1;
                remainingMoves--;
                break;
            default:
                console.log('Enter A = left, S = down, D = right or W = up.');
                this.askQuestion();
                break;
        }
    }

    isInBounds() {
        return (
            this.locationY >= 0 &&
            this.locationX >= 0 &&
            this.locationY < this.field.length &&
            this.locationX < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }
    isPrev() {
        return this.field[this.locationY][this.locationX] === pathCharacter;
    }

    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }
    
    isApple(){
        return this.field[this.locationY][this.locationX] === apple;
    }

    print() {
        const displayString = this.field.map(row => {
            return row.join('');
        }).join('\n');
        console.log(displayString);
    }

    static generateField(height, width, percentage = .6, lifeChance =.05) {
        const field = new Array(height).fill(0).map(el => new Array(width));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const prob = Math.random();
                field[y][x] = prob > percentage ? fieldCharacter : prob < lifeChance ? apple : hole ;
            }
        }
        // Set the "hat" location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        // Make sure the "hat" is not at the starting point
        while (hatLocation.x === 0 && hatLocation.y === 0) {
            hatLocation.x = Math.floor(Math.random() * width);
            hatLocation.y = Math.floor(Math.random() * height);
        }
        field[hatLocation.y][hatLocation.x] = hat;
        return field;
    }
}

const myfield = new Field(Field.generateField(15, 20, 0.2));
myfield.runGame();